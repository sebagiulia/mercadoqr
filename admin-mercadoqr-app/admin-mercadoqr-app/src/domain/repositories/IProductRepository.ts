import { Product } from "../entities/Product";

export interface IProductRepository {
    getAll(place_id: string): Promise<Product[]>;
    create(place_id:string, product: Product): Promise<Product>;
    update(place_id:string, productId: number, updatedFields: Partial<Product>): Promise<Product>;
    delete(place_id:string, productId: number): Promise<void>;
}
