import Product from "../schemas/Product";
import Place from "../schemas/Place";

export default interface PlaceRepository {
    getPlace(placeName: string): Promise<Place>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: string): Promise<Product[]>;
    getProduct(placeName: string, prodName:string): Promise<Product>;
}