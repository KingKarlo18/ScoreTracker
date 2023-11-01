import { Game } from "../../entities/game";
import { IRepository } from "../../interfaces/IRepository";

export class GameRepositoryMock implements IRepository<Game> {
  games: Game[] = [];

  async find(options?: any): Promise<Game[]> {
    return this.games;
  }

  async findOne(options: any): Promise<Game | null> {
    const foundOne = this.games.find((game) =>
      Object.keys(options).every(
        (key) => game[key as keyof Game] === options[key as keyof Game]
      )
    );
    return foundOne || null;
  }

  async findOneBy(where: any): Promise<Game | null> {
    const foundOneBy = this.games.find((game) =>
      Object.keys(where).every(
        (key) => game[key as keyof Game] === where[key as keyof Game]
      )
    );
    return foundOneBy || null;
  }

  async findBy(where: any): Promise<Game[]> {
    const foundBy = this.games.filter((game) =>
      Object.keys(where).every(
        (key) => game[key as keyof Game] === where[key as keyof Game]
      )
    );
    return foundBy;
  }

  create(entityLike: any): Game {
    const game = new Game();
    game.id = Math.random();
    game.sportId = entityLike.sportId;
    game.gameTeams = entityLike.gameTeams ?? [];
    game.awayTeamScore = entityLike.awayTeamScore;
    game.homeTeamScore = entityLike.homeTeamScore;
    game.players = entityLike.players ?? [];
    return game;
  }

  async save(game: Game, options?: any): Promise<Game> {
    this.games.push(game);
    return game;
  }

  async delete(criteria: any): Promise<Game> {
    const index = this.games.findIndex((game) =>
      Object.keys(criteria).every(
        (key) => game[key as keyof Game] === criteria[key as keyof Game]
      )
    );
    const deleted = this.games.splice(index, 1)[0];
    return deleted;
  }
}
