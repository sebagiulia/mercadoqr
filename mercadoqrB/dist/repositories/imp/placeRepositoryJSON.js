"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors/errors");
const clean_1 = require("../../utils/clean");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const filePathPlace = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/places.json');
const filePathProds = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/products.json');
// Función para agregar datos al JSON
function writePlace(place) {
    const placeString = fs.readFileSync(filePathPlace, 'utf-8');
    const places = JSON.parse(placeString);
    if (!places.find((placeItem) => placeItem.id === place.id)) {
        places.push(place);
    }
    else {
        places.map((placeItem) => {
            if (placeItem.id === place.id) {
                Object.assign(placeItem, place);
            }
        });
    }
    fs.writeFileSync(filePathPlace, JSON.stringify(places, null, 2));
}
function writeProduct(product) {
    const productString = fs.readFileSync(filePathProds, 'utf-8');
    const products = JSON.parse(productString);
    if (!products.find((productItem) => productItem.id === product.id)) {
        products.push(product);
    }
    else {
        products.map((productItem) => {
            if (productItem.id === product.id) {
                Object.assign(productItem, product);
            }
        });
    }
    fs.writeFileSync(filePathProds, JSON.stringify(products, null, 2));
}
class PlaceRepositoryJSON {
    constructor() {
        const placesString = fs.readFileSync(filePathPlace, 'utf-8');
        this.places = JSON.parse(placesString);
        const productsString = fs.readFileSync(filePathProds, 'utf-8');
        this.products = JSON.parse(productsString);
    }
    getPlaceById(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            const place = this.places.find(place => place.id === placeId);
            if (place)
                return place;
            throw new errors_1.NotFoundError('Place not found');
        });
    }
    getPlace(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            const place = this.places.find(place => place.name === placeName);
            if (!place)
                throw new errors_1.NotFoundError('Place not found');
            return place;
        });
    }
    getPlaces(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            const places = this.places.filter(place => place.name.includes(placeName));
            if (places.length > 0)
                return places.slice(0, 4);
            throw new errors_1.NotFoundError('Places not found');
        });
    }
    getProducts(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsString = fs.readFileSync(filePathProds, 'utf-8');
            this.products = JSON.parse(productsString);
            const products = this.products.filter(product => product.place_id.toString() === placeId);
            if (products.length > 0) {
                return products;
            }
            throw new errors_1.NotFoundError('Products not found');
        });
    }
    getProduct(placeName, prodName) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsString = fs.readFileSync(filePathProds, 'utf-8');
            this.products = JSON.parse(productsString);
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            const productName = (0, clean_1.transformToSpaceCase)(prodName);
            const place = this.places.find(place => place.name === placeName);
            if (!place)
                throw new errors_1.NotFoundError('Place not found');
            const product = this.products.find(product => product.place_id === place.id && product.name === productName);
            if (product) {
                return product;
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    getProductById(placeId, prodId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsString = fs.readFileSync(filePathProds, 'utf-8');
            this.products = JSON.parse(productsString);
            const product = this.products.find(product => product.id === prodId && product.place_id === placeId);
            if (product) {
                return product;
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    createProduct(placeId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            const productsString = fs.readFileSync(filePathProds, 'utf-8');
            this.products = JSON.parse(productsString);
            const place = this.places.find(place => place.id === placeId);
            if (!place)
                throw new errors_1.NotFoundError('Place not found');
            const newProduct = Object.assign(Object.assign({}, product), { id: this.products.length + 1, place_id: placeId });
            this.products.push(newProduct);
            writeProduct(newProduct);
            return newProduct;
        });
    }
    updateProduct(placeId, productId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            const productsString = fs.readFileSync(filePathProds, 'utf-8');
            this.products = JSON.parse(productsString);
            const place = this.places.find(place => place.id === placeId);
            if (!place)
                throw new errors_1.NotFoundError('Place not found');
            const prodIndex = this.products.findIndex(p => p.id === productId && p.place_id === placeId);
            if (prodIndex === -1)
                throw new errors_1.NotFoundError('Product not found');
            const updatedProduct = Object.assign(Object.assign({}, this.products[prodIndex]), product);
            this.products[prodIndex] = updatedProduct;
            writeProduct(updatedProduct);
            return updatedProduct;
        });
    }
    deleteProduct(placeId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            const productsString = fs.readFileSync(filePathProds, 'utf-8');
            this.products = JSON.parse(productsString);
            const place = this.places.find(place => place.id === placeId);
            if (!place)
                throw new errors_1.NotFoundError('Place not found');
            const prodIndex = this.products.findIndex(p => p.id === productId && p.place_id === placeId);
            if (prodIndex === -1)
                throw new errors_1.NotFoundError('Product not found');
            this.products.splice(prodIndex, 1);
            fs.writeFileSync(filePathProds, JSON.stringify(this.products, null, 2));
        });
    }
    createPlace(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const placesString = fs.readFileSync(filePathPlace, 'utf-8');
            this.places = JSON.parse(placesString);
            if (this.places.find(place => place.name === data.name)) {
                throw new errors_1.RegistrationError('Sucursal ya existente');
            }
            if (!data.mpToken) {
                throw new errors_1.RegistrationError('Token de Mercado Pago es requerido');
            }
            const newPlace = Object.assign(Object.assign({}, data), { id: this.places.length + 1 });
            this.places.push(newPlace);
            writePlace(newPlace);
            return newPlace;
        });
    }
}
exports.default = PlaceRepositoryJSON;
