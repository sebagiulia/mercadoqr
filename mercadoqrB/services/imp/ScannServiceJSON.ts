import ScannService from "../ScannService";
import Product from "../../schemas/ProductResponse";
import QrRepository from "../../repositories/qrRepository";
import PlaceRepository from "../../repositories/placeRepository";
import ScannRepository from "../../repositories/scannRepository";
import Place from "../../schemas/Place";

export default class ScannServiceJSON implements ScannService {
    private qrRepository: QrRepository;
    private placeRepository: PlaceRepository;
    private scannRepository: ScannRepository;
    constructor(qrRepository: QrRepository, placeRepository: PlaceRepository, scannRepository: ScannRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
        this.scannRepository = scannRepository;
    }

    async consumeQrByQrId(qrId: string, place_id:number, scanner_id:number): Promise<any> {
        /* const qr = await this.qrRepository.getQrById(qrId);
        if (!qr) {
            throw new Error("QR no encontrado");
        } else if (qr.place_id !== place_id) {
            throw new Error("El QR no pertenece a este local");
        } else if (true) {
            // Aquí puedes agregar lógica adicional para verificar si el QR ya fue escaneado, si el scanner esta habilitado, etc, etc.
        } */
        return this.qrRepository.deleteQr(qrId);
    }

    async validate(localName: string, validationCode: string): Promise<Place> {
        return this.scannRepository.validate(localName, validationCode);
    }
}