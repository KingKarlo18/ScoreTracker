import { FastifyPluginAsync } from "fastify";
import { DataSource } from "typeorm";
import { Sport } from "../entities/sport";
import { Team } from "../entities/team";
import { SportService } from "../services/sportService";
import { TeamService } from "../services/teamService";
import { Game } from "../entities/game";
import { GameService } from "../services/gameService";
import { GameTeam } from "../entities/gameTeam";
import { Player } from "../entities/player";
import { PlayerService } from "../services/playerService";
import { TeamController } from "../controllers/teamController";
import { PlayerController } from "../controllers/playerController";
import { SportController } from "../controllers/sportController";
import { UserService } from "../services/userService";
import { User, UserRole } from "../entities/user";
import { UserController } from "../controllers/userController";

export const scoreTrackerPlugin: FastifyPluginAsync = async (server) => {
  const database = (server as any).database as DataSource;
  const sportRepo = database.getRepository(Sport);
  const teamRepo = database.getRepository(Team);
  const gameRepo = database.getRepository(Game);
  const playerRepo = database.getRepository(Player);
  const gameTeamsRepo = database.getRepository(GameTeam);
  const userRepo = database.getRepository(User);
  const sportService = new SportService(sportRepo, teamRepo);
  const teamService = new TeamService(teamRepo, gameRepo);
  const playerService = new PlayerService(playerRepo, teamService);
  const gameService = new GameService(gameRepo, gameTeamsRepo, teamService);
  const sportController = new SportController(sportService);
  const teamController = new TeamController(teamService);
  const playerController = new PlayerController(playerService);
  const userService = new UserService(userRepo);
  const userController = new UserController(userService);

  server.route<{
    Querystring: {
      limit: number;
    };
  }>({
    method: "GET",
    url: "/sports",
    schema: {
      querystring: {
        type: "object",
        properties: {
          limit: { type: "number", default: 10, minimum: 1, maximum: 100 },
        },
      },
    },
    async handler(req, h) {
      return await sportController.getAll(req, h);
    },
  });

  server.route<{
    Params: { name: string };
  }>({
    method: "GET",
    url: "/sports/:name",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    schema: {
      params: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
    },
    async handler(req, h) {
      return await sportController.getByName(req, h);
    },
  });

  server.route<{
    Body: { name: string };
  }>({
    method: "POST",
    url: "/sports",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("admin")],
    schema: {
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
    },
    async handler(req, h) {
      return sportController.create(req, h);
    },
  });

  server.route({
    method: "GET",
    url: "/teams",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    async handler(req, res) {
      await teamController.getAll(req, res /*, server.jwt*/);
    },
  });

  server.route<{
    Body: { name: string; sportId: number };
  }>({
    method: "POST",
    url: "/teams",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("admin")],
    schema: {
      body: {
        type: "object",
        required: ["name", "sportId"],
        properties: {
          name: { type: "string" },
          sportId: { type: "number" },
        },
      },
    },
    async handler(req, res) {
      await teamController.create(req, res);
    },
  });

  server.route<{
    Params: {
      name: string;
    };
  }>({
    method: "GET",
    url: "/teams/:name",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    schema: {
      params: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
    },
    async handler(req, res) {
      await teamController.getByName(req, res);
    },
  });

  server.route<{
    Body: {
      homeTeam: string;
      awayTeam: string;
      homeTeamScore?: number;
      awayTeamScore?: number;
    };
  }>({
    method: "POST",
    url: "/games",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("admin")],
    schema: {
      body: {
        type: "object",
        required: ["homeTeam", "awayTeam"],
        properties: {
          homeTeam: { type: "string" },
          awayTeam: { type: "string" },
          homeTeamScore: { type: "number" },
          awayTeamScore: { type: "number" },
        },
      },
    },
    async handler(req, res) {
      const body = req.body;

      const game = await gameService.create(
        body.homeTeam,
        body.awayTeam,
        body.homeTeamScore ?? 0,
        body.awayTeamScore ?? 0
      );
      return game;
    },
  });

  server.route({
    method: "GET",
    url: "/games",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    async handler(req, res) {
      const games = await gameService.all();
      return games;
    },
  });

  server.route<{
    Params: {
      sportId: number;
    };
  }>({
    method: "GET",
    url: "/games/sport/:sportId",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    schema: {
      params: {
        type: "object",
        required: ["sportId"],
        properties: {
          sportId: { type: "number" },
        },
      },
    },
    async handler(req, res) {
      const sportId = req.params.sportId;
      const games = await gameService.allBySport(sportId);
      return games;
    },
  });

  server.route<{
    Params: { sportId: number };
  }>({
    method: "GET",
    url: "/table/:sportId",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    schema: {
      params: {
        type: "object",
        required: ["sportId"],
        properties: {
          sportId: { type: "number" },
        },
      },
    },
    async handler(req, res) {
      return await teamController.displayTable(req, res);
    },
  });

  server.route<{
    Params: { sportId: number };
  }>({
    method: "GET",
    url: "/teams/sport/:sportId",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    schema: {
      params: {
        type: "object",
        required: ["sportId"],
        properties: {
          sportId: { type: "number" },
        },
      },
    },
    async handler(req, res) {
      return await teamController.allBySportId(req, res);
    },
  });

  server.route<{
    Body: {
      playerName: string;
      teamId: number;
      position: string;
      jersyNumber: number;
    };
  }>({
    method: "POST",
    url: "/players",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("admin")],
    schema: {
      body: {
        type: "object",
        required: ["playerName", "teamId", "position", "jersyNumber"],
        properties: {
          playerName: { type: "string" },
          teamId: { type: "number" },
          position: { type: "string" },
          jersyNumber: { type: "number" },
        },
      },
    },
    async handler(req, res) {
      return await playerController.create(req, res);
    },
  });

  server.route<{
    Params: {
      name: string;
    };
  }>({
    method: "GET",
    url: "/players/:name",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    schema: {
      params: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
    },
    async handler(req, res) {
      return await playerController.getByName(req, res);
    },
  });

  server.route({
    method: "GET",
    url: "/players",
    onRequest: [(server as any).authenticate],
    preHandler: [(server as any).authorize("guest")],
    async handler(req, res) {
      return await playerController.getAll(req, res);
    },
  });

  server.route<{
    Body: {
      userName: string;
      password: string;
    };
  }>({
    method: "POST",
    url: "/user/login",
    // onRequest: [(server as any).authenticate],
    // preHandler: [(server as any).authorize("guest")],
    schema: {
      body: {
        type: "object",
        required: ["userName", "password"],
        properties: {
          userName: { type: "string" },
          password: { type: "string" },
        },
      },
    },
    async handler(req, res) {
      //Napisati funkcionalnost za tokene
      return await userController.login(req, res);
    },
  });

  server.route<{
    Body: {
      userName: string;
      password: string;
      role: UserRole;
    };
  }>({
    method: "POST",
    url: "/user/register",
    // onRequest: [(server as any).authenticate],
    // preHandler: [(server as any).authorize("guest")],
    schema: {
      body: {
        type: "object",
        required: ["userName", "password", "role"],
        properties: {
          userName: { type: "string" },
          password: { type: "string" },
          role: { enum: Object.values(UserRole) },
        },
      },
    },
    async handler(req, res) {
      return await userController.register(req, res);
    },
  });
};

// server.jwt.lookupToken(); // za citanje podataka iz tokena
