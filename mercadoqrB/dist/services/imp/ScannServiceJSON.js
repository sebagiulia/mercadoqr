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
class ScannServiceJSON {
    constructor(qrRepository, placeRepository, scannRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
        this.scannRepository = scannRepository;
    }
    consumeQrByQrId(qrId, place_id, scanner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = yield this.qrRepository.getQrById(qrId);
            if (!qr) {
                throw new errors_1.NotFoundError("QR no encontrado");
            }
            return this.qrRepository.deleteQr(qrId);
        });
    }
    getQRData(qr_code, place_id, scanner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const place = yield this.placeRepository.getPlaceById(place_id);
            if (!place) {
                throw new errors_1.NotFoundError("Local no encontrado");
            }
            // Aquí puedes agregar lógica adicional para verificar si el scanner esta habilitado, etc, etc.
            const qr = yield this.qrRepository.getQrById(qr_code);
            if (!qr) {
                throw new errors_1.ScannError("QR no encontrado.", 1);
            }
            else if ( /*qr consumido*/false) {
                throw new errors_1.ScannError("El QR ya fue consumido.", 2);
            }
            else if (place_id !== qr.place_id) {
                throw new errors_1.ScannError("El QR no pertenece a este local", 3);
            }
            else if ( /*qr expirado*/false) {
                throw new errors_1.ScannError("El QR ha expirado.", 4);
            }
            else if ( /*scanner sin nivel*/false) {
                throw new errors_1.ScannError("No puedes escanear este QR en tu nivel.", 5);
            }
            else {
                // Si todo está bien, registrar el escaneo
                /* await this.scannRepository.logScann({
                    qr_id: qr_code,
                    place_id: place_id,
                    scanner_id: scanner_id,
                    scanned_at: new Date()
                    }); */
                const prod = yield this.placeRepository.getProductById(place_id, qr.prod_id);
                if (prod) {
                    return {
                        id: qr.id.toString(),
                        prod_cant: qr.prod_cant,
                        prod_name: prod.name,
                        prod_img: prod.img,
                        place_name: place.name,
                        place_img: place.img,
                        start_date: qr.start_date,
                        end_date: qr.end_date,
                        prod_price: prod.price
                    };
                }
                else {
                    throw new errors_1.ScannError("El producto ya no está disponible.", 6);
                }
            }
        });
    }
}
exports.default = ScannServiceJSON;
