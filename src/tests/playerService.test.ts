import { PlayerService } from "../services/playerService";
import { TeamService } from "../services/teamService";
import { GameRepositoryMock } from "./mocks/gameRepositoryMock";
import { PlayerRepositoryMock } from "./mocks/playerRepositoryMock";
import { TeamRepositoryMock } from "./mocks/teamRepositoryMock";

describe("Player Service", () => {
  let playerService: PlayerService;
  let playerRepositoryMock: PlayerRepositoryMock;
  let teamService: TeamService;
  let teamRepositoryMock: TeamRepositoryMock;
  let gameRepositoryMock: GameRepositoryMock;

  teamRepositoryMock = new TeamRepositoryMock();
  gameRepositoryMock = new GameRepositoryMock();
  teamService = new TeamService(teamRepositoryMock, gameRepositoryMock);
  playerRepositoryMock = new PlayerRepositoryMock();
  playerService = new PlayerService(playerRepositoryMock, teamService);

  test("Create player in repository", async () => {
    // Arrange
    const teamName = "Milan";
    const playerName = "Messi";
    const position = "FWD";
    const jerseyNumber = 10;

    // Act
    const createdTeam = await teamService.create(teamName, 1);
    const teamId = teamRepositoryMock.teams[0].id;
    const createdPlayer = await playerService.create(
      playerName,
      teamId,
      position,
      jerseyNumber
    );

    // Assert
    expect(teamRepositoryMock.teams).toHaveLength(1);
    expect(teamRepositoryMock.teams[0]).toEqual(createdTeam);

    expect(playerRepositoryMock.players).toHaveLength(1);
    expect(playerRepositoryMock.players[0]).toEqual(createdPlayer);
  });

  test("Get player from repository", async () => {
    // Arrange (koristimo iste podatke kao u prvom testu)
    const playerName = "Messi";

    // Act
    const foundPlayer = await playerService.findOne({ name: playerName });

    // Assert
    expect(playerRepositoryMock.players[0]).toEqual(foundPlayer);
  });
});
