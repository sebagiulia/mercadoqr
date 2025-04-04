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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const errors_1 = require("../../errors/errors");
const filePath = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/qrs.json');
// Función para agregar datos al JSON
function addQr(newQr) {
    const qrsString = fs.readFileSync(filePath, 'utf-8');
    const newQrs = JSON.parse(qrsString);
    newQrs.push(newQr);
    fs.writeFileSync(filePath, JSON.stringify(newQrs, null, 2));
}
class QrRepositoryJSON {
    constructor() {
        const qrsString = fs.readFileSync(filePath, 'utf-8');
        this.qrs = JSON.parse(qrsString);
    }
    createQr(qr) {
        return __awaiter(this, void 0, void 0, function* () {
            addQr(qr);
            return qr.id;
        });
    }
    getQrById(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qrsString = fs.readFileSync(filePath, 'utf-8');
            this.qrs = JSON.parse(qrsString);
            const qr = this.qrs.find((qr) => qr.id === qrId);
            if (!qr) {
                throw new errors_1.NotFoundError("QR not found");
            }
            else {
                return qr;
            }
        });
    }
    updateQr(qr) {
        return __awaiter(this, void 0, void 0, function* () {
            const qrsString = fs.readFileSync(filePath, 'utf-8');
            this.qrs = JSON.parse(qrsString);
            const qrIndex = this.qrs.findIndex((qrItem) => qrItem.id === qr.id);
            if (qrIndex === -1) {
                throw new errors_1.NotFoundError("QR not found");
            }
            this.qrs[qrIndex] = qr;
            fs.writeFileSync(filePath, JSON.stringify(this.qrs, null, 2));
        });
    }
    deleteQr(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qrsString = fs.readFileSync(filePath, 'utf-8');
            this.qrs = JSON.parse(qrsString);
            const qrIndex = this.qrs.findIndex((qr) => qr.id === qrId);
            if (qrIndex === -1) {
                throw new errors_1.NotFoundError("QR not found");
            }
            this.qrs.splice(qrIndex, 1);
            fs.writeFileSync(filePath, JSON.stringify(this.qrs, null, 2));
        });
    }
}
exports.default = QrRepositoryJSON;
