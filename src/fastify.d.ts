import fastify, { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request, reply) => Promise<void>;
    authorize: (role: string) => (request, reply) => Promise<void>;
  }
}
