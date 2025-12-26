import supertest from "supertest";
import { afterAll, expect, test } from "vitest";

import app from "./index";

test("with HTTP injection", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/",
  });

  expect(response.statusCode).toBe(404);
  // expect(JSON.parse(response.payload)).toHaveLength(4);
  // expect(response.body).toStrictEqual(usersData);
});

test("with a running server", async () => {
  await app.ready();

  await supertest(app.server).get("/").expect(404);

  // expect(response.body).toHaveLength(4);
  // expect(response.body).toStrictEqual(usersData);
});

afterAll(async () => {
  await app.close();
});
