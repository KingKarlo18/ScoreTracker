import { Player } from "../../entities/player";
import { Team } from "../../entities/team";
import { IRepository } from "../../interfaces/IRepository";

export class PlayerRepositoryMock implements IRepository<Player> {
  players: Player[] = [];

  async find(options?: any): Promise<Player[]> {
    if (!options || Object.keys(options).length === 0) {
      return this.players;
    }
    return this.players.filter((player) => {
      return Object.keys(options).every(
        (key) => player[key as keyof Player] === options[key as keyof Player]
      );
    });
  }

  async findOne(options: Partial<Player>): Promise<Player | null> {
    const foundOne = this.players.find((player) =>
      Object.keys(options).every(
        (key) => player[key as keyof Player] === options[key as keyof Player]
      )
    );
    return foundOne || null;
  }

  async findOneBy(where: any): Promise<Player | null> {
    const foundOneBy = this.players.find((player) =>
      Object.keys(where).every(
        (key) => player[key as keyof Player] === where[key as keyof Player]
      )
    );
    return foundOneBy || null;
  }

  async findBy(where: any): Promise<Player[]> {
    return this.players.filter((player) =>
      Object.keys(where).every(
        (key) => player[key as keyof Player] === where[key]
      )
    );
  }

  create(entityLike: any): Player {
    const player = new Player();
    player.id = Math.random();
    player.name = entityLike.name;
    player.jersyNumber = entityLike.jersyNumber;
    player.position = entityLike.position;
    player.team = entityLike.team ?? new Team();
    player.games = entityLike.games ?? [];

    return player;
  }

  async save(player: Player, options?: any): Promise<Player> {
    this.players.push(player);
    return player;
  }

  async delete(criteria: any): Promise<Player> {
    const index = this.players.findIndex((player) =>
      Object.keys(criteria).every(
        (key) => player[key as keyof Player] === criteria[key as keyof Player]
      )
    );
    const deleted = this.players.splice(index, 1)[0];
    return deleted;
  }
}
