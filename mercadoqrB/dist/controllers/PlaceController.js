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
const respondeUtil_1 = require("../utils/respondeUtil");
class PlaceController {
    constructor(placeService) {
        this.placeService = placeService;
        this.getPlace = this.getPlace.bind(this);
        this.getPlaces = this.getPlaces.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.createPlace = this.createPlace.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        console.log('✅ Servicio de Places activo');
    }
    createPlace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = req.body;
            try {
                const newPlace = yield this.placeService.createPlace(formData);
                (0, respondeUtil_1.sendSuccess)(res, newPlace, 'Solicitud recibida');
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPlace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeName = req.params.place;
            try {
                const place = yield this.placeService.getPlace(placeName);
                (0, respondeUtil_1.sendSuccess)(res, place);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPlaces(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeName = req.params.place;
            try {
                const places = yield this.placeService.getPlaces(placeName);
                (0, respondeUtil_1.sendSuccess)(res, places);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeId = req.params.id;
            const category = req.params.category;
            try {
                const products = yield this.placeService.getProducts(parseInt(placeId, 10), category);
                (0, respondeUtil_1.sendSuccess)(res, products);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeName = req.params.place;
            const productName = req.params.product;
            try {
                const product = yield this.placeService.getProduct(placeName, productName);
                (0, respondeUtil_1.sendSuccess)(res, product);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeName = req.params.place;
            try {
                const categories = yield this.placeService.getCategories(placeName);
                (0, respondeUtil_1.sendSuccess)(res, categories);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeId = req.params.placeId;
            const productId = req.params.productId;
            const product = req.body;
            try {
                const updatedProduct = yield this.placeService.updateProduct(parseInt(placeId, 10), parseInt(productId, 10), product);
                (0, respondeUtil_1.sendSuccess)(res, updatedProduct);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeId = req.params.placeId;
            const productId = req.params.productId;
            try {
                yield this.placeService.deleteProduct(parseInt(placeId, 10), parseInt(productId, 10));
                (0, respondeUtil_1.sendSuccess)(res, 'Producto eliminado');
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = PlaceController;
