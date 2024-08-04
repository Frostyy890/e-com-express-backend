import type { ISessionService } from "../interfaces";
import type { Prisma } from "@prisma/client";
import { db } from "@config/db";

export class SessionService implements ISessionService {
  async findMany() {
    return await db.session.findMany();
  }
  async findOne(where: Prisma.SessionWhereUniqueInput) {
    return await db.session.findUnique({ where });
  }
  async create(data: Prisma.SessionCreateInput) {
    return await db.session.create({ data });
  }
  async update(where: Prisma.SessionWhereUniqueInput, data: Prisma.SessionUpdateInput) {
    return await db.session.update({ where, data });
  }
  async delete(where: Prisma.SessionWhereUniqueInput) {
    await db.session.delete({ where });
  }
}
