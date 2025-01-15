import Place from "../models/place";
import Product from "@/models/product";

export default interface PlaceService {
    getPlace(placeName: string): Promise<Place>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: number): Promise<Product>;
    getProduct(placeName:string, productName:string): Promise<Product[]>;
}