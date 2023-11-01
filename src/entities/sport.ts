import { Team } from "./team";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  FindOperator,
} from "typeorm";

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;

  @OneToMany(() => Team, (team) => team.sport)
  teams!: Team[];
  static sportId: number | FindOperator<number> | undefined;

  getTotalNumbersOfTeams() {
    return this.teams.length;
  }

  static factory(obj: { id: number; name: string }) {
    const sport = new this();
    sport.name = obj.name;
    sport.id = obj.id;
    return sport;
  }
}
