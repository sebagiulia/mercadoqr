import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import endpoints from "../../utils/endpoints";
import { apiClient } from "../../utils/apiClient";
import ErrorType from "../../utils/errorType";
import AuthResponse from "../../domain/entities/AuthResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class BackAuthRepository implements IAuthRepository {
  async login(name: string, password: string): Promise<ErrorType<AuthResponse>> {
    
      return apiClient(endpoints.LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });
  }

  async logout(): Promise<ErrorType<null>> {
    await AsyncStorage.removeItem("token");
    return { success:true, data: null };
  }

}