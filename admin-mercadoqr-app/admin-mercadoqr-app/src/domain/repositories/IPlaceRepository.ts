import { Place } from "../entities/Place";
import ErrorType from "../../utils/errorType";

export interface IPlaceRepository {
    getPlaceData(token: string): Promise<ErrorType<Place>>;
    updatePlaceData(token:string, updatedFields: Partial<Place>): Promise<ErrorType<Place>>;
}
