import Place from '../../schemas/Place'
import ProductResp from '../../schemas/ProductResponse'
import PlaceService from '../PlaceService'
import PlaceRepository from '../../repositories/placeRepository'
import Product from '../../schemas/ProductResponse'
import PlaceResponse from '../../schemas/PlaceResponse'
import bcrypt from 'bcrypt';
import FormData from '../../schemas/FormData'

export default class PlaceServiceImp implements PlaceService {
    private placeRepository: PlaceRepository

    constructor(placeRepository: PlaceRepository) {
        this.placeRepository = placeRepository
        
    }
    
    async getPlace(placeName: string): Promise<Place> {
        return this.placeRepository.getPlace(placeName)
    }

    async getPlaceById(placeId: number): Promise<Place> {
        return this.placeRepository.getPlaceById(placeId)
    }

    async getPlaces(placeName: string): Promise<Place[]> {
        return this.placeRepository.getPlaces(placeName)
    }

    async getProducts(placeId: number, category:string): Promise<ProductResp[]> {
        const prods = await this.placeRepository.getProducts(placeId.toString())
        if(category == "Todo") return prods
        return prods.filter((prod) => prod.category === category)
    }

    async getMovements(placeId: number): Promise<any[]> {
        return this.placeRepository.getMovements(placeId.toString())
    }

    async getProduct(placeName: string, productName: string): Promise<ProductResp> {
        return this.placeRepository.getProduct(placeName, productName)
    }

    async getCategories(placeName: string): Promise<string[]> {
        const place = await this.placeRepository.getPlace(placeName)
        const products = this.placeRepository.getProducts(place.id.toString())
        return products.then((products) => {
            const categories = products.map((product) => product.category)
            return [...new Set(categories)]
        })
    }

    async createProduct(placeId: number, product:Product): Promise<Product> {
        return this.placeRepository.createProduct(placeId, product)
    }

    async updateProduct(placeId: number, productId:number, product: Partial<Product>): Promise<Product> {
        return this.placeRepository.updateProduct(placeId, productId,product)
    }

    async deleteProduct(placeId: number, productId:number): Promise<void> {
        return this.placeRepository.deleteProduct(placeId, productId)
    }


    async createPlace(data: FormData): Promise<PlaceResponse> {
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const placeWithoutPassword = await this.placeRepository.createPlace(
        {
            id: 0, // The ID will be set by the repository
            name: data.nombre,
            fullName: data.nombreCompleto,
            description: "",
            address: data.direccion,
            city: data.ciudad,
            socialMedia: data.instagram,
            img: data.imagen,
            email: data.email,
            passwordHash: hashedPassword,
            mpToken: data.mercadopago
        });
      
        return placeWithoutPassword;
    }

    async updatePlace(placeId: number, data: Partial<Place>): Promise<PlaceResponse> {
        return this.placeRepository.updatePlace(placeId, data);
    }

    async deletePlace(placeId: number): Promise<void> {
        return this.placeRepository.deletePlace(placeId);
    }
}