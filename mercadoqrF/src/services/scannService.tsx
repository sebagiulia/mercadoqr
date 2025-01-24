import endpoints from "utils/endpoints";
import { apiClient } from "utils/apiClient";
import ErrorType from "errors/errorType";
import Place from "@/models/place";
import Product from "@/models/product";

export default class ScannService {
    static async validate(localName: string, validationCode: string) : Promise<ErrorType<Place>> {
        return apiClient(endpoints.scann.validate, { 
                                            method: 'POST',
                                            body: JSON.stringify({ localName, validationCode }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });
    }

    static async getScann(code: string, placeId: number) : Promise<ErrorType<Product>> {
        return apiClient(endpoints.scann.getScann, { 
                                            method: 'POST',
                                            body: JSON.stringify({ code, placeId }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });
    }

    static async consume(qrcode: string) : Promise<ErrorType<null>> {
        return apiClient(endpoints.scann.consume, { 
                                            method: 'POST',
                                            body: JSON.stringify({ qrcode }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });
    }
}