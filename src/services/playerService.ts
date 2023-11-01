import { Player } from "../entities/player";
import { TeamService } from "./teamService";
import { IRepository } from "../interfaces/IRepository";
import { Repository } from "typeorm";

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type FindPlayerParam = {
  name?: string;
  id?: number;
};

export class PlayerService {
  constructor(
    private readonly playerRepo: IRepository<Player>,
    private readonly teamService: TeamService
  ) {}

  async create(
    playerName: string,
    teamId: number,
    position: string,
    jersyNumber: number
  ): Promise<Player> {
    const existingTeam = await this.teamService.findOne({ id: teamId });
    const existingPlayerByJearsyNumber = await this.playerRepo.findOneBy({
      jersyNumber: jersyNumber,
    });

    if (typeof existingTeam === "undefined") {
      throw new Error("Team for this player does not exist");
    }

    if (typeof existingPlayerByJearsyNumber !== "undefined") {
      throw new Error("Player with that jersy number already exist");
    }

    if (position === "GK") {
      const playerWithGKPositionExist = await this.playerRepo.findOneBy({
        position: position,
      });
      if (playerWithGKPositionExist) {
        throw new Error("Goalkeeper already exist");
      }
    }

    const player = this.playerRepo.create({
      name: playerName,
      position: position,
      jersyNumber: jersyNumber,
      team: existingTeam,
    });
    await this.playerRepo.save(player);

    return player;
  }

  async all(): Promise<Player[]> {
    const players = await this.playerRepo.find();
    if (!players) {
      console.log("There are no players created");
    }
    return players;
  }

  async find(param: FindPlayerParam): Promise<Player | Player[] | undefined> {
    let query: { [key: string]: any } = {};
    let player;
    if (param.id) {
      query.id = param.id;
      player = await this.playerRepo.find({
        where: {
          id: query.id,
        },
      });
    }
    if (param.name) {
      query.name = param.name;
      player = await this.playerRepo.find({
        where: {
          name: query.name,
        },
      });
    }

    if (!player) {
      if (typeof param === "string") {
        console.log("Player with name: %s does not exist", param);
      } else {
        console.log("Player with id: %d does not exist", param);
      }
    }
    return player;
  }

  async findOne(param: FindPlayerParam): Promise<Player | undefined> {
    let player;
    const keys = Object.keys(param);
    if (keys.includes("id")) {
      player = await this.playerRepo.findOneBy({
        id: param.id,
      });
    }
    if (keys.includes("name")) {
      player = await this.playerRepo.findOneBy({
        name: param.name,
      });
    }

    if (!player) {
      if (typeof param.name === "string") {
        console.log("Player with name: %s does not exist", param.name);
      } else if (typeof param.id === "number") {
        console.log("Player with id: %d does not exist", param.id);
      }
    } else {
      return player;
    }
  }

  async isJerseyNumberTaken(playerJersyNumber: number): Promise<boolean> {
    const player = await this.playerRepo.findOneBy({
      jersyNumber: playerJersyNumber,
    });
    if (!player) {
      return true;
    }
    return false;
  }

  async deleteById(id: number) {
    this.playerRepo.delete({
      id: id,
    });
    const isDeleted = await this.playerRepo.findBy({ id: id });
    if (isDeleted == null) {
      console.log("Player with id: %d is succesfully deleted", id);
    }
  }
}
