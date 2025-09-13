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
    constructor(PlaceRepository, mercadoPagoRepository, NotifierService, QrService) {
        this.QrService = QrService;
        this.NotifierService = NotifierService;
        this.PlaceRepository = PlaceRepository;
        this.mercadoPagoRepository = mercadoPagoRepository;
        this.getInitPoint = this.getInitPoint.bind(this);
        this.notifyPayment = this.notifyPayment.bind(this);
        this.processMPNotification = this.processMPNotification.bind(this);
    }
    getInitPoint(place_id, prod_id, prod_cant, email, telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield this.PlaceRepository.getPlaceById(Number(place_id));
            const product = yield this.PlaceRepository.getProductById(Number(place_id), Number(prod_id));
            if (email === "test@test.com" && telefono === "0123456789") {
                return process.env.FRONTEND_URL + '/compra/' + 'ESTOesUNtestDEprueba';
            }
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: place.mpToken });
            const payment_id = yield this.mercadoPagoRepository.createNewPayment(place_id, prod_id, prod_cant);
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
                    back_urls: { success: process.env.FRONTEND_URL + '/compra/' + payment_id,
                        failure: process.env.FRONTEND_URL + '/compra/failure' },
                    notification_url: process.env.BACKEND_URL_PUBLIC + '/api/mp/notify/' + payment_id,
                    binary_mode: true
                }
            });
            if (preferenceConcrete.init_point && preferenceConcrete.id) {
                const paymentRecord = { id: payment_id,
                    preference_id: preferenceConcrete.id,
                    email,
                    telefono,
                    place_id,
                    prod_id,
                    prod_cant,
                    status: "pending" };
                yield this.mercadoPagoRepository.saveDataPayment(paymentRecord);
                return preferenceConcrete.init_point;
            }
            throw new errors_1.MercadoPagoError('Error de preferencia');
        });
    }
    notifyPayment(payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.mercadoPagoRepository.getDataPayment(payment_id);
            if (payment.status === "approved")
                return;
            const place = yield this.PlaceRepository.getPlaceById(payment.place_id);
            const product = yield this.PlaceRepository.getProductById(payment.place_id, payment.prod_id);
            const qr = { id: payment_id,
                place_id: payment.place_id,
                prod_id: payment.prod_id,
                prod_cant: payment.prod_cant,
                start_date: product.start_date,
                end_date: product.end_date };
            yield this.QrService.createQr(qr);
            yield this.mercadoPagoRepository.updateStatus(payment_id, "approved");
            yield this.NotifierService.notifyByEmail(payment.email, payment_id);
            yield this.NotifierService.notifyByWhatsapp(payment.telefono, payment_id);
            console.log("Pago confirmado: Sucursal:" + place.name + "| Producto[" + payment.prod_cant + "]: " + product.name + ".");
            //await this.mercadoPagoRepository.removeDataPayment(payment_id);
        });
    }
    processMPNotification(payment_id, topic, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { place_id, status } = yield this.mercadoPagoRepository.getDataPayment(payment_id);
            if (!place_id)
                throw new errors_1.MercadoPagoError("No se encontro el pago");
            if (status === "approved")
                return;
            const { mpToken } = yield this.PlaceRepository.getPlaceById(place_id);
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: mpToken });
            const payment = new mercadopago_1.Payment(client);
            const merchantOrders = new mercadopago_1.MerchantOrder(client);
            try {
                let merchantOrder = null;
                if (topic === "payment") {
                    const payment_response = yield payment.get({ id });
                    if (payment_response && payment_response.order) {
                        merchantOrder = yield merchantOrders.get({ merchantOrderId: payment_response.order.id });
                    }
                }
                else if (topic === "merchant_order") {
                    merchantOrder = yield merchantOrders.get({ merchantOrderId: id });
                }
                if (!merchantOrder || !merchantOrder.payments) {
                    return;
                }
                // Calcular el monto total pagado
                let paidAmount = 0;
                merchantOrder.payments.forEach(payment => {
                    if (payment.status === 'approved' && payment.transaction_amount) {
                        paidAmount += payment.transaction_amount;
                    }
                });
                // Verificar si se pagó el total del pedido
                if (merchantOrder.total_amount && paidAmount >= merchantOrder.total_amount) {
                    yield this.notifyPayment(payment_id);
                }
            }
            catch (error) {
                console.error("Error handling webhook:", error);
                throw new errors_1.MercadoPagoError("Error handling webhook");
            }
        });
    }
}
exports.default = MercadoPagoServiceDefault;
