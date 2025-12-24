import * as Sentry from "@sentry/node";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get("/", (_, reply) => {
    reply.notFound();
  });

  fastify.get("/async", async () => {
    throw fastify.httpErrors.notFound();
  });

  fastify.get("/async-return", async (_, reply) => {
    return reply.notFound();
  });

  fastify.get("/debug-sentry", function mainHandler() {
    // Send a log before throwing the error
    Sentry.logger.info("User triggered test error", {
      action: "test_error_endpoint",
    });
    // Send a test metric before throwing the error
    Sentry.metrics.count("test_counter", 1);
    throw new Error("My first Sentry error!");
  });
};

export default root;
