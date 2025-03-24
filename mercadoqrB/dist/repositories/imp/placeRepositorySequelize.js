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
const errors_1 = require("../../errors/errors");
const Place_1 = require("../../models/Place");
const Product_1 = require("../../models/Product");
const clean_1 = require("../../utils/clean");
const sequelize_1 = require("sequelize");
class PlaceRepositorySequelize {
    getPlaceById(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield Place_1.Place.findByPk(placeId);
            if (place) {
                return place;
            }
            throw new errors_1.NotFoundError('Place not found');
        });
    }
    getPlace(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield Place_1.Place.findOne({ where: { name: placeName } });
            if (place) {
                return place;
            }
            throw new errors_1.NotFoundError('Place not found');
        });
    }
    getPlaces(placeName) {
        return __awaiter(this, void 0, void 0, function* () {
            const places = yield Place_1.Place.findAll({ where: { name: { [sequelize_1.Op.like]: `%${placeName}%` } } });
            if (places) {
                return places;
            }
            throw new errors_1.NotFoundError('Places not found');
        });
    }
    getProducts(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = Product_1.Product.findAll({ where: { place_id: placeId } });
            if (products) {
                return products;
            }
            throw new errors_1.NotFoundError('Products not found');
        });
    }
    getProduct(placeName, prodName) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield Place_1.Place.findOne({ where: { name: placeName } });
            const productName = (0, clean_1.transformToSpaceCase)(prodName);
            if (place) {
                const product = yield Product_1.Product.findOne({ where: { place_id: place.id, name: productName } });
                if (product) {
                    return product;
                }
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    getProductById(placeId, prodId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield Product_1.Product.findByPk(prodId);
            if (product) {
                return product;
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    getPlaceToken(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield Place_1.Place.findByPk(placeId);
            if (place) {
                return place.credential;
            }
            throw new errors_1.NotFoundError('Place not found');
        });
    }
}
exports.default = PlaceRepositorySequelize;
