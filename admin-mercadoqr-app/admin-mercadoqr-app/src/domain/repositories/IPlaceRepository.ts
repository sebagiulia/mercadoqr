import { Place } from "../entities/Place";

export interface IPlaceRepository {
    getPlaceData(place_id: string): Promise<Place>;
    updatePlaceData(place_id:string, updatedFields: Partial<Place>): Promise<Place>;
}
