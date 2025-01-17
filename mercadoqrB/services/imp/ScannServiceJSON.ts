import ScannService from "../ScannService";
import Product from "../../schemas/Product";
import QrRepository from "../../repositories/qrRepository";
import PlaceRepository from "../../repositories/placeRepository";

export default class ScannServiceJSON implements ScannService {
    private qrRepository: QrRepository;
    private placeRepository: PlaceRepository;
    constructor(qrRepository: QrRepository, placeRepository: PlaceRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
    }

    async getProdByQrId(qrId: string): Promise<Product> {
        const qr = await this.qrRepository.getQrById(qrId);
        const prod = await this.placeRepository.getProduct(qr.place_id.toString(), qr.prod_id.toString());
        return prod
    }

    async consumeQrByQrId(qrId: string): Promise<any> {
        return this.qrRepository.deleteQr(qrId);
    }
}