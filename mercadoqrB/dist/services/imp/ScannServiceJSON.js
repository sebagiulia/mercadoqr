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
    consumeQrByQrId(qrId, place_id, scanner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const qr = await this.qrRepository.getQrById(qrId);
            if (!qr) {
                throw new Error("QR no encontrado");
            } else if (qr.place_id !== place_id) {
                throw new Error("El QR no pertenece a este local");
            } else if (true) {
                // Aquí puedes agregar lógica adicional para verificar si el QR ya fue escaneado, si el scanner esta habilitado, etc, etc.
            } */
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
