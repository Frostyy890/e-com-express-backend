import type { Prisma, User } from "@prisma/client";
import { db } from "@config/db";
import { appConfig } from "@config/AppConfig";
import bcrypt from "bcrypt";
import { HttpException } from "../utils";
import { HttpStatusCodes } from "../constants";

export class UserService {
  async findMany(): Promise<User[]> {
    return await db.user.findMany();
  }
  async findOne(where: Prisma.UserWhereInput): Promise<User | null> {
    return await db.user.findFirst({ where });
  }
  async findById(id: string): Promise<User> {
    const user = await this.findOne({ id });
    if (!user) throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");
    return user;
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await bcrypt.hash(data.password, appConfig.hashing.saltRounds);
    return await db.user.create({ data });
  }
  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<User | null> {
    if (data.password)
      data.password = await bcrypt.hash(data.password as string, appConfig.hashing.saltRounds);
    return await db.user.update({ where, data });
  }
  async delete(where: Prisma.UserWhereUniqueInput): Promise<void> {
    await db.user.delete({ where });
  }
}
