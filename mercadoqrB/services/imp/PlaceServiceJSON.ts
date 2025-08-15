import Place from '../../schemas/Place'
import ProductResp from '../../schemas/ProductResponse'
import PlaceService from '../PlaceService'
import PlaceRepository from '../../repositories/placeRepository'

export default class PlaceServiceImp implements PlaceService {
    private placeRepository: PlaceRepository

    constructor(placeRepository: PlaceRepository) {
        this.placeRepository = placeRepository
    }

    async getTendences(): Promise<Place[]> {
        const places = await this.placeRepository.getPlaces("")
        return places.sort((a, b) => b.id - a.id).slice(0, 4)
    }
    
    async getPlace(placeName: string): Promise<Place> {
        return this.placeRepository.getPlace(placeName)
    }

    async getPlaces(placeName: string): Promise<Place[]> {
        return this.placeRepository.getPlaces(placeName)
    }

    async getProducts(placeId: number, category:string): Promise<ProductResp[]> {
        const prods = await this.placeRepository.getProducts(placeId.toString())
        if(category == "Todo") return prods
        return prods.filter((prod) => prod.category === category)
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

    async getPlaceToken(placeId: number): Promise<string> {
        return this.placeRepository.getPlaceToken(placeId)
    }
}