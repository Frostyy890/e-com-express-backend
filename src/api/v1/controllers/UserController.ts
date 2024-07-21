import type { Request, Response } from "express";
import { UserService } from "../services";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  async findMany(_req: Request, res: Response): Promise<void> {
    const users = await this.userService.findMany();
    res.status(200).json({ users });
  }
  async findById(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findById(req.params.id);
    res.status(200).json({ user });
  }
  async create(req: Request, res: Response): Promise<void> {
    const user = await this.userService.create(req.body);
    res.status(201).json({ user });
  }
  async update(req: Request, res: Response): Promise<void> {
    await this.userService.findById(req.params.id);
    const user = await this.userService.update({ id: req.params.id }, req.body);
    res.status(200).json({ user });
  }
  async delete(req: Request, res: Response): Promise<void> {
    await this.userService.findById(req.params.id);
    await this.userService.delete({ id: req.params.id });
    res.status(204).json();
  }
}
