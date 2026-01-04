import crypto from "node:crypto";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "typebox";
import { query } from "../../db/query";

const auth: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "/signup",
    {
      schema: {
        body: Type.Object({
          firstName: Type.String({
            minLength: 1,
          }),
          lastName: Type.String({
            minLength: 1,
          }),
          password: Type.String({
            minLength: 8,
          }),
          passwordConfirmation: Type.String({
            minLength: 8,
          }),
          emailAddress: Type.String({
            format: "email",
          }),
        }),
      },
    },
    async (request, reply) => {
      const {
        password,
        firstName,
        lastName,
        emailAddress,
        passwordConfirmation,
      } = request.body;

      if (password.length < 8) {
        return reply.badRequest("Password not long enough");
      }

      if (password !== passwordConfirmation) {
        return reply.badRequest("Password does not match confirmation");
      }

      const encryptedPassword = crypto.argon2Sync("argon2id", {
        message: password,
        nonce: "testnonceforfuturechanging",
        parallelism: 4,
        tagLength: 64,
        memory: 65536,
        passes: 3,
      });

      const res = await query(
        `
        INSERT INTO users(number, first_name, last_name, password, email_address)
        SELECT floor(random() * 9999) as "number", $1 as "first_name", $2 as "last_name", $3 as "password", $4 as "email_address"
        RETURNING *`,
        [firstName, lastName, encryptedPassword.toString("hex"), emailAddress],
      );
      console.log("user:", res.rows[0]);
    },
  );
};

export default auth;
