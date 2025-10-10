import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class LoginUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string, branchCredential: string): Promise<User | null> {
    return this.userRepo.login(email, password, branchCredential);
  }
}
