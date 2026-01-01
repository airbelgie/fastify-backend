import type { FastifyInstance, FastifyPluginAsync } from "fastify";

const auth: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    return "this is an example";
  });
};

export default auth;
