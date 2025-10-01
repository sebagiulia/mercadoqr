import { Place } from "../models/Place";
import { apiClient } from "../utils/apiClient";
import endpoints from "../utils/endpoints";
import ErrorType from "../utils/ErrorType";

export async function getPlaceData(token: string): Promise<ErrorType<Place>> {
  return apiClient<ErrorType<Place>>(endpoints.GET_PLACE_DATA_API, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
  });
}