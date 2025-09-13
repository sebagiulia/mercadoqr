import Place from '../schemas/Place';
import PlaceResponse from '../schemas/PlaceResponse';
import Product from '../schemas/ProductResponse';

export default interface PlaceService {
    getPlace(placeName: string): Promise<Place>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: number, category:string): Promise<Product[]>;
    getProduct(placeName: string, productName: string): Promise<Product>;
    getCategories(placeName: string): Promise<string[]>;

    createProduct(placeId: number, product:Product): Promise<Product>;
    updateProduct(placeId: number, productId:number, product: Partial<Product>): Promise<Product>;
    deleteProduct(placeId: number, productId:number): Promise<void>;

    createPlace(place: Place): Promise<PlaceResponse>;
}