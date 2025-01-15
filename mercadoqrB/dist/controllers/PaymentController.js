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
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.processPayment = this.processPayment.bind(this);
        this.refund = this.refund.bind(this);
        console.log('Servicio de pagos activo');
    }
    processPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentDetails = req.body;
            try {
                const result = yield this.paymentService.processPayment(-1, 'ar', paymentDetails);
                (0, respondeUtil_1.sendSuccess)(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    refund(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // do nothing
        });
    }
}
exports.default = PaymentController;
