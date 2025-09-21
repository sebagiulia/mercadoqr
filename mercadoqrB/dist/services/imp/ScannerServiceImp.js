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
class ScannerServiceImp {
    constructor(scannerRepository) {
        console.log("✅ Servicio de Scanner activo");
        this.scannerRepository = scannerRepository;
    }
    getScanners(place_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scannerRepository.getScanners(place_id);
        });
    }
    addScanner(place_id, sc) {
        return __awaiter(this, void 0, void 0, function* () {
            const newScanner = Object.assign(Object.assign({}, sc), { place_id });
            this.scannerRepository.addScanner(place_id, newScanner);
            return newScanner;
        });
    }
    removeScanner(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const scanner = yield this.scannerRepository.removeScanner(id);
        });
    }
    updateScanner(id, sc) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedScanner = yield this.scannerRepository.updateScanner(id, sc);
            return updatedScanner;
        });
    }
}
exports.default = ScannerServiceImp;
