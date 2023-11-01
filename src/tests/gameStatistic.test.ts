import { GamePlayerService } from "../services/gamePlayerService";
import { GameService } from "../services/gameService";
import { PlayerService } from "../services/playerService";
import { TeamService } from "../services/teamService";
import { GamePlayerRepositoryMock } from "./mocks/gamePlayerRepositoryMock";
import { GameRepositoryMock } from "./mocks/gameRepositoryMock";
import { gameTeamRepositoryMock } from "./mocks/gameTeamRepositoryMock";
import { PlayerRepositoryMock } from "./mocks/playerRepositoryMock";
import { TeamRepositoryMock } from "./mocks/teamRepositoryMock";

describe("Game Statistic", () => {
  let gameRepo = new GameRepositoryMock();
  let teamRepo = new TeamRepositoryMock();
  let playerRepo = new PlayerRepositoryMock();
  let gameTeamRepo = new gameTeamRepositoryMock();
  let gamePlayerRepo = new GamePlayerRepositoryMock();

  const teamService = new TeamService(teamRepo, gameRepo);
  const gameService = new GameService(gameRepo, gameTeamRepo, teamService);
  const playerService = new PlayerService(playerRepo, teamService);
  const gamePlayerService = new GamePlayerService(
    gameRepo,
    playerRepo,
    gamePlayerRepo
  );

  test("Get game with teams", async () => {
    //Arrange
    const homeTeamName = "Milan";
    const awayTeamName = "Real";
    const homeTeamScore = 1;
    const awayTeamScore = 0;

    // Act
    const homeTeam = teamService.create(homeTeamName, 1);
    const awayTeam = teamService.create(awayTeamName, 1);
    const game = await gameService.create(
      homeTeamName,
      awayTeamName,
      homeTeamScore,
      awayTeamScore
    );

    //Assert
    expect(teamRepo.teams[0].name).toBe(homeTeamName);
    expect(teamRepo.teams[1].name).toBe(awayTeamName);
    expect(teamRepo.teams[0]).toMatchObject(homeTeam);
    expect(teamRepo.teams[1]).toMatchObject(awayTeam);
    expect(game.homeTeamScore).toBe(homeTeamScore);
    expect(game.awayTeamScore).toBe(awayTeamScore);
    expect(gameRepo.games.length).toBe(1);
  });
  test("Get player that scores", async () => {
    //Arrange
    const game = gameRepo.games[0];
    const homeTeam = teamRepo.teams[0];
    const awayTeam = teamRepo.teams[1];
    const playerName = "Messi";
    const position = "FWD";
    const jerseyNumber = 10;
    // Act
    const player = await playerService.create(
      playerName,
      homeTeam.id,
      position,
      jerseyNumber
    );
    const gameStatistic = await gamePlayerService.create(1, player.id, game.id);
    //Assert
    expect(playerRepo.players[0]).toMatchObject(player);
    expect(await gamePlayerService.getGoalsForPlayer(player.id, game.id)).toBe(
      1
    );
  });
  test("Make random player score goal", async () => {
    const homeTeamName = teamRepo.teams[0].name;
    const awayTeamName = teamRepo.teams[1].name;
    const homeTeamScore = 2;
    const awayTeamScore = 0;
    const playerName = "Ronaldo";
    const position = "FWD";
    const jerseyNumber = 11;
    const playerNameSecond = "Neymar";
    const positionSecond = "FWD";
    const jerseyNumberSecond = 12;

    // Act
    const game = await gameService.create(
      homeTeamName,
      awayTeamName,
      homeTeamScore,
      awayTeamScore
    );
    const player = await playerService.create(
      playerName,
      teamRepo.teams[0].id,
      position,
      jerseyNumber
    );
    const playerSecond = await playerService.create(
      playerNameSecond,
      teamRepo.teams[1].id,
      positionSecond,
      jerseyNumberSecond
    );
    const gameStatistic = await gamePlayerService.setRandomGoalScorers(game);
    console.log(gamePlayerRepo.gamePlayers);
  });
});
