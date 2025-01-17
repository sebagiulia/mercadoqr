import Place from '../../schemas/Place'
import Product from '../../schemas/Product'
import PlaceService from '../PlaceService'
import PlaceRepository from '../../repositories/placeRepository'

export default class PlaceServiceImp implements PlaceService {
    private placeRepository: PlaceRepository

    constructor(placeRepository: PlaceRepository) {
        this.placeRepository = placeRepository
    }
    
    async getPlace(placeName: string): Promise<Place> {
        return this.placeRepository.getPlace(placeName)
    }

    async getPlaces(placeName: string): Promise<Place[]> {
        return this.placeRepository.getPlaces(placeName)
    }

    async getProducts(placeId: number): Promise<Product[]> {
        return this.placeRepository.getProducts(placeId.toString())
    }

    async getProduct(placeName: string, productName: string): Promise<Product> {
        return this.placeRepository.getProduct(placeName, productName)
    }
}