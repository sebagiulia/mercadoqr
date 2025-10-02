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
class ScannController {
    constructor(scannService) {
        this.consumeQrByQrId = this.consumeQrByQrId.bind(this);
        this.getQRData = this.getQRData.bind(this);
        this.scannService = scannService;
        console.log("✅ Servicio de Scann activo");
    }
    consumeQrByQrId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { qr_code } = req.body;
            const { placeId, scannerId } = req;
            // TEST //
            if (qr_code === "ESTOesUNtestDEprueba") {
                (0, respondeUtil_1.sendSuccess)(res, { message: "QR de prueba consumido correctamente" });
                return;
            }
            try {
                const prod = yield this.scannService.consumeQrByQrId(qr_code, placeId || 0, scannerId || 0);
                (0, respondeUtil_1.sendSuccess)(res, prod);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getQRData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { qr_code } = req.body;
            const { placeId, scannerId } = req;
            try {
                const prod = yield this.scannService.getQRData(qr_code, placeId || 0, scannerId || 0);
                (0, respondeUtil_1.sendSuccess)(res, prod);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ScannController;
