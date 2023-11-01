import { FastifyReply, FastifyRequest } from "fastify";
import { PlayerService } from "../services/playerService";

export class PlayerController {
  constructor(private playerService: PlayerService) {}

  async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const body = req.body as any;
    const player = await this.playerService.create(
      body.playerName,
      body.teamId,
      body.position,
      body.jersyNumber
    );
    if (!player) {
      res.code(400).send({ message: "Can't create new player" });
    } else {
      res.status(200).send(player);
    }
  }

  async getByName(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const params = req.params as any;
    const name = params.name;
    const player = await this.playerService.find({ name });
    if (!player) {
      res.code(400).send({ message: "No players with that name" });
    } else {
      res.code(200).send(player);
    }
  }

  async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const players = await this.playerService.all();
    if (!players) {
      res.code(400).send({ message: "There are no players" });
    } else {
      res.code(200).send(players);
    }
  }
}
