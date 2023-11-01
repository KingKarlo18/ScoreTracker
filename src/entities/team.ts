import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Sport } from "./sport";
import { Player } from "./player";
import { GameTeam } from "./gameTeam";
@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  sportId!: number;

  @ManyToOne(() => Sport, (sport) => sport.teams)
  @JoinColumn({ name: "sportId" })
  sport!: Sport;

  @OneToMany(() => Player, (player) => player.team)
  players!: Player[];

  @OneToMany(() => GameTeam, (gameTeam) => gameTeam.team)
  gameTeams!: GameTeam[];
}
