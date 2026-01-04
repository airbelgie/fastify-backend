import argon2 from "argon2";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { __resetMocks, __setMockQueryResponses } from "../__mocks__/pg";
import app from "../app";

describe("Auth Routes", () => {
  beforeEach(() => {
    __resetMocks();
  });

  afterEach(() => {
    __resetMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /auth/signup", () => {
    test("creates user with valid data", async () => {
      __setMockQueryResponses([
        {
          rows: [
            {
              number: 1234,
              first_name: "John",
              last_name: "Doe",
              email_address: "john@example.com",
            },
          ],
          rowCount: 1,
        },
      ]);

      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          firstName: "John",
          lastName: "Doe",
          password: "securePassword123",
          passwordConfirmation: "securePassword123",
          emailAddress: "john@example.com",
        },
      });

      expect(response.statusCode).toBe(200);
    });

    test("returns 400 when password is too short", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          firstName: "John",
          lastName: "Doe",
          password: "short",
          passwordConfirmation: "short",
          emailAddress: "john@example.com",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("returns 400 when password and confirmation do not match", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          firstName: "John",
          lastName: "Doe",
          password: "securePassword123",
          passwordConfirmation: "differentPassword123",
          emailAddress: "john@example.com",
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({
        message: "Password does not match confirmation",
      });
    });

    test("returns 400 when email format is invalid", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          firstName: "John",
          lastName: "Doe",
          password: "securePassword123",
          passwordConfirmation: "securePassword123",
          emailAddress: "not-an-email",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("returns 400 when firstName is empty", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          firstName: "",
          lastName: "Doe",
          password: "securePassword123",
          passwordConfirmation: "securePassword123",
          emailAddress: "john@example.com",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("returns 400 when required fields are missing", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/signup",
        payload: {
          firstName: "John",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    test("returns access token with valid credentials", async () => {
      const hashedPassword = await argon2.hash("correctPassword123");

      __setMockQueryResponses([
        {
          rows: [{ password: hashedPassword }],
          rowCount: 1,
        },
      ]);

      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          emailAddress: "john@example.com",
          password: "correctPassword123",
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toHaveProperty("accessToken");
      expect(typeof body.accessToken).toBe("string");
    });

    test("returns 400 when user not found", async () => {
      __setMockQueryResponses([
        {
          rows: [],
          rowCount: 0,
        },
      ]);

      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          emailAddress: "nonexistent@example.com",
          password: "somePassword123",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("returns 400 when password is incorrect", async () => {
      const hashedPassword = await argon2.hash("correctPassword123");

      __setMockQueryResponses([
        {
          rows: [{ password: hashedPassword }],
          rowCount: 1,
        },
      ]);

      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          emailAddress: "john@example.com",
          password: "wrongPassword123",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("returns 400 when email format is invalid", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          emailAddress: "not-an-email",
          password: "somePassword123",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    test("returns 400 when password is too short", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          emailAddress: "john@example.com",
          password: "short",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /auth/test (Protected Route)", () => {
    test("returns user data with valid JWT", async () => {
      const hashedPassword = await argon2.hash("correctPassword123");

      __setMockQueryResponses([
        {
          rows: [{ password: hashedPassword }],
          rowCount: 1,
        },
      ]);

      // First login to get a token
      const loginResponse = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          emailAddress: "john@example.com",
          password: "correctPassword123",
        },
      });

      const { accessToken } = loginResponse.json();

      // Use the token to access protected route
      const protectedResponse = await app.inject({
        method: "GET",
        url: "/auth/test",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      expect(protectedResponse.statusCode).toBe(200);
      const body = protectedResponse.json();
      expect(body).toHaveProperty("sub", "john@example.com");
    });

    test("returns 401 when authorization header is missing", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/auth/test",
      });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toMatchObject({
        message: "Authentication required",
      });
    });

    test("returns 401 when JWT is invalid", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/auth/test",
        headers: {
          authorization: "Bearer invalid.jwt.token",
        },
      });

      expect(response.statusCode).toBe(401);
    });

    test("returns 401 when JWT is expired", async () => {
      // Create an expired token by signing with a past expiry
      await app.ready();
      const expiredToken = app.jwt.sign(
        { sub: "john@example.com" },
        { expiresIn: "-1h" },
      );

      const response = await app.inject({
        method: "GET",
        url: "/auth/test",
        headers: {
          authorization: `Bearer ${expiredToken}`,
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
