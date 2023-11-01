import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Player } from "./player";
import { Game } from "./game";

@Entity()
export class GamePlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  goals!: number;

  @ManyToOne(() => Player, (player) => player.statistics)
  @JoinColumn({ name: "playerId" })
  player!: Player;

  @ManyToOne(() => Game, (game) => game.statistics)
  @JoinColumn({ name: "gameId" })
  game!: Game;
}
