import { NotFoundError } from "../../errors/errors"
import PlaceType from "../../schemas/Place"
import ProductType from "../../schemas/ProductResponse"
import PlaceRepository from "../placeRepository"
import { Place } from "../../models/Place"
import { Product } from "../../models/Product"
import { transformToSpaceCase } from "../../utils/clean"
import { Op } from "sequelize"
import Movement from "../../models/Movement"

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
        const products = await Product.findAll({ where: { place_id: placeId } })
        if (products) {
            return products.map(product => {
                const stock = product.getStatus()
                const productResponse = product.dataValues
                delete productResponse.stock
                return {...productResponse, stock}
            }
            )
        }
        throw new NotFoundError('Products not found')
    }

    async getProduct(placeName: string, prodName: string): Promise<ProductType> {
        const place = await Place.findOne({ where: { name: placeName } })
        const productName = transformToSpaceCase(prodName)
        if (place) {
            const product = await Product.findOne({ where: { place_id: place.id, name: productName } })
            if (product) {
                const stock = product.getStatus()
                const productResponse = product.dataValues
                delete productResponse.stock
                return {...productResponse, stock}
            }
        }
        throw new NotFoundError('Product not found')
    }

    async getProductById(placeId: number, prodId: number): Promise<ProductType> {
        const product = await Product.findByPk(prodId)
        if (product) {
            const stock = product.getStatus()
            const productResponse = product.dataValues
            delete productResponse.stock
            return {...productResponse, stock}
        }
        throw new NotFoundError('Product not found')
    }

    async getMovements(placeId: string): Promise<Movement[]> {
        /* const place = await Place.findByPk(placeId)
        if (place) {
            const movements = await place.getMovements()
            return movements
        }
        throw new NotFoundError('Place not found') */
        return []
    }

    async createProduct(placeId: number, product: ProductType): Promise<ProductType> {
        const newProduct = await Product.create({
            place_id: placeId,
            name: transformToSpaceCase(product.name),
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.img,
            stock: product.stock
        })
        const stock = newProduct.getStatus()
        const productResponse = newProduct.dataValues
        delete productResponse.stock
        return {...productResponse, stock}
    }

    async updateProduct(placeId: number, productId: number, product: Partial<ProductType>): Promise<ProductType> {
        const prod = await Product.findByPk(productId)
        if (prod) {
            if (prod.place_id !== placeId) {
                throw new NotFoundError('Product not found in this place')
            }
            if (product.name) {
                product.name = transformToSpaceCase(product.name)
            }
            await prod.update(product)
            const stock = prod.getStatus()
            const productResponse = prod.dataValues
            delete productResponse.stock
            return {...productResponse, stock}
        }
        throw new NotFoundError('Product not found')
    }

    async deleteProduct(placeId: number, productId: number): Promise<void> {
        const prod = await Product.findByPk(productId)
        if (prod) {
            if (prod.place_id !== placeId) {
                throw new NotFoundError('Product not found in this place')
            }
            await prod.destroy()
            return
        }
        throw new NotFoundError('Product not found')
    }

    async createPlace(data: PlaceType): Promise<PlaceType> {
        const newPlace = await Place.create({
            name: transformToSpaceCase(data.name),
            description: data.description,
            img: data.img,
            address: data.address,
            passwordHash: data.passwordHash,
            mpToken: data.mpToken
        })
        return newPlace;
    }
}
    
    