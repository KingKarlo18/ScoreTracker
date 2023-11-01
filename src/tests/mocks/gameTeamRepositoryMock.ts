import { GameTeam } from "../../entities/gameTeam";
import { IRepository } from "../../interfaces/IRepository";

export class gameTeamRepositoryMock implements IRepository<GameTeam> {
  gameTeams: GameTeam[] = [];

  async find(options?: any): Promise<GameTeam[]> {
    return this.gameTeams;
  }

  async findOne(options: any): Promise<GameTeam | null> {
    const foundOne = this.gameTeams.find((gameTeam) =>
      Object.keys(options).every(
        (key) =>
          gameTeam[key as keyof GameTeam] === options[key as keyof GameTeam]
      )
    );
    return foundOne || null;
  }
  async findOneBy(where: any): Promise<GameTeam | null> {
    const foundOneBy = this.gameTeams.find((gameTeam) =>
      Object.keys(where).every(
        (key) =>
          gameTeam[key as keyof GameTeam] === where[key as keyof GameTeam]
      )
    );
    return foundOneBy || null;
  }

  async findBy(where: any): Promise<GameTeam[]> {
    const foundBy = this.gameTeams.filter((gameTeam) =>
      Object.keys(where).every(
        (key) =>
          gameTeam[key as keyof GameTeam] === where[key as keyof GameTeam]
      )
    );
    return foundBy;
  }

  create(entityLike: any): GameTeam {
    const gameTeam = new GameTeam();
    gameTeam.id = Math.random();
    gameTeam.gameId = entityLike.gameId;
    gameTeam.teamId = entityLike.team.id;
    gameTeam.side = entityLike.side;
    gameTeam.game = entityLike.game;
    gameTeam.game.gameTeams?.push(gameTeam);
    return gameTeam;
  }

  async save(gameTeam: GameTeam, options?: any): Promise<GameTeam> {
    this.gameTeams.push(gameTeam);
    return gameTeam;
  }

  async delete(criteria: any): Promise<GameTeam> {
    const index = this.gameTeams.findIndex((gameTeam) =>
      Object.keys(criteria).every(
        (key) =>
          gameTeam[key as keyof GameTeam] === criteria[key as keyof GameTeam]
      )
    );
    const deleted = this.gameTeams.splice(index, 1)[0];
    return deleted;
  }
}
