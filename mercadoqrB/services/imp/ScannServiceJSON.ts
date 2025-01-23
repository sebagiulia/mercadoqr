import ScannService from "../ScannService";
import Product from "../../schemas/Product";
import QrRepository from "../../repositories/qrRepository";
import PlaceRepository from "../../repositories/placeRepository";
import ScannRepository from "../../repositories/scannRepository";

export default class ScannServiceJSON implements ScannService {
    private qrRepository: QrRepository;
    private placeRepository: PlaceRepository;
    private scannRepository: ScannRepository;
    constructor(qrRepository: QrRepository, placeRepository: PlaceRepository, scannRepository: ScannRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
        this.scannRepository = scannRepository;
    }

    async getProdByQrId(qrId: string): Promise<Product> {
        const qr = await this.qrRepository.getQrById(qrId);
        const prod = await this.placeRepository.getProduct(qr.place_id.toString(), qr.prod_id.toString());
        return prod
    }

    async consumeQrByQrId(qrId: string): Promise<any> {
        return this.qrRepository.deleteQr(qrId);
    }

    async validate(localName: string, validationCode: string): Promise<Boolean> {
        console.log("Validando scanner en servicio");
        return this.scannRepository.validate(localName, validationCode);
    }
}