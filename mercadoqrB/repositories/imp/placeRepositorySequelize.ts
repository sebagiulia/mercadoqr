import { NotFoundError } from "../../errors/errors"
import PlaceType from "../../schemas/Place"
import ProductType from "../../schemas/Product"
import PlaceRepository from "../placeRepository"
import { Place } from "../../models/Place"
import { Product } from "../../models/Product"
import { transformToSpaceCase } from "../../utils/clean"
import { Op } from "sequelize"

export default class PlaceRepositorySequelize implements PlaceRepository {
    
    async getPlaceById(placeId: number): Promise<PlaceType> {
        const place = await Place.findByPk(placeId)
        if (place) {
            return place
        }
        throw new NotFoundError('Place not found')
    }
    
    async getPlace(placeName: string): Promise<PlaceType> {
        const place = await Place.findOne({ where: { name: placeName } })
        if (place) {
            return place
        }
        throw new NotFoundError('Place not found')
    }

    async getPlaces(placeName: string): Promise<PlaceType[]> {
        const places = await Place.findAll({ where: { name:  { [Op.like]:`%${placeName}%`}} })
        if (places) {
            return places
        }
        throw new NotFoundError('Places not found')
    }

    async getProducts(placeId: string): Promise<ProductType[]> {
        const products = Product.findAll({ where: { place_id: placeId } })
        if (products) {
            return products
        }
        throw new NotFoundError('Products not found')
    }   

    async getProduct(placeName: string, prodName: string): Promise<ProductType> {
        const place = await Place.findOne({ where: { name: placeName } })
        const productName = transformToSpaceCase(prodName)
        if (place) {
            const product = await Product.findOne({ where: { place_id: place.id, name: productName } })
            if (product) {
                return product
            }
        }
        throw new NotFoundError('Product not found')
    }
    
    async getProductById(placeId: number, prodId: number): Promise<ProductType> {
        const product = await Product.findByPk(prodId)
        if (product) {
            return product
        }
        throw new NotFoundError('Product not found')
    }

    async getPlaceToken(placeId: number): Promise<string> {
        const place = await Place.findByPk(placeId)
        if (place) {
            return place.credential
        }
        throw new NotFoundError('Place not found')
    }
}