import { GamePlayer } from "../../entities/gamePlayer";
import { IRepository } from "../../interfaces/IRepository";

export class GamePlayerRepositoryMock implements IRepository<GamePlayer> {
  gamePlayers: GamePlayer[] = [];

  async find(options?: any): Promise<GamePlayer[]> {
    return this.gamePlayers;
  }

  async findOne(options: any): Promise<GamePlayer | null> {
    const foundOne = this.gamePlayers.find((gamePlayer) =>
      Object.keys(options).every(
        (key) =>
          options[key as keyof GamePlayer] ===
          gamePlayer[key as keyof GamePlayer]
      )
    );
    return foundOne || null;
  }

  async findOneBy(where: any): Promise<GamePlayer | null> {
    const foundOneBy = this.gamePlayers.find((gamePlayer) =>
      Object.keys(where).every(
        (key) =>
          where[key as keyof GamePlayer] === gamePlayer[key as keyof GamePlayer]
      )
    );
    return foundOneBy || null;
  }

  async findBy(where: any): Promise<GamePlayer[]> {
    const foundBy = this.gamePlayers.filter((gamePlayer) =>
      Object.keys(where).every(
        (key) =>
          gamePlayer[key as keyof GamePlayer] === where[key as keyof GamePlayer]
      )
    );
    return foundBy;
  }

  create(entityLike: any): GamePlayer {
    const gamePlayer = new GamePlayer();
    gamePlayer.id = Math.random();
    gamePlayer.goals = entityLike.goals;
    gamePlayer.player = entityLike.player;
    gamePlayer.game = entityLike.game;
    return gamePlayer;
  }

  async save(gamePlayer: GamePlayer, options?: any): Promise<GamePlayer> {
    this.gamePlayers.push(gamePlayer);
    return gamePlayer;
  }

  async delete(criteria: any): Promise<GamePlayer> {
    const index = this.gamePlayers.findIndex((gamePlayer) =>
      Object.keys(criteria).every(
        (key) =>
          gamePlayer[key as keyof GamePlayer] ===
          criteria[key as keyof GamePlayer]
      )
    );
    const deleted = this.gamePlayers.splice(index, 1)[0];
    return deleted;
  }
}
