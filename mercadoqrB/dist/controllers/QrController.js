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
class QrController {
    constructor(qrService) {
        this.qrService = qrService;
        this.getQrByCode = this.getQrByCode.bind(this);
        this.getQrById = this.getQrById.bind(this);
        console.log('Servicio de qr activo');
    }
    getQrByCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('solicitud getQrByCode');
            const qrCode = req.params.qr;
            try {
                const qr = yield this.qrService.getQrByCode(qrCode);
                (0, respondeUtil_1.sendSuccess)(res, qr);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getQrById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('solicitud getQrById');
            const qrId = req.params.qr;
            try {
                const qr = yield this.qrService.getQrById(qrId);
                (0, respondeUtil_1.sendSuccess)(res, qr);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = QrController;
