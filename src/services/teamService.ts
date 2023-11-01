import { Repository } from "typeorm";
import { Team } from "../entities/team";
import { GameSide } from "../entities/gameTeam";
import { Game } from "../entities/game";
import { IRepository } from "../interfaces/IRepository";

export type FindTeamParam = {
  name?: string;
  id?: number;
};

export class TeamService {
  constructor(
    private readonly teamRepo: IRepository<Team>,
    private readonly gameRepo: IRepository<Game>
  ) {}

  async create(name: string, sportId: number, items?: any[]): Promise<Team> {
    if (name.length < 3) {
      throw new Error("Team must have at least three characters");
    }

    const team = this.teamRepo.create({
      name: name,
      sportId: sportId,
    });
    await this.teamRepo.save(team);

    return team;
  }

  async all(): Promise<Team[]> {
    const teams = await this.teamRepo.find();
    if (typeof teams == "undefined") {
      console.log("There are no teams created");
    }
    return teams;
  }

  async allBySportId(sportId: number): Promise<Team[]> {
    const teams = await this.teamRepo.find({
      where: {
        sportId: sportId,
      },
      relations: ["sport"],
    });
    return teams;
  }

  async find(param: FindTeamParam): Promise<Team | Team[] | undefined> {
    let query: { [key: string]: any } = {};
    let team;
    if (param.id) {
      query.id = param.id;
      team = await this.teamRepo.find({
        where: {
          id: query.id,
        },
      });
    }
    if (param.name) {
      query.name = param.name;
      team = await this.teamRepo.find({
        where: {
          name: query.name,
        },
      });
    }

    if (!team) {
      if (typeof param === "string") {
        console.log("Team with name: %s does not exist", param);
      } else {
        console.log("Team with id: %d does not exist", param);
      }
    }
    return team;
  }

  async findOne(param: FindTeamParam): Promise<Team | undefined> {
    let team;
    const keys = Object.keys(param);
    if (keys.includes("id")) {
      team = await this.teamRepo.findOneBy({
        id: param.id,
      });
    }
    if (keys.includes("name")) {
      team = await this.teamRepo.findOneBy({
        name: param.name,
      });
    }

    if (!team) {
      if (typeof param === "string") {
        console.log("Team with name: %s does not exist", param);
      } else if (typeof param === "number")
        console.log("Team with id: %d does not exist", param);
    } else {
      return team;
    }
  }

  async deleteById(id: number) {
    this.teamRepo.delete({
      id: id,
    });
    const isDeleted = await this.teamRepo.findBy({
      id: id,
    });
    if (isDeleted == null) {
      console.log("Team with id: %d is succesfully deleted", id);
    }
  }

  async allGamesOfTeam(teamName: string): Promise<Game[]> {
    const gamesOfTeam = await this.gameRepo.find({
      where: {
        gameTeams: {
          team: {
            name: teamName,
          },
        },
      },
      relations: ["gameTeams", "gameTeams.team"],
    });
    return gamesOfTeam;
  }

  async teamStatistic(teamName: string): Promise<{
    numberOfWins: number;
    numberOfDraws: number;
    numberOfLoses: number;
  }> {
    const gamesOfTeam = await this.allGamesOfTeam(teamName);
    let numberOfWins = 0,
      numberOfLoses = 0,
      numberOfDraws = 0;

    const homeGames = gamesOfTeam.filter((game) => {
      return game.gameTeams?.some(
        (gt) => gt.team.name === teamName && gt.side == GameSide.Home
      );
    });

    const awayGames = gamesOfTeam.filter((game) => {
      return game.gameTeams?.some(
        (gt) => gt.team.name === teamName && gt.side == GameSide.Home
      );
    });

    for (const games of homeGames) {
      const homeTeamScore = games.homeTeamScore ?? 0;
      const awayTeamScore = games.awayTeamScore ?? 0;
      if (homeTeamScore > awayTeamScore) {
        numberOfWins++;
      } else if (homeTeamScore == awayTeamScore) {
        numberOfDraws++;
      } else if (homeTeamScore < awayTeamScore) {
        numberOfLoses++;
      }
    }

    for (const games of awayGames) {
      const homeTeamScore = games.homeTeamScore ?? 0;
      const awayTeamScore = games.awayTeamScore ?? 0;
      if (homeTeamScore < awayTeamScore) {
        numberOfWins++;
      } else if (homeTeamScore == awayTeamScore) {
        numberOfDraws++;
      } else if (homeTeamScore > awayTeamScore) {
        numberOfLoses++;
      }
    }

    return {
      numberOfWins,
      numberOfDraws,
      numberOfLoses,
    };
  }

  async displayPointsForTeam(teamName: string) {
    const { numberOfWins, numberOfDraws, numberOfLoses } =
      await this.teamStatistic(teamName);

    const numberOfPoints =
      numberOfWins * 3 + numberOfDraws * 1 + numberOfLoses * 0;
    console.log("Team Name - W/D/L - Points");
    console.log(
      "%s - %d/%d/%d - %d ",
      teamName,
      numberOfWins,
      numberOfDraws,
      numberOfLoses,
      numberOfPoints
    );
  }

  async displayTable(sportId: number) {
    const allTeams = await this.teamRepo.find({
      where: {
        sportId: sportId,
      },
    });
    const allTeamNames = allTeams.map((teams) => teams.name);

    const teamsWithPoints = await Promise.all(
      allTeamNames.map(async (teamName) => {
        const { numberOfWins, numberOfDraws, numberOfLoses } =
          await this.teamStatistic(teamName);
        const numberOfPoints =
          numberOfWins * 3 + numberOfDraws * 1 + numberOfLoses * 0;
        return {
          teamName,
          numberOfWins,
          numberOfDraws,
          numberOfLoses,
          numberOfPoints,
        };
      })
    );

    for (let i = 0; i < teamsWithPoints.length - 1; i++) {
      for (let j = i + 1; j < teamsWithPoints.length; j++) {
        if (
          teamsWithPoints[i].numberOfPoints < teamsWithPoints[j].numberOfPoints
        ) {
          let temp = teamsWithPoints[i];
          teamsWithPoints[i] = teamsWithPoints[j];
          teamsWithPoints[j] = temp;
        }
      }
    }

    // for (const team of ...)
    //   await this.displayPointsForTeam(team);

    teamsWithPoints.forEach((element) => {
      this.displayPointsForTeam(element.teamName);
    });
  }
}
