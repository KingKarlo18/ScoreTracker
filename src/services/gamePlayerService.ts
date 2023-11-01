import { Game } from "../entities/game";
import { GamePlayer } from "../entities/gamePlayer";
import { Player } from "../entities/player";
import { IRepository } from "../interfaces/IRepository";

export class GamePlayerService {
  constructor(
    private readonly gameRepo: IRepository<Game>,
    private readonly playerRepo: IRepository<Player>,
    private readonly gamePlayerRepo: IRepository<GamePlayer>
  ) {}

  async create(
    numberOfGoals: number,
    playerId: number,
    gameId: number
  ): Promise<GamePlayer> {
    const game = await this.gameRepo.findOne({ id: gameId });
    const player = await this.playerRepo.findOne({ id: playerId });

    const gamePlayer = this.gamePlayerRepo.create({
      goals: numberOfGoals,
      player: player,
      game: game,
    });
    await this.gamePlayerRepo.save(gamePlayer);

    return gamePlayer;
  }

  async allStatistic(): Promise<GamePlayer[]> {
    const gamesStatistic = await this.gamePlayerRepo.find();
    return gamesStatistic;
  }

  async statisticForGame(gameId: number): Promise<GamePlayer[] | undefined> {
    const game = this.gameRepo.findOne({ id: gameId });
    const gameStatistic = await this.gamePlayerRepo.findBy({
      where: {
        game: game,
      },
      relations: ["game"],
    });
    return gameStatistic;
  }

  async statisticForPlayer(
    playerId: number
  ): Promise<GamePlayer[] | undefined> {
    const player = this.playerRepo.findOne({ id: playerId });
    const playerStatistic = await this.gamePlayerRepo.findBy({
      where: {
        player: player,
      },
      relations: ["player"],
    });
    return playerStatistic;
  }

  async getGoalsForPlayer(playerId: number, gameId: number): Promise<Number> {
    const player = await this.playerRepo.findOne({ id: playerId });
    if (!player) {
      throw new Error("Cant find player with this ID");
    }

    const game = await this.gameRepo.findOne({ id: gameId });
    if (!game) {
      throw new Error("Cant find game with this ID");
    }
    const playerStatistic = await this.gamePlayerRepo.findOneBy({
      player: player,
      game: game,
    });

    if (!playerStatistic) {
      throw new Error("Player didnt play in this game");
    }

    const playerGoalsInGame = playerStatistic.goals;
    console.log("Player %s scored %d goals", player.name, playerGoalsInGame);
    return playerGoalsInGame;
  }

  // Provjeriti kako da uz pomoć random vrijednosti random igračim dodam golove
  async setRandomGoalScorers(game: Game) {
    // Get teams from passed on Game object
    const gameTeams = game.gameTeams;
    if (!gameTeams) {
      throw new Error("Error with teams in game");
    }
    const homeTeam = gameTeams[0].teamId;
    const awayTeam = gameTeams[1].teamId;

    // Get players from each team
    const playersOfHomeTeam = (await this.playerRepo.find()).filter(
      (player) => {
        return player.team.id === homeTeam;
      }
    );
    const playersOfAwayTeam = (await this.playerRepo.find()).filter(
      (player) => {
        return player.team.id === awayTeam;
      }
    );
    let scoreHome = game.homeTeamScore;
    let scoreAway = game.awayTeamScore;
    if (typeof scoreAway === "undefined" || typeof scoreHome === "undefined") {
      throw new Error("Error with teams in game");
    }

    // Logic for random adding goals for HOME Team Players
    for (let i = 0; i < playersOfHomeTeam.length - 1; i++) {
      // Set number of goals
      let goalsForPlayer = Math.floor(Math.random() * (scoreHome + 1));
      // Create a player statistic for each player with number of goals 0 because you will change it later
      const gamePlayer = this.gamePlayerRepo.create({
        goals: goalsForPlayer,
        player: playersOfHomeTeam[i],
        game: game,
      });
      await this.gamePlayerRepo.save(gamePlayer);

      scoreHome -= goalsForPlayer;
    }
    // Create last player statistic
    const lastHomePlayerStatistic = this.gamePlayerRepo.create({
      goals: scoreHome,
      player: playersOfHomeTeam[playersOfHomeTeam.length - 1],
      game: game,
    });
    await this.gamePlayerRepo.save(lastHomePlayerStatistic);

    // Logic for random adding goals for AWAY Team Players
    for (let i = 0; i < playersOfAwayTeam.length - 1; i++) {
      // Set number of goals
      let goalsForPlayer = Math.floor(Math.random() * (scoreAway + 1));
      // Create a player statistic for each player with number of goals 0 because you will change it later
      const gamePlayer = this.gamePlayerRepo.create({
        goals: goalsForPlayer,
        player: playersOfAwayTeam[i],
        game: game,
      });
      await this.gamePlayerRepo.save(gamePlayer);
      // // Get acces to player statistic (goals)
      // let playerStatistic = playersOfAwayTeam[i].statistics.find(
      //   (statistic) => statistic.game === game
      // );
      // if (!playerStatistic) {
      //   throw new Error("Cannot find player statistic");
      // }
      // // Set player goals to right value
      // playerStatistic.goals = (playerStatistic.goals || 0) + goalsForPlayer;
      // // Substract added goals from score
      scoreAway -= goalsForPlayer;
    }
    // Create last player statistic
    const lastAwayPlayerStatistic = this.gamePlayerRepo.create({
      goals: scoreAway,
      player: playersOfAwayTeam[playersOfAwayTeam.length - 1],
      game: game,
    });
    await this.gamePlayerRepo.save(lastAwayPlayerStatistic);
    // // Get acces to LAST player statistic (goals)
    // let lastAwayPlayerGoals = playersOfAwayTeam[
    //   playersOfAwayTeam.length - 1
    // ].statistics.find((statistic) => statistic.game === game)?.goals;
    // if (!lastAwayPlayerGoals) {
    //   throw new Error("Cannot find player statistic");
    // }
    // Add last player remaining goals from score
  }

  //TO DO: Napraviti logiku funkcije za ove parametre
  // async statisticForGame(homeTeamId: number, awayTeamId: number) {
  // }
}
