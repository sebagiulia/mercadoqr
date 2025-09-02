import { Place } from "../../domain/entities/Place";
import { IPlaceRepository } from "../../domain/repositories/IPlaceRepository";
import endpoints from "../../utils/endpoints";

export class BackPlaceRepository implements IPlaceRepository {

  async getPlaceData(place_id: string): Promise<Place> {
    const response = await fetch(`${endpoints.GET_PLACE_DATA_API + place_id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch place data");
    }
    const data = await response.json();
    return data.data as Place;
  }

  async updatePlaceData(
    place_id: string,
    updatedData: Partial<Place>
  ): Promise<Place> {
    const response = await fetch(`${endpoints.UPDATE_PLACE_DATA_API + place_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error("Failed to update place data");
    }
    const data = await response.json();
    return data as Place;
  }
}