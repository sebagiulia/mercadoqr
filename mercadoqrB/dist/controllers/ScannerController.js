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
class ScannerController {
    constructor(scannerService) {
        this.scannerService = scannerService;
        console.log("✅ Servicio de Scanner activo");
        this.getScanners = this.getScanners.bind(this);
        this.addScanner = this.addScanner.bind(this);
        this.removeScanner = this.removeScanner.bind(this);
        this.updateScanner = this.updateScanner.bind(this);
    }
    getScanners(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { placeId } = req;
            try {
                const scanners = yield this.scannerService.getScanners(placeId || 0);
                (0, respondeUtil_1.sendSuccess)(res, scanners);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addScanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { placeId } = req;
            const scanner = req.body;
            try {
                const newScanner = yield this.scannerService.addScanner(placeId || 0, scanner);
                (0, respondeUtil_1.sendSuccess)(res, newScanner);
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeScanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.scannerId;
            try {
                const result = yield this.scannerService.removeScanner(id);
                (0, respondeUtil_1.sendSuccess)(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateScanner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { placeId } = req;
            const scanner = req.body;
            try {
                const updatedScanner = yield this.scannerService.updateScanner(placeId || 0, scanner);
                (0, respondeUtil_1.sendSuccess)(res, updatedScanner);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ScannerController;
