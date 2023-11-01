import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  ADMIN = "admin",
  GUEST = "guest",
  ANONYMOUS = "anonymous",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  userName!: string;
  @Column()
  password!: string;
  @Column()
  role!: UserRole;
}
