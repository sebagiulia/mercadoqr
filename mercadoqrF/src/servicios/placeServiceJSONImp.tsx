import Place from "../models/place";
import Product from "../models/product";
import PlaceService from "./placeService";
import places from "@/data/place.json";
import products from "@/data/products.json";

export default class PlaceServiceJSONImp implements PlaceService {
    async getPlace(placeName: string): Promise<Place|null> {
        const place = places.find((place: any) => place.name === placeName);
        return place ? place : null;
    }

    async getPlaces(placeName: string): Promise<Place[]> {
        const placesByName = places.filter((place: any) => place.name.startsWith(placeName));        
        return placesByName.map((place: any) => place);
    }

    async getProducts(placeId: number): Promise<Product[]> {
        const productsByPlace = products.filter((product: any) => product.place_id === placeId);
        return productsByPlace.map((product: any) => product);
    }

    async getProduct(placeName: string, productName: string): Promise<Product|null> {
        const place = places.find((place: any) => place.name === placeName);
        if (!place) {
            return null
        }
        const product = products.find((product: any) => placeName === place.name  && product.name === productName);
        return product? product : null;
    }
}