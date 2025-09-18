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
            const products = yield Product_1.Product.findAll({ where: { place_id: placeId } });
            if (products) {
                return products.map(product => {
                    const stock = product.getStatus();
                    const productResponse = product.dataValues;
                    delete productResponse.stock;
                    return Object.assign(Object.assign({}, productResponse), { stock });
                });
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
                    const stock = product.getStatus();
                    const productResponse = product.dataValues;
                    delete productResponse.stock;
                    return Object.assign(Object.assign({}, productResponse), { stock });
                }
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    getProductById(placeId, prodId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield Product_1.Product.findByPk(prodId);
            if (product) {
                const stock = product.getStatus();
                const productResponse = product.dataValues;
                delete productResponse.stock;
                return Object.assign(Object.assign({}, productResponse), { stock });
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    getMovements(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const place = await Place.findByPk(placeId)
            if (place) {
                const movements = await place.getMovements()
                return movements
            }
            throw new NotFoundError('Place not found') */
            return [];
        });
    }
    createProduct(placeId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = yield Product_1.Product.create({
                place_id: placeId,
                name: (0, clean_1.transformToSpaceCase)(product.name),
                description: product.description,
                price: product.price,
                category: product.category,
                image: product.img,
                stock: product.stock
            });
            const stock = newProduct.getStatus();
            const productResponse = newProduct.dataValues;
            delete productResponse.stock;
            return Object.assign(Object.assign({}, productResponse), { stock });
        });
    }
    updateProduct(placeId, productId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const prod = yield Product_1.Product.findByPk(productId);
            if (prod) {
                if (prod.place_id !== placeId) {
                    throw new errors_1.NotFoundError('Product not found in this place');
                }
                if (product.name) {
                    product.name = (0, clean_1.transformToSpaceCase)(product.name);
                }
                yield prod.update(product);
                const stock = prod.getStatus();
                const productResponse = prod.dataValues;
                delete productResponse.stock;
                return Object.assign(Object.assign({}, productResponse), { stock });
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    deleteProduct(placeId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prod = yield Product_1.Product.findByPk(productId);
            if (prod) {
                if (prod.place_id !== placeId) {
                    throw new errors_1.NotFoundError('Product not found in this place');
                }
                yield prod.destroy();
                return;
            }
            throw new errors_1.NotFoundError('Product not found');
        });
    }
    createPlace(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPlace = yield Place_1.Place.create({
                name: (0, clean_1.transformToSpaceCase)(data.name),
                description: data.description,
                img: data.img,
                address: data.address,
                passwordHash: data.passwordHash,
                mpToken: data.mpToken
            });
            return newPlace;
        });
    }
    updatePlace(placeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield Place_1.Place.findByPk(placeId);
            if (place) {
                if (data.name) {
                    data.name = (0, clean_1.transformToSpaceCase)(data.name);
                }
                yield place.update(data);
                return place;
            }
            throw new errors_1.NotFoundError('Place not found');
        });
    }
    deletePlace(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield Place_1.Place.findByPk(placeId);
            if (place) {
                yield place.destroy();
                return;
            }
            throw new errors_1.NotFoundError('Place not found');
        });
    }
}
exports.default = PlaceRepositorySequelize;
