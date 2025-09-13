import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { apiClient } from "../../utils/apiClient";


import endpoints from "../../utils/endpoints";
import ErrorType from "../../utils/errorType";

export class BackProductsRepository implements IProductRepository {
    async getAll(token:string): Promise<ErrorType<Product[]>> {
        return apiClient(endpoints.GET_PLACE_PRODUCTS_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
        }
        )
    }

    async create(token:string, product: Product): Promise<ErrorType<Product>> {
        return apiClient(endpoints.CREATE_PRODUCT_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(product)
        })
    }

    async update(token:string, productId: number, updatedFields: Partial<Product>): Promise<ErrorType<Product>> {
        return apiClient(endpoints.UPDATE_PRODUCT_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: productId, ...updatedFields })
        })
    }

    async delete(place_id:string, productId: number): Promise<ErrorType<void>> {
        return apiClient(endpoints.DELETE_PRODUCT_API, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${place_id}`
            },
            body: JSON.stringify({ id: productId })
        })
    }
}