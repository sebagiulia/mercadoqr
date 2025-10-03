import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthResponse from "../models/AuthResponse"
import ErrorType from "../utils/ErrorType"
import { apiClient } from "../utils/apiClient"
import endpoints from "../utils/endpoints"


export async function login(name: string, password: string, place:string): Promise<ErrorType<AuthResponse>> {
  return apiClient(endpoints.LOGIN_API, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name, password, place }),
});
}

export async function logout(): Promise<ErrorType<null>> {
  await AsyncStorage.removeItem("token");
return { success:true, data: null };
}