import { Sport } from "../../entities/sport";
import { IRepository } from "../../interfaces/IRepository";

export class SportRepositoryMock implements IRepository<Sport> {
  sports: Sport[] = [];

  async find(options?: any): Promise<Sport[]> {
    return this.sports;
  }

  async findOne(options: any): Promise<Sport | null> {
    const foundOne = this.sports.find((sport) =>
      Object.keys(options).every(
        (key) => sport[key as keyof Sport] === options[key as keyof Sport]
      )
    );
    return foundOne || null;
  }

  async findOneBy(where: any): Promise<Sport | null> {
    const foundOneBy = this.sports.find((sport) =>
      Object.keys(where).every(
        (key) => sport[key as keyof Sport] === where[key as keyof Sport]
      )
    );
    return foundOneBy || null;
  }

  async findBy(where: any): Promise<Sport[]> {
    const foundBy = this.sports.filter((sport) =>
      Object.keys(where).every(
        (key) => sport[key as keyof Sport] === where[key as keyof Sport]
      )
    );
    return foundBy;
  }

  create(entityLike: any): Sport {
    const sport = new Sport();
    sport.id = Math.random();
    sport.name = entityLike.name;
    sport.teams = entityLike.teams ?? [];
    return sport;
  }

  async save(sport: Sport, options?: any): Promise<Sport> {
    this.sports.push(sport);
    return sport;
  }

  async delete(criteria: any): Promise<Sport> {
    const index = this.sports.findIndex((sport) =>
      Object.keys(criteria).every(
        (key) => sport[key as keyof Sport] === criteria[key as keyof Sport]
      )
    );
    const deleted = this.sports.splice(index, 1)[0];
    return deleted;
  }
}
