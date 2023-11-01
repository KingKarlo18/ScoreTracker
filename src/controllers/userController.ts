import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/userService";
import jwt from "../plugins/jwt";
import { UserRole } from "../entities/user";

export class UserController {
  constructor(private userService: UserService) {}

  // login(req, rep, jwt);
  async login(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as any;
    const userData = await this.userService.login(body.UserName, body.password);

    const payload = {
      id: userData.id,
      userName: userData.userName,
      role: userData.role,
    };

    const token = req.server.jwt.sign(payload);
    if (!token) {
      res.code(400).send({ message: "Can't create token for this user" });
    } else {
      res.status(200).send(token);
    }
  }

  // register;
  async register(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as any;
    let roleOfUser;
    const role = body.role as string;
    if (role === "admin") {
      roleOfUser = UserRole.ADMIN;
    } else if (role === "anonymous") {
      roleOfUser = UserRole.ANONYMOUS;
    } else if (role === "guest") {
      roleOfUser = UserRole.GUEST;
    } else {
      res.status(400).send({ message: "Invalid role provided." });
      return;
    }

    let user;
    try {
      user = await this.userService.create(
        body.userName,
        body.password,
        roleOfUser
      );
      res.status(200).send(user);
    } catch (error) {
      if ((error as any).message.includes("UserName is ")) {
        res.status(400).send({ message: (error as any).message });
        throw error;
      } else if ((error as any).message.includes("This name is")) {
        res.status(400).send({ message: (error as any).message });
        throw error;
      }
    }
  }
}
