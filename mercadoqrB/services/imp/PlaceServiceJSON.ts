import Place from '../../schemas/Place'
import Product from '../../schemas/Product'
import PlaceRepository from '../PlaceService'
import places from '../../data/places.json'
import products from '../../data/products.json'
import { NotFoundError } from '../../errors/errors'

export default class PlaceRepositoryJSON implements PlaceRepository {
    private places: Place[]
    private products: Product[]

    constructor() {
        this.places = places
        this.products = products
    }
    
    async getPlace(placeName: string): Promise<Place | null> {
        const place = this.places.find(place => place.name === placeName)
        if (!place) throw new NotFoundError('Place not found')
        return place
    }

    async getPlaces(placeName: string): Promise<Place[]> {
        const places = this.places.filter(place => place.name.includes(placeName))
        if (places.length > 0) return places
        throw new NotFoundError('Places not found')
    }

    async getProducts(placeId: number): Promise<Product[]> {
        const products = this.products.filter(product => product.place_id === placeId)
        if (products.length > 0) return products
        throw new NotFoundError('Products not found')
    }

    async getProduct(placeName: string, productName: string): Promise<Product | null> {
        const place = await this.getPlace(placeName)
        if (!place) throw new NotFoundError('Place not found')
        const product = this.products.find(product => product.place_id === place.id && product.name === productName)
        if (!product) throw new NotFoundError('Product not found')
        return product
    }
}