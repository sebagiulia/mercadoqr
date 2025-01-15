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
class PaymentServiceJSON {
    initialize(config) {
        // Do nothing.
    }
    processPayment(amount, currency, paymentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            if (paymentDetails.name === "test") {
                return { transactionId: "123456" };
            }
            if (amount > 0) {
                throw new errors_1.PaymentError("Testing error");
            }
            throw new errors_1.PaymentError("Amount error");
        });
    }
    refund(transactionId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return { refundId: "654321" };
        });
    }
}
exports.default = PaymentServiceJSON;
