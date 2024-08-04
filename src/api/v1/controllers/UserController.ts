import type { IUserController, IUserControllerDependencies, IUserService } from "../interfaces";
import type { Request, Response } from "express";
import { UserDto } from "../dto";

export class UserController implements IUserController {
  private userService: IUserService;
  constructor({ userService }: IUserControllerDependencies) {
    this.userService = userService;
  }
  async findMany(_req: Request, res: Response) {
    const users = await this.userService.findMany();
    const usersDto = users.map((user) => new UserDto(user));
    res.status(200).json({ users: usersDto });
  }
  async findById(req: Request, res: Response) {
    const user = await this.userService.findById(req.params.id);
    const userDto = new UserDto(user);
    res.status(200).json({ user: userDto });
  }
  async create(req: Request, res: Response) {
    const user = await this.userService.create(req.body);
    const userDto = new UserDto(user);
    res.status(201).json({ user: userDto });
  }
  async update(req: Request, res: Response) {
    await this.userService.findById(req.params.id);
    const user = await this.userService.update({ id: req.params.id }, req.body);
    const userDto = new UserDto(user!);
    res.status(200).json({ user: userDto });
  }
  async delete(req: Request, res: Response) {
    await this.userService.findById(req.params.id);
    await this.userService.delete({ id: req.params.id });
    res.status(204).json();
  }
}
