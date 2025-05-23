import Place from "../models/place";
import Product from "../models/product";
import endpoints from "utils/endpoints";
import { apiClient } from "utils/apiClient";
import ErrorType from "errors/errorType";

export default class PlaceService {
    static async getPlace(placeName: string):Promise<ErrorType<Place>> {
        return apiClient(endpoints.places.getPlace(placeName))
    }

    static async getPlaces(placeName: string):Promise<ErrorType<Place[]>> {
        return apiClient(endpoints.places.getPlaces(placeName))
    }

    static async getProducts(placeId: number, category:string):Promise<ErrorType<Product[]>> {
        return apiClient(endpoints.places.getProducts(placeId, category))
    }

    static async getProduct(placeName: string, productName: string):Promise<ErrorType<Product>> {
        return apiClient(endpoints.places.getProduct(placeName, productName))
    }

    static async getCategories(placeName: string):Promise<ErrorType<string[]>> {
        return apiClient(endpoints.places.getCategories(placeName))
    }

    static async createPlace(form: Record<string, string>):Promise<ErrorType<Place>> {
        return apiClient(endpoints.places.create, { 
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}