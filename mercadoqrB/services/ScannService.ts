import Product from "../schemas/Product";

export default interface ScannService {
    getProdByQrId(qrId: string): Promise<Product>;
    consumeQrByQrId(qrId: string): Promise<any>;
    validate(localName: string, validationCode: string): Promise<Boolean>;
}