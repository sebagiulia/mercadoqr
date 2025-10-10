import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";

export class ManageProduct {
    private repository: IProductRepository;

    constructor(repository: IProductRepository) {
        this.repository = repository;
    }

    async create(product: Product): Promise<Product> {
        return await this.repository.create(product);
    }

    async update(pid:number, product: Product): Promise<Product> {
        return await this.repository.update(pid, product);
    }

    async delete(productId: number): Promise<void> {
        return await this.repository.delete(productId);
    }
}
