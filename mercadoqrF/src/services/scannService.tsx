import endpoints from "utils/endpoints";
import { apiClient } from "utils/apiClient";
import ErrorType from "errors/errorType";

export default class ScannService {
    static async validate(localName: string, validationCode: string) : Promise<ErrorType<Boolean>> {
        return apiClient(endpoints.scann.validate, { 
                                            method: 'POST',
                                            body: JSON.stringify({ localName, validationCode }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });
    }
}