import ScannService from "../ScannService";
import Product from "../../schemas/ProductResponse";
import QrRepository from "../../repositories/qrRepository";
import PlaceRepository from "../../repositories/placeRepository";
import ScannRepository from "../../repositories/scannRepository";
import Place from "../../schemas/Place";
import { NotFoundError, ScannError } from "../../errors/errors";
import QrResponse from "../../schemas/QrResponse";

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
        const qr = await this.qrRepository.getQrById(qrId);
        if (!qr) {
            throw new NotFoundError("QR no encontrado");
        } 
        return this.qrRepository.deleteQr(qrId);
    }

    async getQRData(qr_code: any, place_id:number, scanner_id:number): Promise<QrResponse> {
        const place: Place | null = await this.placeRepository.getPlaceById(place_id);
        if (!place) {
            throw new NotFoundError("Local no encontrado");
        }
        // Aquí puedes agregar lógica adicional para verificar si el scanner esta habilitado, etc, etc.
        const qr = await this.qrRepository.getQrById(qr_code);
        if(!qr) {
            throw new ScannError("QR no encontrado.", 1)
        } else if (/*qr consumido*/ false) {
            throw new ScannError("El QR ya fue consumido.", 2);
        } else if(place_id !== qr.place_id) {
            throw new ScannError("El QR no pertenece a este local", 3);
        } else if (/*qr expirado*/ false) {
            throw new ScannError("El QR ha expirado.", 4);
        } else if (/*scanner sin nivel*/ false) {
            throw new ScannError("No puedes escanear este QR en tu nivel.", 5);
        } else {
            // Si todo está bien, registrar el escaneo
            /* await this.scannRepository.logScann({
                qr_id: qr_code,
                place_id: place_id,
                scanner_id: scanner_id,
                scanned_at: new Date()
                }); */
                
                const prod = await this.placeRepository.getProductById(place_id, qr.prod_id);
                if(prod) {
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
            } else {
                throw new ScannError("El producto ya no está disponible.", 6);
            }
        }
    }
}