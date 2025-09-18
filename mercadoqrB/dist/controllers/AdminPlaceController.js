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
class AdminPlaceController {
    constructor(placeService) {
        this.placeService = placeService;
        this.getPlace = this.getPlace.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getMovements = this.getMovements.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updatePlace = this.updatePlace.bind(this);
        this.deletePlace = this.deletePlace.bind(this);
        console.log('✅ Servicio de Places activo');
    }
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = req.body;
            try {
                const newProduct = yield this.placeService.createProduct(req.placeId || 0, product);
                (0, respondeUtil_1.sendSuccess)(res, newProduct);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPlace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const place_id = req.placeId;
            try {
                const place = yield this.placeService.getPlaceById(place_id || 0);
                (0, respondeUtil_1.sendSuccess)(res, place);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const place_id = req.placeId;
            try {
                const place = yield this.placeService.getProducts(place_id || 0, "Todo");
                (0, respondeUtil_1.sendSuccess)(res, place);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMovements(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const place_id = req.placeId;
            try {
                const movements = yield this.placeService.getMovements(place_id || 0);
                (0, respondeUtil_1.sendSuccess)(res, movements);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeId = req.placeId;
            const product = req.body;
            try {
                const updatedProduct = yield this.placeService.updateProduct(placeId || 0, parseInt(product.id, 10), product);
                (0, respondeUtil_1.sendSuccess)(res, updatedProduct);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeId = req.placeId;
            const productId = req.body.id;
            try {
                yield this.placeService.deleteProduct(placeId || 0, parseInt(productId, 10));
                (0, respondeUtil_1.sendSuccess)(res, 'Producto eliminado');
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePlace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const place_id = req.placeId;
            const placeData = req.body;
            try {
                const updatedPlace = yield this.placeService.updatePlace(place_id || 0, placeData);
                (0, respondeUtil_1.sendSuccess)(res, updatedPlace);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletePlace(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const place_id = req.placeId;
            try {
                yield this.placeService.deletePlace(place_id || 0);
                (0, respondeUtil_1.sendSuccess)(res, 'Lugar eliminado');
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AdminPlaceController;
