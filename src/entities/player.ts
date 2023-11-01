import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Team } from "./team";
import { Game } from "./game";
import { GamePlayer } from "./gamePlayer";
@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  position!: string;

  @Column()
  jersyNumber!: number;

  @ManyToOne(() => Team, (team) => team.players)
  @JoinColumn({ name: "teamId" })
  team!: Team;

  @ManyToMany(() => Game, (game) => game.players)
  @JoinTable()
  games!: Game[];

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.player)
  statistics!: GamePlayer[];
}
