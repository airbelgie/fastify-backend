import "./instrument/index";

import * as Sentry from "@sentry/node";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

Sentry.setupFastifyErrorHandler(fastify);

// Declare a route
fastify.get("/", (_, reply) => {
  reply.send({ hello: "world" });
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

// Run the server!
fastify.listen({ host: "0.0.0.0", port: 3008 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
