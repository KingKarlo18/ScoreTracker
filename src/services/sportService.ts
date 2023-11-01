import { Repository } from "typeorm";
import { Team } from "../entities/team";
import { Sport } from "../entities/sport";

export class SportService {
  constructor(
    private readonly sportRepo: Repository<Sport>,
    private readonly teamRepo: Repository<Team>
  ) {}

  async all(): Promise<Sport[]> {
    const sports = await this.sportRepo.find();
    return sports;
  }

  async getByName(name: string): Promise<Sport | Sport[] | undefined> {
    const sport = await this.sportRepo.find({
      where: {
        name: name,
      },
    });
    return sport;
  }

  async create(name: string, items?: any[]): Promise<Sport> {
    if (name.length < 4) {
      throw new CreateSportError(CreateSportErrorCode.NameTooShort);
    }
    if (name.length > 20) {
      throw new CreateSportError(CreateSportErrorCode.NameTooLong);
    }
    const checkSportName = this.getByName(name);
    if (typeof checkSportName != undefined && typeof checkSportName != null) {
      throw new CreateSportError(CreateSportErrorCode.NameAlreadyTaken);
    }

    const sport = this.sportRepo.create({ name });
    await this.sportRepo.save(sport);

    for (const iterator of items ?? []) {
      await this.teamRepo.save(sport, ...iterator);
    }
    return sport;
  }
}

export enum CreateSportErrorCode {
  NameTooLong = 1,
  NameTooShort = 2,
  NameAlreadyTaken = 3,
}

export const CreateSportErrorMessages = {
  [CreateSportErrorCode.NameTooLong]:
    "Sport name must be at most 20 characters",
  [CreateSportErrorCode.NameTooShort]:
    "Sport name must be at least 3 characters",
  [CreateSportErrorCode.NameAlreadyTaken]:
    "Sport with same name already exists",
};

export class CreateSportError extends Error {
  constructor(readonly code: CreateSportErrorCode) {
    super(CreateSportErrorMessages[code]);
  }
}
