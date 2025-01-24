import Place from "../schemas/Place";
import Product from "../schemas/Product";

export default interface ScannService {
    getProdByQrCode(qrCode: string): Promise<Product>;
    getProdByQrId(qrId: string): Promise<Product>;
    consumeQrByQrCode(qrCode: string): Promise<any>;
    consumeQrByQrId(qrId: string): Promise<any>;
    validate(localName: string, validationCode: string): Promise<Place>;
}