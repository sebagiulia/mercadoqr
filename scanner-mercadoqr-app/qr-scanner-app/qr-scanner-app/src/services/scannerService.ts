import ErrorType from "../utils/ErrorType";
import { apiClient } from "../utils/apiClient";
import Scanner from "../models/Scanner";
import endpoints from "../utils/endpoints";

export async function getScanner(token: string): Promise<ErrorType<Scanner>> {
    return apiClient(endpoints.GET_SCANNER_DATA_API, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
}