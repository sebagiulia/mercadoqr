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

    async consumeQrByQrId(qrId: string): Promise<any> {
        return this.qrRepository.deleteQr(qrId);
    }

    async validate(localName: string, validationCode: string): Promise<Place> {
        return this.scannRepository.validate(localName, validationCode);
    }
}