import supertest from "supertest";
import { afterAll, expect, test } from "vitest";
import app from "../app";

test("with HTTP injection", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/",
  });

  expect(response.statusCode).toBe(404);
});

test("with a running server", async () => {
  await app.ready();

  await supertest(app.server).get("/").expect(404);
});

afterAll(async () => {
  await app.close();
});
