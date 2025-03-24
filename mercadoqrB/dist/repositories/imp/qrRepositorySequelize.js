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
const Qr_1 = require("../../models/Qr");
class QrRepositorySequelize {
    createQr(qr) {
        return __awaiter(this, void 0, void 0, function* () {
            const qrO = yield Qr_1.Qr.create(Object.assign({}, qr));
            return qrO.payment_id;
        });
    }
    getQrById(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield Qr_1.Qr.findByPk(qrId);
            if (!qr) {
                throw new errors_1.NotFoundError("QR not found");
            }
            return qr;
        });
    }
    updateQr(qr) {
        return __awaiter(this, void 0, void 0, function* () {
            const qrO = yield Qr_1.Qr.findByPk(qr.id);
            if (!qrO) {
                throw new errors_1.NotFoundError("QR not found");
            }
            qrO.update(Object.assign({}, qr));
            return;
        });
    }
    deleteQr(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield Qr_1.Qr.findByPk(qrId);
            if (!qr) {
                throw new errors_1.NotFoundError("QR not found");
            }
            qr.destroy();
            return;
        });
    }
}
exports.default = QrRepositorySequelize;
