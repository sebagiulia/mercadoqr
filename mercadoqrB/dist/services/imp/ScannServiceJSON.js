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
    constructor(qrRepository, placeRepository, scannRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
        this.scannRepository = scannRepository;
    }
    getProdByQrCode(qrCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrById(qrCode);
            const place = yield this.placeRepository.getPlaceById(qr.place_id);
            const prod = yield this.placeRepository.getProductById(place.id, qr.prod_id);
            return prod;
        });
    }
    getProdByQrId(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrById(qrId);
            const place = yield this.placeRepository.getPlace(qr.place_id.toString());
            const prod = yield this.placeRepository.getProduct(place.name, qr.prod_id.toString());
            return prod;
        });
    }
    consumeQrByQrCode(qrCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrById(qrCode);
            return this.qrRepository.deleteQr(qr.id);
        });
    }
    consumeQrByQrId(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.qrRepository.deleteQr(qrId);
        });
    }
    validate(localName, validationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scannRepository.validate(localName, validationCode);
        });
    }
}
exports.default = ScannServiceJSON;
