import type { Prisma } from "@prisma/client";
import type { IUserService } from "../interfaces";
import { db } from "@config/db";
import { settings } from "@config/settings";
import bcrypt from "bcrypt";
import { HttpException } from "../utils";
import { HttpStatusCodes } from "../constants";

export class UserService implements IUserService {
  async findMany() {
    return await db.user.findMany();
  }
  async findOne(where: Prisma.UserWhereUniqueInput) {
    return await db.user.findUnique({ where });
  }
  async findById(id: string) {
    const user = await this.findOne({ id });
    if (!user) throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");
    return user;
  }
  async create(data: Prisma.UserCreateInput) {
    data.password = await bcrypt.hash(data.password, settings.hashing.saltRounds);
    return await db.user.create({ data });
  }
  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    if (data.password)
      data.password = await bcrypt.hash(data.password as string, settings.hashing.saltRounds);
    return await db.user.update({ where, data });
  }
  async delete(where: Prisma.UserWhereUniqueInput) {
    await db.user.delete({ where });
  }
}
