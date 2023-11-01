import { Game } from "../entities/game";
import { GameSide, GameTeam } from "../entities/gameTeam";
import { TeamService } from "./teamService";
import { IRepository } from "../interfaces/IRepository";
import { Repository } from "typeorm";

export class GameService {
  constructor(
    private readonly gameRepo: IRepository<Game>,
    private readonly gameTeamsRepo: IRepository<GameTeam>,
    private readonly teamService: TeamService
  ) {}

  async create(
    homeTeam: string,
    awayTeam: string,
    homeTeamScore: number,
    awayTeamScore: number
  ): Promise<Game> {
    const existingHomeTeam = await this.teamService.findOne({ name: homeTeam });
    const existingAwayTeam = await this.teamService.findOne({ name: awayTeam });
    const homeSportId = existingHomeTeam?.sportId;
    const awaySportId = existingAwayTeam?.sportId;

    if (!existingAwayTeam || !existingHomeTeam) {
      throw new Error("There are no existing home team or away team");
    }

    if (homeSportId != awaySportId) {
      throw new Error("SportId of teams are not matching");
    }

    if (existingHomeTeam.id == existingAwayTeam.id) {
      throw new Error("HomeTeam and AwayTeam are the same");
    }

    const game = this.gameRepo.create({
      homeTeamScore: homeTeamScore,
      awayTeamScore: awayTeamScore,
      sportId: homeSportId,
    });
    await this.gameRepo.save(game);

    const homeGameTeam = this.gameTeamsRepo.create({
      side: GameSide.Home,
      gameId: game.id,
      team: existingHomeTeam,
      game: game,
    });
    const awayGameTeam = this.gameTeamsRepo.create({
      side: GameSide.Away,
      gameId: game.id,
      team: existingAwayTeam,
      game: game,
    });

    await this.gameTeamsRepo.save(homeGameTeam);
    await this.gameTeamsRepo.save(awayGameTeam);

    return game;
  }

  async all(): Promise<Game[]> {
    const games = await this.gameRepo.find({
      relations: ["gameTeams"],
    });
    return games;
  }

  async allBySport(sportId: number): Promise<Game[] | undefined> {
    const games = await this.gameRepo.find({
      where: {
        sportId: sportId,
      },
      relations: ["gameTeams"],
    });
    return games ? games : undefined;
  }
}
