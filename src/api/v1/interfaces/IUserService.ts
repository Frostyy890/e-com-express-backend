import type { User, Prisma } from "@prisma/client";

export interface IUserService {
  findMany(): Promise<User[]>;
  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null>;
  findById(id: string): Promise<User>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User | null>;
  delete(where: Prisma.UserWhereUniqueInput): Promise<void>;
}
