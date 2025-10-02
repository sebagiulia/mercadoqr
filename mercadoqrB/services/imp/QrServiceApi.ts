import Qr from "../../schemas/Qr";
import QrService from "../QrService";
import QrRepository from "../../repositories/qrRepository";
import { NotFoundError } from "../../errors/errors";
import PlaceRepository from "../../repositories/placeRepository";
import QrResponse from "../../schemas/QrResponse";


export default class QrServiceImp implements QrService {
    private qrRepository: QrRepository;
    private placeRepository: PlaceRepository;
    constructor(qrRepository: QrRepository, placeRepository: PlaceRepository) {
        this.qrRepository = qrRepository;
        this.placeRepository = placeRepository;
    }

    async createQr(qr: Qr): Promise<Qr> {
        await this.qrRepository.createQr(qr);
        return qr;
    }

    async getQrById(qrId: string): Promise<QrResponse> {
        const qr = await this.qrRepository.getQrById(qrId);
        const place = await this.placeRepository.getPlaceById(qr.place_id);
        const product = await this.placeRepository.getProductById(qr.place_id, qr.prod_id);

        if(!qr || !place || !product) {
            throw new NotFoundError('Qr inválido');
        } else {
            const qrResponse = {
                id: qr.id,
                place_name: place.name,
                place_img: place.img,
                prod_name: product.name,
                prod_img: product.img,
                end_date: qr.end_date,
                start_date: qr.start_date,
                prod_cant: qr.prod_cant,
                prod_price: product.price,
            }
            return qrResponse
        }
    }
}