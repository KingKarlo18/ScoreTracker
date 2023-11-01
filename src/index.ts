require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Sport } from "./entities/sport";
import { Team } from "./entities/team";
import { Player } from "./entities/player";
import { Game } from "./entities/game";
import server from "./api";
import { GameTeam } from "./entities/gameTeam";
import { GamePlayer } from "./entities/gamePlayer";
import { User } from "./entities/user";
import { secretKey } from "./config/configuration";

const { NODE_ENV, PORT = "3000", DATABASE_TYPE, DATABASE_URL } = process.env;

async function main() {
  const database = new DataSource({
    type: DATABASE_TYPE as any,
    database: DATABASE_URL,
    synchronize: NODE_ENV === "development",
    logging: NODE_ENV === "development",
    entities: [Sport, Game, Player, Team, GameTeam, GamePlayer, User],
  });

  await database.initialize();

  server.decorate("database", database);

  const address = await server.listen({
    port: +PORT,
  });

  async function shutdownHandler(signal: string) {
    await server.close();
    process.exit();
  }

  process.on("SIGINT", shutdownHandler.bind(null, "SIGINT"));
  process.on("SIGTERM", shutdownHandler.bind(null, "SIGTERM"));

  // server.log.info("listening on %s", address);
}

main().catch((err) => {
  console.log("error %s", err);
  process.exit(1);
});
