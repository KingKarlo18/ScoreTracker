import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game";
import { Team } from "./team";

export enum GameSide {
  Home = "home",
  Away = "away",
}

@Entity()
export class GameTeam {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  gameId!: number;
  @Column()
  teamId!: number;

  @ManyToOne(() => Game, (game) => game.gameTeams)
  game!: Game;
  @ManyToOne(() => Team, (team) => team.gameTeams)
  team!: Team;
  @Column({ type: "varchar" })
  side!: GameSide;
}
