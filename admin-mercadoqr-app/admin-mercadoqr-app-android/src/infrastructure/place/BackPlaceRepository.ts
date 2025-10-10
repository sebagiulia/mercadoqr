import { Place } from "../../domain/entities/Place";
import Scanner from "../../domain/entities/Scanner";
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


  async getScanners(token: string): Promise<ErrorType<Scanner[]>> {
    return apiClient(endpoints.GET_SCANNERS_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
  }

  async createScanner(token: string, scanner: Scanner): Promise<ErrorType<Scanner>> {
    return apiClient(endpoints.CREATE_SCANNER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(scanner)
    });
  }

  async deleteScanner(token: string, scanner_id:number): Promise<ErrorType<void>> {
    return apiClient(endpoints.DELETE_SCANNER_API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
      , body: JSON.stringify({scannerId: scanner_id})
    });
  }
}