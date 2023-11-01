import Fastify from "fastify";
import { scoreTrackerPlugin } from "./scoreTracker";
import jwtPlugin from "../plugins/jwt";

const server = Fastify({
  logger: true,
});

server.register(jwtPlugin);
server.register(scoreTrackerPlugin);

server.get("/long", (req, res) => {
  setTimeout(() => {
    res.send("hello");
  }, 5000);
});

export default server;
