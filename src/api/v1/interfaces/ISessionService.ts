import type { Session, Prisma } from "@prisma/client";
export interface ISessionService {
  findMany(): Promise<Session[]>;
  findOne(where: Prisma.SessionWhereUniqueInput): Promise<Session | null>;
  create(data: Prisma.SessionCreateInput): Promise<Session>;
  update(where: Prisma.SessionWhereUniqueInput, data: Prisma.SessionUpdateInput): Promise<Session>;
  delete(where: Prisma.SessionWhereUniqueInput): Promise<void>;
}
