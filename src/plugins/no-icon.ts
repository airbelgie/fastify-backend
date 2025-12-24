import noIcon from "fastify-no-icon";
import fp from "fastify-plugin";

/**
 * This plugin returns empty 404 to Favicon requests
 *
 * @see https://github.com/jsumners/fastify-no-icon
 */
export default fp(async (fastify) => {
  fastify.register(noIcon);
});
