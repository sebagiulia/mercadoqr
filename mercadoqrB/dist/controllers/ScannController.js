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
        this.getProdByQrId = this.getProdByQrId.bind(this);
        this.getProdByQrCode = this.getProdByQrCode.bind(this);
        this.consumeQrByQrCode = this.consumeQrByQrCode.bind(this);
        this.consumeQrByQrId = this.consumeQrByQrId.bind(this);
        this.validateScanner = this.validateScanner.bind(this);
        this.scannService = scannService;
        console.log("✅ Servicio de Scann activo");
    }
    getProdByQrCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("solicitud getProdByQrCode");
            const { code } = req.body;
            try {
                const prod = yield this.scannService.getProdByQrCode(code);
                (0, respondeUtil_1.sendSuccess)(res, prod);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProdByQrId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("solicitud getProdByQrId");
            const qrId = req.params.id;
            try {
                const prod = yield this.scannService.getProdByQrId(qrId);
                (0, respondeUtil_1.sendSuccess)(res, prod);
            }
            catch (error) {
                next(error);
            }
        });
    }
    consumeQrByQrCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("solicitud consumeQrByQrCode");
            const { qrcode } = req.body;
            try {
                const prod = yield this.scannService.consumeQrByQrCode(qrcode);
                (0, respondeUtil_1.sendSuccess)(res, prod);
            }
            catch (error) {
                next(error);
            }
        });
    }
    consumeQrByQrId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("solicitud consumeQrByQrId");
            const qrId = req.params.id;
            try {
                const prod = yield this.scannService.consumeQrByQrId(qrId);
                (0, respondeUtil_1.sendSuccess)(res, prod);
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateScanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("solicitud validateScanner");
            const { localName, validationCode } = req.body;
            try {
                const isValid = yield this.scannService.validate(localName, validationCode);
                (0, respondeUtil_1.sendSuccess)(res, isValid);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ScannController;
