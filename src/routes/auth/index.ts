import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { hash, verify } from "argon2";
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

      const encryptedPassword = await hash(password);

      const res = await query(
        `
        INSERT INTO users(number, first_name, last_name, password, email_address)
        SELECT floor(random() * 9999) as "number", $1 as "first_name", $2 as "last_name", $3 as "password", $4 as "email_address"
        RETURNING *`,
        [firstName, lastName, encryptedPassword, emailAddress],
      );
      console.log("user:", res.rows[0]);
    },
  );

  fastify.post(
    "/login",
    {
      schema: {
        body: Type.Object({
          emailAddress: Type.String({
            format: "email",
          }),
          password: Type.String({
            minLength: 8,
          }),
        }),
      },
    },
    async (request, reply) => {
      const { password, emailAddress } = request.body;

      const userQuery = await query(
        `SELECT password FROM users WHERE email_address = $1`,
        [emailAddress],
      );

      if (userQuery.rowCount !== 1) {
        reply.badRequest("Failure");
      }

      const passwordVerification = await verify(
        userQuery.rows[0].password,
        password,
      );

      if (passwordVerification) {
        return {
          message: "ok",
        };
      }

      reply.badRequest("Failure");
    },
  );
};

export default auth;
