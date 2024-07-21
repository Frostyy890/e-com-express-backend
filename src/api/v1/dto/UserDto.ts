import { User, Role } from "@prisma/client";

export class UserDto {
  public id: string;
  public email: string;
  public username: string;
  public role: Role;
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.role = user.role;
  }
}
