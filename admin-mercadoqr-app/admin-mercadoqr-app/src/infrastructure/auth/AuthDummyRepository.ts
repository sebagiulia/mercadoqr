import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class AuthDummyRepository implements IUserRepository {
  async login(email: string, password: string, branchCredential: string): Promise<User | null> {
    // Por ahora siempre devuelve un usuario válido
    return {
      id: "1",
      email,
      branchCredential
    };
  }
}
