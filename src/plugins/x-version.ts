import fp from "fastify-plugin";

/**
 * This plugin adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify) => {
  fastify.addHook("onSend", async (_, reply) => {
    reply.header("X-API-Version", `1.0.0-${process.env.COMMIT_SHA}`);
  });
});
