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
Object.defineProperty(exports, "__esModule", { value: true });
class PlaceServiceImp {
    constructor(placeRepository) {
        this.placeRepository = placeRepository;
    }
    getTendences() {
        return __awaiter(this, void 0, void 0, function* () {
            const places = yield this.placeRepository.getPlaces("");
            return places.sort((a, b) => b.id - a.id).slice(0, 4);
        });
    }
    getPlace(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.getPlace(placeName);
        });
    }
    getPlaces(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.getPlaces(placeName);
        });
    }
    getProducts(placeId, category) {
        return __awaiter(this, void 0, void 0, function* () {
            const prods = yield this.placeRepository.getProducts(placeId.toString());
            if (category == "Todo")
                return prods;
            return prods.filter((prod) => prod.category === category);
        });
    }
    getProduct(placeName, productName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.getProduct(placeName, productName);
        });
    }
    getCategories(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield this.placeRepository.getPlace(placeName);
            const products = this.placeRepository.getProducts(place.id.toString());
            return products.then((products) => {
                const categories = products.map((product) => product.category);
                return [...new Set(categories)];
            });
        });
    }
    getPlaceToken(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.getPlaceToken(placeId);
        });
    }
}
exports.default = PlaceServiceImp;
