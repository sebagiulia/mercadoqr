import ScannService from "../ScannService";
import Product from "../../schemas/Product";
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

    async getProdByQrCode(qrCode: string): Promise<Product> {
        const qr = await this.qrRepository.getQrByCode(qrCode);
        const place = await this.placeRepository.getPlaceById(qr.place_id);
        const prod = await this.placeRepository.getProductById(place.id, qr.prod_id);
        return prod
    }

    async getProdByQrId(qrId: string): Promise<Product> {
        const qr = await this.qrRepository.getQrById(qrId);
        const place = await this.placeRepository.getPlace(qr.place_id.toString());
        const prod = await this.placeRepository.getProduct(place.name, qr.prod_id.toString());
        return prod
    }

    async consumeQrByQrCode(qrCode: string): Promise<any> {
        const qr = await this.qrRepository.getQrByCode(qrCode);
        return this.qrRepository.deleteQr(qr.id);
    }

    async consumeQrByQrId(qrId: string): Promise<any> {
        return this.qrRepository.deleteQr(qrId);
    }

    async validate(localName: string, validationCode: string): Promise<Place> {
        return this.scannRepository.validate(localName, validationCode);
    }
}