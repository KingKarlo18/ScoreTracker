import { FastifyReply, FastifyRequest } from "fastify";
import { TeamService } from "../services/teamService";

export class TeamController {
  constructor(private teamService: TeamService) {}

  async create(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const body = req.body as any;

    try {
      const team = this.teamService.create(body.name, body.sportId);
      res.status(200).send(team);
    } catch (error) {
      if ((error as any).message.includes("Team must have")) {
        res.status(400).send({ message: (error as any).message });
        throw error;
      }
    }
  }

  async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const teams = await this.teamService.all();
    if (!teams.length) {
      return res.status(400).send({ message: "There are no teams" });
    } else {
      res.status(200).send(teams);
    }
  }

  async getByName(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const params = req.params as any;
    const name = params.name;
    const team = await this.teamService.find({ name });
    if (!team) {
      res.status(400).send({ message: "There are no teams with that name" });
    } else {
      res.status(200).send(team);
    }
  }

  async allBySportId(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const params = req.params as any;
    const sportId = params.sportId;

    const teams = await this.teamService.allBySportId(sportId);
    if (teams.length === 0) {
      res.status(400).send({ message: "There are no teams with this sportId" });
    } else {
      res.status(200).send(teams);
    }
  }

  async displayTable(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const params = req.params as any;
    const sportId = params.sportId;
    res.status(200).send(this.teamService.displayTable(sportId));
  }
}
