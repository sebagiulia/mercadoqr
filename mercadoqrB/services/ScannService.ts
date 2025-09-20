import Place from "../schemas/Place";
import Product from "../schemas/ProductResponse";

export default interface ScannService {
    consumeQrByQrId(qrId: string, place_id:number, scanner_id: number): Promise<any>;
    validate(localName: string, validationCode: string): Promise<Place>;
}