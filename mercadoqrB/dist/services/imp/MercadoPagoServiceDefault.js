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
const mercadopago_1 = require("mercadopago");
class MercadoPagoServiceDefault {
    constructor(PlaceRepository) {
        this.PlaceRepository = PlaceRepository;
        this.getInitPoint = this.getInitPoint.bind(this);
    }
    getInitPoint(place_id, prod_id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield this.PlaceRepository.getPlaceById(Number(place_id));
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: place.credential });
            const product = yield this.PlaceRepository.getProductById(Number(place_id), Number(prod_id));
            const preference = new mercadopago_1.Preference(client);
            const preferenceConcrete = yield preference.create({
                body: {
                    items: [
                        {
                            title: product.name,
                            quantity: quantity,
                            unit_price: product.price,
                            id: product.id.toString(),
                            picture_url: product.img
                        }
                    ],
                    back_urls: { success: 'http://localhost:3000/success',
                        failure: 'http://localhost:3000/failure',
                        pending: 'http://localhost:3000/pending' },
                    notification_url: 'http://localhost:1024/api/mp/notification_url',
                }
            });
            if (preferenceConcrete.init_point) {
                return preferenceConcrete.init_point;
            }
            throw new errors_1.MercadoPagoError('Error de preferencia');
        });
    }
}
exports.default = MercadoPagoServiceDefault;
