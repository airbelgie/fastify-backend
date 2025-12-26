import * as Sentry from "@sentry/node";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import pg from "pg";

const root: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    const { Pool } = pg;

    const pool = new Pool();

    const res = await pool.query("SELECT NOW()");
    console.log("user:", res.rows[0]);

    return reply.notFound();
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
