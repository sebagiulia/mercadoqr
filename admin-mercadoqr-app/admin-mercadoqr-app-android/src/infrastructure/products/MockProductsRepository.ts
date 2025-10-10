import { Product } from "../../domain/entities/Product";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import ErrorType from "../../utils/errorType";

let mockProducts: Product[] = [
    {
        "id": 1,
        "place_id": 1,
        "name": "Combo absolut",
        "price": 200,
        "description": "Absolut + 4 speed",
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrujTfJQItaRY2-gm4SaW1NzhiAUZ4-iu4OA&s",
        "category": "Combos",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 5
    },
    {
        "id": 2,
        "place_id": 1,
        "name": "Combo fernet",
        "price": 150,
        "description": "Fernet + 2 Coca cola",
        "img": "https://laprovedeampip.com.ar/wp-content/uploads/2024/11/Combo-Fernet.png",
        "category": "Combos",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 8
    },
    {
        "id": 3,
        "place_id": 1,
        "name": "Cerveza corona",
        "price": 100,
        "description": "Cerveza corona 1L",
        "img": "https://grupoelvalor.com/wp-content/uploads/2018/12/corona-media-clara.png",
        "category": "Cervezas",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 3
    },
    {
        "id": 11,
        "place_id": 1,
        "name": "Combo Jaggermaister",
        "price": 700,
        "description": "Jagger 750ml + 4 speed",
        "img": "https://http2.mlstatic.com/D_712218-MLA48482719970_122021-C.jpg",
        "category": "Combos",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 0
    },
    {
        "id": 12,
        "place_id": 1,
        "name": "Combo Black Label",
        "price": 1000,
        "description": "Black Label 750ml + 4 Red Bull",
        "img": "https://cardapioseguro.com.br/xodozin/wp-content/uploads/2022/06/COMBO-BLACK.jpg",
        "category": "Combos",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 10
    },
    {
        "id": 13,
        "place_id": 1,
        "name": "Cerveza Budweiser",
        "price": 100,
        "description": "Cerveza Budweiser 350ml",
        "img": "https://vinopremier.com/media/catalog/product/cache/8a40897d7c88cd1f7459b457be2eac5e/c/e/cerveza-budweiser-33cl-vinopremier.jpg",
        "category": "Cervezas",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 3
    },
    {
        "id": 14,
        "place_id": 1,
        "name": "Chandon Demi",
        "price": 1000,
        "description": "Champagne Chandon Demi Botella 750ml",
        "img": "https://www.conyntra.com/cdn/shop/files/4085U_Espumante_Demi_Sec_750_ml_00f7b6ca-853f-433b-a1b3-e7eecc3f575f.png?v=1739290996",
        "category": "Espumantes",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 7
    },
    {
        "id": 15,
        "place_id": 1,
        "name": "Mumm",
        "price": 500,
        "description": "Champagne Mumm Botella 750ml",
        "img": "https://http2.mlstatic.com/D_758363-MLU69116442770_042023-C.jpg",
        "category": "Espumantes",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 9
    },
    {
        "id": 16,
        "place_id": 1,
        "name": "Agua mineral",
        "price": 50,
        "description": "Agua 600ml",
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLH6OzJxJ77xktok4Rcjw6DJNbIZELAxjIKQ&s",
        "category": "Sin alcohol",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 4
    },
    {
        "id": 28,
        "place_id": 1,
        "name": "Entrada común",
        "price": 500,
        "description": "Sin beneficios",
        "img": "https://media.istockphoto.com/id/1146102903/es/vector/icono-de-entradas-de-cine-los-signos-y-s%C3%ADmbolos-se-pueden-utilizar-para-la-web-el-logotipo.jpg?s=612x612&w=0&k=20&c=U0hY0dA3v3Wj66RPos5oFtmpvlmRH3upfUyzlfeRQTo=",
        "category": "Entradas",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 9
    },
    {
        "id": 29,
        "place_id": 1,
        "name": "Entrada VIP",
        "price": 1000,
        "description": "Con beneficios",
        "img": "https://media.istockphoto.com/id/1146102903/es/vector/icono-de-entradas-de-cine-los-signos-y-s%C3%ADmbolos-se-pueden-utilizar-para-la-web-el-logotipo.jpg?s=612x612&w=0&k=20&c=U0hY0dA3v3Wj66RPos5oFtmpvlmRH3upfUyzlfeRQTo=",
        "category": "Entradas",
        "start_date": "2025-11-01",
        "end_date": "2025-11-30",
        "stock": 6
    }


];

export class MockProductRepository implements IProductRepository {
    async getAll(token:string): Promise<ErrorType<Product[]>> {
        return {success:true,data:mockProducts};
    }

    async create(token:string, product: Product): Promise<ErrorType<Product>> {
        const newProduct = { ...product, id: mockProducts.length + 1 };
        mockProducts.push(newProduct);

        return {success:true, data:newProduct};
    }

    async update(token:string, productId: number, updatedFields: Partial<Product>): Promise<ErrorType<Product>> {
        const index = mockProducts.findIndex(p => p.id === productId);
        if (index === -1) throw new Error("Producto no encontrado");
        mockProducts[index] = { ...mockProducts[index], ...updatedFields };
        return {success:true,data:mockProducts[index]};
    }

    async delete(token:string, productId: number): Promise<ErrorType<void>> {
        mockProducts = mockProducts.filter(p => p.id !== productId);
        return {success:true};
    }
}