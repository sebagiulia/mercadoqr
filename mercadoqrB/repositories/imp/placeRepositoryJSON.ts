import Place from '../../schemas/Place'
import Product from '../../schemas/Product'
import ProductResp from '../../schemas/ProductResponse'
import PlaceRepository from '../placeRepository'
import places from '../../data/places.json'
import products from '../../data/products.json'
import { NotFoundError } from '../../errors/errors'
import { transformToSpaceCase } from '../../utils/clean'

export default class PlaceRepositoryJSON implements PlaceRepository {
    private places: Place[]
    private products: Product[]

    constructor() {
        this.places = places
        this.products = products
    }

    async getPlaceById(placeId: number): Promise<Place> {
        const place = this.places.find(place => place.id === placeId)
        if (place) return place
        throw new NotFoundError('Place not found')
    }
    
    async getPlace(placeName: string): Promise<Place> {
        const place = this.places.find(place => place.name === placeName)
        if (!place) throw new NotFoundError('Place not found')
        return place
    }

    async getPlaces(placeName: string): Promise<Place[]> {
        const places = this.places.filter(place => place.name.includes(placeName))
        if (places.length > 0) return places.slice(0, 4)
        throw new NotFoundError('Places not found')
    }

    async getProducts(placeId: string): Promise<ProductResp[]> {
        const products = this.products.filter(product => product.place_id.toString() === placeId)
        if (products.length > 0) {
            return products.map(product => {
                const stock = product.stock === 0 ? 'Agotado' : product.stock < 5 ? 'Quedan pocos' : 'Disponible' 
                const productResp = {...product}
                return {...productResp, stock}
            })
        }
        throw new NotFoundError('Products not found')
    }   

    async getProduct(placeName: string, prodName: string): Promise<ProductResp> {
        const productName = transformToSpaceCase(prodName)
        const place = this.places.find(place => place.name === placeName)
        if (!place) throw new NotFoundError('Place not found')
        const product = this.products.find(product => product.place_id === place.id && product.name === productName)
        if (product){
            const stock = product.stock === 0 ? 'Agotado' : product.stock < 5 ? 'Quedan pocos' : 'Disponible' 
            const productResp = {...product}
            return {...productResp, stock}
        }
        throw new NotFoundError('Product not found')
    }
    
    async getProductById(placeId: number, prodId: number): Promise<ProductResp> {
        const product = this.products.find(product => product.id === prodId && product.place_id === placeId)
        if (product){
            const stock = product.stock === 0 ? 'Agotado' : product.stock < 5 ? 'Quedan pocos' : 'Disponible' 
            const productResp = {...product}
            return {...productResp, stock}            
        }
        throw new NotFoundError('Product not found')
    }

    async getPlaceToken(placeId: number): Promise<string> {
        const place = this.places.find(place => place.id === placeId)
        if (place) return place.credential
        throw new NotFoundError('Place not found')
    }
}