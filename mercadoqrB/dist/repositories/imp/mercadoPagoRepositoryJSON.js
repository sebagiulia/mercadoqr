"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const errors_1 = require("../../errors/errors");
const filePath = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/payments.json');
// Función para agregar datos al JSON
function writePayment(payment) {
    const paymentsString = fs.readFileSync(filePath, 'utf-8');
    const payments = JSON.parse(paymentsString);
    if (!payments.find((paymentItem) => paymentItem.id === payment.id)) {
        payments.push(payment);
    }
    else {
        payments.map((paymentItem) => {
            if (paymentItem.id === payment.id) {
                Object.assign(paymentItem, payment);
            }
        });
    }
    fs.writeFileSync(filePath, JSON.stringify(payments, null, 2));
}
class MercadoPagoRepositoryJSON {
    constructor() {
        const paymentsString = fs.readFileSync(filePath, 'utf-8');
        this.payments = JSON.parse(paymentsString);
    }
    createNewPayment(place_id, prod_id, prod_cant) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, crypto_1.randomUUID)().toString();
            return id;
        });
    }
    saveDataPayment(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            writePayment(payment);
        });
    }
    getDataPayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentsString = fs.readFileSync(filePath, 'utf-8');
            this.payments = JSON.parse(paymentsString);
            const payment = this.payments.find((payment) => payment.id === id);
            if (payment) {
                return payment;
            }
            throw new errors_1.NotFoundError('No se encontró el pago');
        });
    }
    removeDataPayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentsString = fs.readFileSync(filePath, 'utf-8');
            this.payments = JSON.parse(paymentsString);
            const payment = this.payments.find((payment) => payment.id === id);
            if (payment) {
                const index = this.payments.indexOf(payment);
                this.payments.splice(index, 1);
                fs.writeFileSync(filePath, JSON.stringify(this.payments, null, 2));
                return;
            }
            throw new errors_1.NotFoundError('No se encontró el pago');
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentsString = fs.readFileSync(filePath, 'utf-8');
            this.payments = JSON.parse(paymentsString);
            const payment = this.payments.find((payment) => payment.id === id);
            if (payment) {
                payment.status = status;
                writePayment(payment);
                return;
            }
            throw new errors_1.NotFoundError('No se encontró el pago');
        });
    }
}
exports.default = MercadoPagoRepositoryJSON;
