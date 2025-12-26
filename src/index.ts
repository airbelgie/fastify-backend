import fastify from "./app";

// Run the server!
fastify.listen({ host: "0.0.0.0", port: 3008 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
