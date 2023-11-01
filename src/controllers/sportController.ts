import {
  CreateSportError,
  CreateSportErrorCode,
  SportService,
} from "../services/sportService";
import { FastifyReply, FastifyRequest } from "fastify";

export class SportController {
  constructor(private sportService: SportService) {}

  async create(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as any;

    try {
      const sport = this.sportService.create(body.name);
      res.status(200).send(sport);
    } catch (error) {
      if (error instanceof CreateSportError) {
        const code =
          error.code === CreateSportErrorCode.NameAlreadyTaken ? 409 : 400;
        res.code(code).send({ message: error.message });
        throw error;
      }
    }
  }

  async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const sports = await this.sportService.all();
    if (!sports.length) {
      res.status(400).send({ message: "There are no sports" });
    } else {
      res.status(200).send(sports);
    }
  }

  async getByName(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const params = req.params as any;
    const name = params.name;
    const sports = await this.sportService.getByName(name);
    if (!sports) {
      res.status(400).send({ message: "There are no sports with that name" });
    } else {
      res.status(200).send(sports);
    }
  }
}
