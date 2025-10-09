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
const bcrypt_1 = __importDefault(require("bcrypt"));
class PlaceServiceImp {
    constructor(placeRepository) {
        this.placeRepository = placeRepository;
    }
    getPlace(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.getPlace(placeName);
        });
    }
    getPlaceById(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.getPlaceById(placeId);
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
    getMovements(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.getMovements(placeId.toString());
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
    createProduct(placeId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.createProduct(placeId, product);
        });
    }
    updateProduct(placeId, productId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.updateProduct(placeId, productId, product);
        });
    }
    deleteProduct(placeId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.deleteProduct(placeId, productId);
        });
    }
    createPlace(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const SALT_ROUNDS = 10;
            const hashedPassword = yield bcrypt_1.default.hash(data.password, SALT_ROUNDS);
            const placeWithoutPassword = yield this.placeRepository.createPlace({
                id: 0, // The ID will be set by the repository
                name: data.nombre,
                fullName: data.nombreCompleto,
                description: "",
                address: data.direccion,
                city: data.ciudad,
                socialMedia: data.instagram,
                img: data.imagen,
                email: data.email,
                passwordHash: hashedPassword,
                mpToken: data.mercadopago
            });
            return placeWithoutPassword;
        });
    }
    updatePlace(placeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.updatePlace(placeId, data);
        });
    }
    deletePlace(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.placeRepository.deletePlace(placeId);
        });
    }
}
exports.default = PlaceServiceImp;
