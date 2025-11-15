import { Product } from "../entities/Product";
import ErrorType from "../../utils/errorType";

export interface IProductRepository {
    getAll(token: string): Promise<ErrorType<Product[]>>;
    create(token:string, product: Product): Promise<ErrorType<Product>>;
    update(token: string, productId: number, updatedFields: Partial<Product>): Promise<ErrorType<Product>>;
    delete(token:string, productId: number): Promise<ErrorType<void>>;
}
