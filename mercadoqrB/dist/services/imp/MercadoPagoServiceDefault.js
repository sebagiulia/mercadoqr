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
const serverData_1 = __importDefault(require("../../serverData"));
const errors_1 = require("../../errors/errors");
const mercadopago_1 = require("mercadopago");
class MercadoPagoServiceDefault {
    constructor(PlaceRepository, mercadoPagoRepository, NotifierService, QrService) {
        this.QrService = QrService;
        this.NotifierService = NotifierService;
        this.PlaceRepository = PlaceRepository;
        this.mercadoPagoRepository = mercadoPagoRepository;
        this.getInitPoint = this.getInitPoint.bind(this);
    }
    getInitPoint(place_id, prod_id, prod_cant, email, telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield this.PlaceRepository.getPlaceById(Number(place_id));
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: place.credential });
            const product = yield this.PlaceRepository.getProductById(Number(place_id), Number(prod_id));
            const payment_id = yield this.mercadoPagoRepository.createNewPayment();
            const preference = new mercadopago_1.Preference(client);
            const preferenceConcrete = yield preference.create({
                body: {
                    items: [
                        {
                            title: product.name,
                            quantity: prod_cant,
                            unit_price: product.price,
                            id: product.id.toString(),
                            picture_url: product.img
                        }
                    ],
                    back_urls: { success: serverData_1.default.frontUrl + '/compra/:' + payment_id,
                        failure: serverData_1.default.frontUrl + '/compra/failure',
                        pending: serverData_1.default.frontUrl + '/compra/pending' },
                    notification_url: serverData_1.default.url + '/api/mp/notify'
                }
            });
            if (preferenceConcrete.init_point && preferenceConcrete.id) {
                const paymentRecord = { payment_id, preference_id: preferenceConcrete.id, email, telefono, place_id, prod_id, prod_cant };
                yield this.mercadoPagoRepository.saveDataPayment(paymentRecord);
                return preferenceConcrete.init_point;
            }
            throw new errors_1.MercadoPagoError('Error de preferencia');
        });
    }
    notifyPayment(payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.mercadoPagoRepository.getDataPayment(payment_id);
            const product = yield this.PlaceRepository.getProductById(payment.place_id, payment.prod_id);
            const qr = { id: payment_id,
                code: payment_id,
                place_id: payment.place_id,
                prod_id: payment.prod_id,
                prod_cant: payment.prod_cant,
                expiration: product.expiration };
            yield this.QrService.createQr(qr);
            yield this.NotifierService.notifyByEmail(payment.email, payment_id);
            yield this.NotifierService.notifyByWhatsapp(payment.telefono, payment_id);
            yield this.mercadoPagoRepository.removeDataPayment(payment_id);
        });
    }
}
exports.default = MercadoPagoServiceDefault;
