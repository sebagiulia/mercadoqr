import { Place } from "../../domain/entities/Place";
import { IPlaceRepository } from "../../domain/repositories/IPlaceRepository";
import { apiClient } from "../../utils/apiClient";
import endpoints from "../../utils/endpoints";
import ErrorType from "../../utils/errorType";

export class BackPlaceRepository implements IPlaceRepository {

  async getPlaceData(token: string): Promise<ErrorType<Place>> {
    return apiClient(endpoints.GET_PLACE_DATA_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
    )
  }

  async updatePlaceData(
    token: string,
    updatedData: Partial<Place>
  ): Promise<ErrorType<Place>> {
    return apiClient(endpoints.UPDATE_PLACE_DATA_API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });
  }
}