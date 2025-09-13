import Place from '../../schemas/Place'
import Product from '../../schemas/Product'
import ProductResp from '../../schemas/ProductResponse'
import PlaceRepository from '../placeRepository'
import places from '../../data/places.json'
import products from '../../data/products.json'
import { NotFoundError, RegistrationError } from '../../errors/errors'
import { transformToSpaceCase } from '../../utils/clean'
import PlaceResponse from '../../schemas/PlaceResponse'
import * as fs from 'fs';
import * as path from 'path';

const filePathPlace = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/places.json');
const filePathProds = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/products.json');

// Función para agregar datos al JSON
function writePlace(place:Place): void {
    const placeString = fs.readFileSync(filePathPlace, 'utf-8');
    const places = JSON.parse(placeString) as Place[];
    if (!places.find((placeItem: Place) => placeItem.id === place.id)) {
        places.push(place);
    } else {
        places.map((placeItem: Place) => { 
            if (placeItem.id === place.id) {
                Object.assign(placeItem, place);
            }
        })
    }
    fs.writeFileSync(filePathPlace, JSON.stringify(places, null, 2));
}

function writeProduct(product:Product): void {
    const productString = fs.readFileSync(filePathProds, 'utf-8');
    const products = JSON.parse(productString) as Product[];
    if (!products.find((productItem: Product) => productItem.id === product.id)) {
        products.push(product);
    } else {
        products.map((productItem: Product) => { 
            if (productItem.id === product.id) {
                Object.assign(productItem, product);
            }
        })
    }
    fs.writeFileSync(filePathProds, JSON.stringify(products, null, 2));
}

export default class PlaceRepositoryJSON implements PlaceRepository {
    private places: Place[]
    private products: Product[]

    constructor() {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString) as Product[];

    }

    async getPlaceById(placeId: number): Promise<Place> {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const place = this.places.find(place => place.id === placeId)
        if (place) return place
        throw new NotFoundError('Place not found')
    }
    
    async getPlace(placeName: string): Promise<Place> {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const place = this.places.find(place => place.name === placeName)
        if (!place) throw new NotFoundError('Place not found')
        return place
    }

    async getPlaces(placeName: string): Promise<Place[]> {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const places = this.places.filter(place => place.name.includes(placeName))
        if (places.length > 0) return places.slice(0, 4)
        throw new NotFoundError('Places not found')
    }

    async getProducts(placeId: string): Promise<ProductResp[]> {
        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString) as Product[];

        const products = this.products.filter(product => product.place_id.toString() === placeId)
        if (products.length > 0) {
            return products
        }
        throw new NotFoundError('Products not found')
    }   

    async getProduct(placeName: string, prodName: string): Promise<ProductResp> {
        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString) as Product[];

        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const productName = transformToSpaceCase(prodName)
        const place = this.places.find(place => place.name === placeName)
        if (!place) throw new NotFoundError('Place not found')
        const product = this.products.find(product => product.place_id === place.id && product.name === productName)
        if (product){
            return product
        }
        throw new NotFoundError('Product not found')
    }
    
    async getProductById(placeId: number, prodId: number): Promise<ProductResp> {
        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString) as Product[];

        const product = this.products.find(product => product.id === prodId && product.place_id === placeId)
        if (product){
            return product         
        }
        throw new NotFoundError('Product not found')
    }

   async createProduct(placeId: number, product: Product): Promise<Product> {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString) as Product[];

        const place = this.places.find(place => place.id === placeId)
        if (!place) throw new NotFoundError('Place not found')
        const newProduct = { ...product, id: this.products.length + 1, place_id: placeId }
        this.products.push(newProduct)
        writeProduct(newProduct);
        return newProduct
    }

    async updateProduct(placeId: number, productId:number, product: Partial<Product>): Promise<Product> {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString) as Product[];


        const place = this.places.find(place => place.id === placeId)
        if (!place) throw new NotFoundError('Place not found')
        const prodIndex = this.products.findIndex(p => p.id === productId && p.place_id === placeId)
        if (prodIndex === -1) throw new NotFoundError('Product not found')
        const updatedProduct = { ...this.products[prodIndex], ...product }
        this.products[prodIndex] = updatedProduct
        writeProduct(updatedProduct);
        return updatedProduct
    }

    async deleteProduct(placeId: number, productId:number): Promise<void> {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString) as Product[];
        
        const place = this.places.find(place => place.id === placeId)
        if (!place) throw new NotFoundError('Place not found')
        const prodIndex = this.products.findIndex(p => p.id === productId && p.place_id === placeId)
        if (prodIndex === -1) throw new NotFoundError('Product not found')
        this.products.splice(prodIndex, 1)
        fs.writeFileSync(filePathProds, JSON.stringify(this.products, null, 2));
    }


    async createPlace(data: Place): Promise<PlaceResponse> {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString) as Place[];

        if(this.places.find(place => place.name === data.name)) {
            throw new RegistrationError('Sucursal ya existente');
        }

        if(!data.mpToken) {
            throw new RegistrationError('Token de Mercado Pago es requerido');
        }            

        const newPlace: Place = { ...data, id: this.places.length + 1 }
        this.places.push(newPlace)
        writePlace(newPlace);
        return newPlace as PlaceResponse
    }
}