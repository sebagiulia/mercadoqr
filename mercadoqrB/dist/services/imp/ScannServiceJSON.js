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
class ScannServiceJSON {
    constructor(qrRepository, placeRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
    }
    getProdByQrId(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrById(qrId);
            const prod = yield this.placeRepository.getProduct(qr.place_id.toString(), qr.prod_id.toString());
            return prod;
        });
    }
    consumeQrByQrId(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.qrRepository.deleteQr(qrId);
        });
    }
}
exports.default = ScannServiceJSON;
