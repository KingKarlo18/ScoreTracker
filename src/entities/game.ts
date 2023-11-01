import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { GameTeam } from "./gameTeam";
import { Player } from "./player";
import { GamePlayer } from "./gamePlayer";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sportId!: number;

  @OneToMany(() => GameTeam, (gameTeam) => gameTeam.game, { cascade: true })
  gameTeams?: GameTeam[];

  @Column({ type: "integer" })
  homeTeamScore?: number;

  @Column({ type: "integer" })
  awayTeamScore?: number;

  @ManyToMany(() => Player, (player) => player.games)
  @JoinTable()
  players!: Player[];

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.game)
  statistics!: GamePlayer[];
}
