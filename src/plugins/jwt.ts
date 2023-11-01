import fp from "fastify-plugin";
// import { secretKey } from "../config/configuration";
import jwtPlugin from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

function authorize(
  role: string
): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if ((user as any).role !== role) {
      reply.code(401).send({ message: "Unautorized" });
    }
  };
}

export default fp(function (fastify, opts, done) {
  fastify.register(jwtPlugin, {
    // Trebalo bi mi povlačiti secret key iz .env ili iz enviromental varijalbe u sistemu
    secret: "TOP_SECRET_KEY",
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.decorate("authorize", authorize);
  done();
});
