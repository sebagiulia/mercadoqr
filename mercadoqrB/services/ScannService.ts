import Place from "../schemas/Place";
import Product from "../schemas/ProductResponse";

export default interface ScannService {
    consumeQrByQrId(qrId: string): Promise<any>;
    validate(localName: string, validationCode: string): Promise<Place>;
}