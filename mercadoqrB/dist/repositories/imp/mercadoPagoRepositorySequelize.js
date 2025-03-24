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
const Payment_1 = require("../../models/Payment");
class MercadoPagoRepositorySequelize {
    createNewPayment(place_id, prod_id, prod_cant) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Payment_1.Payment.create({ place_id, prod_id, prod_cant });
            return result.id;
        });
    }
    saveDataPayment(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            Payment_1.Payment.update(payment, { where: { id: payment.id } });
        });
    }
    getDataPayment(payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield Payment_1.Payment.findByPk(payment_id);
            if (payment) {
                return payment;
            }
            throw new errors_1.NotFoundError('No se encontró el pago');
        });
    }
    removeDataPayment(payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield Payment_1.Payment.findByPk(payment_id);
            if (payment) {
                payment.destroy();
                return;
            }
            throw new errors_1.NotFoundError('No se encontró el pago');
        });
    }
    updateStatus(payment_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield Payment_1.Payment.findByPk(payment_id);
            if (payment) {
                payment.status = status;
                payment.save();
                return;
            }
            throw new errors_1.NotFoundError('No se encontró el pago');
        });
    }
}
exports.default = MercadoPagoRepositorySequelize;
