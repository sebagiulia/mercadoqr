import { Place } from "../entities/Place";
import ErrorType from "../../utils/errorType";
import Scanner from "../entities/Scanner";

export interface IPlaceRepository {
    getPlaceData(token: string): Promise<ErrorType<Place>>;
    updatePlaceData(token:string, updatedFields: Partial<Place>): Promise<ErrorType<Place>>;
    getScanners(token: string): Promise<ErrorType<Scanner[]>>;
    createScanner(token:string, scanner: Scanner): Promise<ErrorType<Scanner>>;
    deleteScanner(token:string, scanner_id:number): Promise<ErrorType<void>>;
}
