import ErrorType from "../../utils/errorType";
import AuthResponse from "../entities/AuthResponse";
export interface IAuthRepository {
  login(name: string, password: string): Promise<ErrorType<AuthResponse>>;
  logout(): Promise<ErrorType<null>>;
}
