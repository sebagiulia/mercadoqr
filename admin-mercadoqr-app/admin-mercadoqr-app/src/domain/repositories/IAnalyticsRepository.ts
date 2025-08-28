import { Movement } from "../entities/AnalyticsReport";

export interface IAnalyticsRepository {
    getMovements(): Promise<Movement[]> 
}