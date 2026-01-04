import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "typebox";
import {
  checkUserLogin,
  createAccessToken,
  createUser,
} from "../../services/authService";

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

      const res = await createUser({
        firstName,
        lastName,
        password,
        emailAddress,
      });
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

      try {
        const passwordVerification = await checkUserLogin(
          emailAddress,
          password,
        );

        if (passwordVerification) {
          return {
            accessToken: fastify.jwt.sign(createAccessToken(emailAddress)),
          };
        }
      } catch {
        reply.badRequest("Failure");
      }

      reply.badRequest("Something bad happened");
    },
  );
};

export default auth;
