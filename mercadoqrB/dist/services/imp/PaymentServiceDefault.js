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
const errors_1 = require("../../errors/errors");
const randomGenerator_1 = __importDefault(require("../../utils/randomGenerator"));
class PaymentServiceDefault {
    constructor(qrRepository) {
        this.qrRepository = qrRepository;
    }
    initialize(config) {
        // Do nothing.
    }
    processPayment(amount, currency, paymentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const newQrCode = (0, randomGenerator_1.default)([]);
            const { place_id, prod_id } = paymentDetails;
            const date = new Date().toISOString();
            const qr = { place_id, prod_id, expiration: date, code: newQrCode, id: '' };
            const qrid = yield this.qrRepository.createQr(qr);
            return { transactionId: qrid };
        });
    }
    refund(transactionId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new errors_1.PaymentError("Refund not implemented");
        });
    }
}
exports.default = PaymentServiceDefault;
