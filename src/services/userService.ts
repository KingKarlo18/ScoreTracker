import { Repository } from "typeorm";
import { User, UserRole } from "../entities/user";
import { fastify } from "fastify";
// import { fastifyJwt } from "fastify/jwt";

export class UserService {
  constructor(private readonly userRepositoy: Repository<User>) {}

  async create(
    userName: string,
    password: string,
    role: UserRole
  ): Promise<User> {
    if (userName.length < 3) {
      throw new Error("UserName is to short");
    }

    const userNameAvaliable = await this.checkNameAvaliablety(userName);
    if (userNameAvaliable) {
      throw new Error("This name is already taken");
    } else {
      const user = this.userRepositoy.create({
        userName: userName,
        password: password,
        role: role,
      });
      this.userRepositoy.save(user);
      return user;
    }
  }

  async checkNameAvaliablety(userName: string) {
    const user = await this.userRepositoy.findOneBy({ userName: userName });
    if (!user) {
      return false;
    } else {
      return true;
    }
  }

  async find(userName: string): Promise<User> {
    const user = await this.userRepositoy.findOneBy({ userName: userName });

    if (!user) {
      throw new Error("User with this name do not exist");
    }
    return user;
  }

  async delete(userName: string) {
    let user = await this.find(userName);

    if (!user) {
      throw new Error("User with this name does not exist in database");
    } else {
      await this.userRepositoy.delete({ userName: userName });
    }

    const isDeleted = await this.find(userName);
    if (isDeleted == null) {
      console.log("User with id: %s is succesfully deleted", userName);
    }
  }

  async login(userName: string, password: string): Promise<User> {
    const userIsValid = await this.userRepositoy.findOne({
      where: {
        userName: userName,
        password: password,
      },
    });

    if (!userIsValid) {
      throw new Error("Username or password are incorrect.");
    }

    return userIsValid;
  }
  // return fastify.jwt.sign(payload);
}
