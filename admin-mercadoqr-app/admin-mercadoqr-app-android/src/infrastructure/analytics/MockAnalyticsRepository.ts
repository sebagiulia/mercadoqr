import { IAnalyticsRepository } from "../../domain/repositories/IAnalyticsRepository";
import { Movement } from "../../domain/entities/AnalyticsReport";
import ErrorType from "../../utils/errorType";

const mockMovements: Movement[] = [
    { payment_id: 101, prod_id: 3, place_id: 1, quantity: 2, total_price: 200, status: "Consumido", user_id: 201 },
    { payment_id: 102, prod_id: 2, place_id: 1, quantity: 1, total_price: 150, status: "Por consumir", user_id: 202 },
    { payment_id: 103, prod_id: 3, place_id: 1, quantity: 3, total_price: 300, status: "Consumido", user_id: 203 },
    { payment_id: 105, prod_id: 28, place_id: 1, quantity: 4, total_price: 2000, status: "Consumido", user_id: 205 },
    { payment_id: 104, prod_id: 2, place_id: 1, quantity: 1, total_price: 200, status: "Por consumir", user_id: 204 },
    { payment_id: 107, prod_id: 28, place_id: 1, quantity: 2, total_price: 1000, status: "Consumido", user_id: 207 },
];

export class MockAnalyticsRepository implements IAnalyticsRepository {
    async getMovements(token:string): Promise<ErrorType<Movement[]>> {
        return new Promise(resolve => setTimeout(() => resolve({success:true, data:mockMovements}), 500));
    }
}
