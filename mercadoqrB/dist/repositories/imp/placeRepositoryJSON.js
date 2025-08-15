"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const places_json_1 = __importDefault(require("../../data/places.json"));
const products_json_1 = __importDefault(require("../../data/products.json"));
const errors_1 = require("../../errors/errors");
const clean_1 = require("../../utils/clean");
class PlaceRepositoryJSON {
    constructor() {
        this.places = places_json_1.default;
        this.products = products_json_1.default;
    }
    getPlaceById(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = this.places.find(place => place.id === placeId);
            if (place)
                return place;
            throw new errors_1.NotFoundError('Place not found');
        });
    }
    getPlace(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = this.places.find(place => place.name === placeName);
            if (!place)
                throw new errors_1.NotFoundError('Place not found');
            return place;
        });
    }
    getPlaces(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const places = this.places.filter(place => place.name.includes(placeName));
            if (places.length > 0)
                return places.slice(0, 4);
            throw new errors_1.NotFoundError('Places not found');
        });
    }
    getProducts(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = this.products.filter(product => product.place_id.toString() === placeId);
            if (products.length > 0) {
                return products;
            }
            throw new errors_1.NotFoundError('Products not found');
        });
    }
    getProduct(placeName, prodName) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const product = this.products.find(product => product.id === prodId && product.place_id === placeId);
            if (product) {
                return product;
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    getPlaceToken(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = this.places.find(place => place.id === placeId);
            if (place)
                return place.credential;
            throw new errors_1.NotFoundError('Place not found');
        });
    }
}
exports.default = PlaceRepositoryJSON;
