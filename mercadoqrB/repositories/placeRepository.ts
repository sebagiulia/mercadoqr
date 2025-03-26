import Product from "../schemas/ProductResponse";
import Place from "../schemas/Place";

export default interface PlaceRepository {
    getPlaceById(placeId: number): Promise<Place>;
    getPlace(placeName: string): Promise<Place>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: string): Promise<Product[]>;
    getProduct(placeName: string, prodName:string): Promise<Product>;
    getProductById(placeId:number, prodId: number): Promise<Product>;
    getPlaceToken(placeId: number): Promise<string>;
}