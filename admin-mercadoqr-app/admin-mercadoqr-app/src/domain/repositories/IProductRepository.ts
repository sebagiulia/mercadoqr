import { Product } from "../entities/Product";

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    create(product: Product): Promise<Product>;
    update(productId: number, updatedFields: Partial<Product>): Promise<Product>;
    delete(productId: number): Promise<void>;
}
