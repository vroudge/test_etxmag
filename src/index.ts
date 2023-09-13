import Fastify from "fastify";

const fastify = Fastify({
  logger: true
});

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (error) {
    console.error(error);
    fastify.log.error(error);
  }
}

start();