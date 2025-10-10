import ErrorType from "../../utils/errorType";
import { Movement } from "../entities/AnalyticsReport";

export interface IAnalyticsRepository {
    getMovements(token:string): Promise<ErrorType<Movement[]>> 
}