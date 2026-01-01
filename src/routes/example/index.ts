import type { FastifyInstance, FastifyPluginAsync } from "fastify";

const example: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    return "this is an example";
  });
};

export default example;
