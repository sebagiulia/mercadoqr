import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";


import endpoints from "../../utils/endpoints";

export class BackProductsRepository implements IProductRepository {
    async getAll(place_id:string): Promise<Product[]> {
        const response = await fetch(`${endpoints.GET_PLACE_PRODUCTS_API}${place_id}/Todo`);
        if (!response.ok) throw new Error("Error al obtener productos");
        const res = await response.json();
        return res.data;        
    }

    async create(place_id:string, product: Product): Promise<Product> {
        const response = await fetch(endpoints.CREATE_PRODUCT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error("Error al crear producto");
        const newProduct: Product = await response.json();
        return newProduct;
    }

    async update(place_id:string, productId: number, updatedFields: Partial<Product>): Promise<Product> {
        const response = await fetch(endpoints.UPDATE_PRODUCT_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productId, ...updatedFields })
        });
        if (!response.ok) throw new Error("Error al actualizar producto");
        const updatedProduct: Product = await response.json();
        return updatedProduct;
    }

    async delete(place_id:string, productId: number): Promise<void> {
        const response = await fetch(endpoints.DELETE_PRODUCT_API, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productId })
        });
        if (!response.ok) throw new Error("Error al eliminar producto");
        return; 
    }
}