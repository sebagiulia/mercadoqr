import Place from "../models/place";
import Product from "../models/product";
import PlaceService from "./placeService";
import endpoints from "utils/endpoints";
import { apiClient } from "utils/apiClient";
import ErrorType from "errors/errorType";

export default class PlaceServiceApiImp implements PlaceService {
    async getPlace(placeName: string):Promise<Place> {
        return apiClient(endpoints.places.getPlace(placeName))
    }

    async getPlaces(placeName: string):Promise<Place[]> {
        return apiClient(endpoints.places.getPlaces(placeName))
    }

    async getProducts(placeId: number):Promise<Product> {
        return apiClient(endpoints.places.getProducts(placeId))
    }

    async getProduct(placeName: string, productName: string):Promise<Product[]> {
        return apiClient(endpoints.places.getProduct(placeName, productName))
    }
}