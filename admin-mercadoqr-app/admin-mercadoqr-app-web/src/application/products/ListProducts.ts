import { Product } from "../../domain/entities/Product";
import { MockProductRepository } from "../../infrastructure/products/MockProductsRepository";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class ListProducts {
    private repo: IProductRepository;

    constructor(repo?: IProductRepository) {
        this.repo = repo ?? new MockProductRepository();
    }

    async execute(): Promise<Product[]> {
        return this.repo.getAll();
    }
}
