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
class QrServiceImp {
    constructor(qrRepository) {
        this.qrRepository = qrRepository;
    }
    getQrByCode(qrCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrByCode(qrCode);
            if (!qr) {
                throw new errors_1.NotFoundError('Qr not found');
            }
            else {
                return qr;
            }
        });
    }
    getQrById(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrById(qrId);
            if (!qr) {
                throw new errors_1.NotFoundError('Qr not found');
            }
            else {
                return qr;
            }
        });
    }
}
exports.default = QrServiceImp;
