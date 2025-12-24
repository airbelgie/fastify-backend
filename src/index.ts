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

// Run the server!
fastify.listen({ host: "0.0.0.0", port: 3008 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
