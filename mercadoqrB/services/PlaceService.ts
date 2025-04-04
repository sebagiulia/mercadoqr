import Place from '../schemas/Place';
import Product from '../schemas/ProductResponse';

export default interface PlaceService {
    getTendences(): Promise<Place[]>;
    getPlace(placeName: string): Promise<Place>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: number, category:string): Promise<Product[]>;
    getProduct(placeName: string, productName: string): Promise<Product>;
    getCategories(placeName: string): Promise<string[]>;
    getPlaceToken(placeId: number): Promise<string>;
}