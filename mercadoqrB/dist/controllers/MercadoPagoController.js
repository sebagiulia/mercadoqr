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
class MercadoPagoController {
    constructor(mercadoPagoService, placeService) {
        this.mercadoPagoService = mercadoPagoService;
        this.placeService = placeService;
        this.getInitPoint = this.getInitPoint.bind(this);
        this.processMPNotification = this.processMPNotification.bind(this);
        console.log('Servicio MercadoPago activo');
    }
    getInitPoint(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { envio_email, envio_telefono, prod_id, prod_cant, place_id } = req.body;
            try {
                const preference = yield this.mercadoPagoService.getInitPoint(place_id, prod_id, prod_cant, envio_email, envio_telefono);
                (0, respondeUtil_1.sendSuccess)(res, preference);
            }
            catch (error) {
                next(error);
            }
        });
    }
    processMPNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payment_id } = req.params;
            try {
                const { topic, id } = req.query;
                yield this.mercadoPagoService.processMPNotification(payment_id, topic, id);
                (0, respondeUtil_1.sendSuccess)(res);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = MercadoPagoController;
