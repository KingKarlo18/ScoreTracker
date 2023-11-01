import { Team } from "../../entities/team";
import { IRepository } from "../../interfaces/IRepository";

export class TeamRepositoryMock implements IRepository<Team> {
  teams: Team[] = [];

  async find(options?: any): Promise<Team[]> {
    return this.teams;
  }

  async findOne(options: Partial<Team>): Promise<Team | null> {
    const foundOne = this.teams.find((team) =>
      Object.keys(options).every(
        (key) => team[key as keyof Team] === options[key as keyof Team]
      )
    );
    return foundOne || null;
  }

  async findOneBy(where: Partial<Team>): Promise<Team | null> {
    const foundOneBy = this.teams.find((team) =>
      Object.keys(where).every(
        (key) => team[key as keyof Team] === where[key as keyof Team]
      )
    );
    return foundOneBy || null;
  }

  async findBy(where: any): Promise<Team[]> {
    const foundBy = this.teams.filter((team) =>
      Object.keys(where).every((key) => team[key as keyof Team] === where[key])
    );
    return foundBy;
  }

  create(entityLike: any): Team {
    const team = new Team();
    team.id = Math.random();
    team.name = entityLike.name;
    team.sportId = entityLike.sportId;
    team.sport = entityLike.sport ?? [];
    team.players = entityLike.players ?? [];
    team.gameTeams = entityLike.gameTeams ?? [];

    return team;
  }
  async save(team: Team, options?: any): Promise<Team> {
    this.teams.push(team);
    return team;
  }

  async delete(criteria: any): Promise<Team> {
    const index = this.teams.findIndex((team) =>
      Object.keys(criteria).every(
        (key) => team[key as keyof Team] === criteria[key as keyof Team]
      )
    );
    const deleted = this.teams.splice(index, 1)[0];
    return deleted;
  }
}
