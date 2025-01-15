import Place from '../schemas/Place';
import Product from '../schemas/Product';

export default interface PlaceRepository {
    getPlace(placeName: string): Promise<Place|null>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: number): Promise<Product[]>;
    getProduct(placeName: string, productName: string): Promise<Product|null>;
}