import "./instrument/index";

import { join } from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import * as Sentry from "@sentry/node";
import Fastify from "fastify";

const fastify = Fastify({
  // logger: true,
});

Sentry.setupFastifyErrorHandler(fastify);

// Load all plugins from /plugins
const pluginOptions: Partial<AutoloadPluginOptions> = {
  // Place your custom options the autoload plugin below here.
};

fastify.register(AutoLoad, {
  dir: join(import.meta.dirname, "plugins"),
  options: pluginOptions,
});

fastify.register(AutoLoad, {
  dir: join(import.meta.dirname, "routes"),
  options: pluginOptions,
});

// Run the server!
fastify.listen({ host: "0.0.0.0", port: 3008 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

export default fastify;
