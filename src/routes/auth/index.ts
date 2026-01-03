import type {
  FastifyInstance,
  FastifyPluginAsync,
  RequestGenericInterface,
} from "fastify";
import { query } from "../../db/query";

interface SignupRequest extends RequestGenericInterface {
  Body: {
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  };
}

const auth: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post<SignupRequest>("/signup", async (request, reply) => {
    const { password, firstName, lastName } = request.body;

    if (password.length < 8) {
      return reply.badRequest("Password not long enough");
    }

    const res = await query(
      "INSERT INTO users(username, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *",
      ["BLG001", firstName, lastName, password],
    );
    console.log("user:", res.rows[0]);
  });
};

export default auth;
