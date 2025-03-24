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
    constructor(qrRepository, placeRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
    }
    createQr(qr) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.qrRepository.createQr(qr);
            return qr;
        });
    }
    getQrById(qrId) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrById(qrId);
            const place = yield this.placeRepository.getPlaceById(qr.place_id);
            const product = yield this.placeRepository.getProductById(qr.place_id, qr.prod_id);
            if (!qr || !place || !product) {
                throw new errors_1.NotFoundError('Qr not found');
            }
            else {
                return ({
                    id: qr.id,
                    place_name: place.name,
                    place_img: place.img,
                    prod_name: product.name,
                    prod_img: product.img,
                    until_date: qr.until_date,
                    from_date: qr.from_date,
                    prod_cant: qr.prod_cant,
                });
            }
        });
    }
}
exports.default = QrServiceImp;
