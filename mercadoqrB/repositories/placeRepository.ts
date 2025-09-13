import Product from "../schemas/ProductResponse";
import Place from "../schemas/Place";
import PlaceResponse from "../schemas/PlaceResponse";

export default interface PlaceRepository {
    getPlaceById(placeId: number): Promise<Place>;
    getPlace(placeName: string): Promise<Place>;
    getPlaces(placeName: string): Promise<Place[]>;
    getProducts(placeId: string): Promise<Product[]>;
    getProduct(placeName: string, prodName:string): Promise<Product>;
    getProductById(placeId:number, prodId: number): Promise<Product>;
    
    createProduct(placeId: number, product:Product): Promise<Product>;
    updateProduct(placeId: number, productId:number, product: Partial<Product>): Promise<Product>;
    deleteProduct(placeId:number, productId: number): Promise<void>;

    createPlace(data: Place): Promise<PlaceResponse>;
}