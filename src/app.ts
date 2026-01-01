import { join } from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import * as Sentry from "@sentry/node";
import Fastify from "fastify";
import fastifyPrintRoutes from "fastify-print-routes";

import "./instrument/index";

const fastify = Fastify({
  // logger: true,
});

await fastify.register(fastifyPrintRoutes);

if (process.env.NODE_ENV !== "local") {
  Sentry.setupFastifyErrorHandler(fastify);
}

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

export default fastify;
