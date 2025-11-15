import AuthResponse from "../../domain/entities/AuthResponse";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { apiClient } from "../../utils/apiClient";
import ErrorType from "../../utils/errorType";

export class AuthDummyRepository implements IAuthRepository {
  async login(name: string, password: string): Promise<ErrorType<AuthResponse>> {
    // Por ahora siempre devuelve un usuario válido
    const  error = { success: true, data: {token:"1234"} };
    return error;
  }

  async logout(): Promise<ErrorType<null>> {
    // No hace nada en este repositorio dummy
    
    return { success: true, data: null};
  }
}
