import { join } from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import fastifyJwt from "@fastify/jwt";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import * as Sentry from "@sentry/node";
import Fastify from "fastify";
import fastifyPrintRoutes from "fastify-print-routes";

import "./instrument/index";

const fastify = Fastify({
  // logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(fastifyPrintRoutes);
await fastify.register(fastifyJwt, {
  secret:
    "c8a87e113fa4c234f300d17deac70260fd665b6297a8f45e1ea4de8da2242c917da3b84cf8ce5e9f4a3d1c76d2d96896610141b9679c5360144a34402d984d57",
});

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
