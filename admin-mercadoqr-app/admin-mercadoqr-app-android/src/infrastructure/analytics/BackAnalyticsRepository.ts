import { IAnalyticsRepository } from "../../domain/repositories/IAnalyticsRepository";
import { Movement } from "../../domain/entities/AnalyticsReport";
import ErrorType from "../../utils/errorType";
import { apiClient } from "../../utils/apiClient";
import endpoints from "../../utils/endpoints";
export class BackAnalyticsRepository implements IAnalyticsRepository {
    async getMovements(token:string): Promise<ErrorType<Movement[]>> {
        return apiClient(endpoints.GET_PLACE_MOVEMENTS_API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
    }
}