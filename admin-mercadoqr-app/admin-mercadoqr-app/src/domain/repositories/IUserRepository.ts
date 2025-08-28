import { User } from "../entities/User";

export interface IUserRepository {
  login(email: string, password: string, branchCredential: string): Promise<User | null>;
}
