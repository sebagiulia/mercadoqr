import Place from '../schemas/Place';
import Product from '../schemas/Product';

export default interface PlaceService {
    getPlace(placeName: string): Promise<Place>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: number): Promise<Product[]>;
    getProduct(placeName: string, productName: string): Promise<Product>;
}