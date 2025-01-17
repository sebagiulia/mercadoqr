import Product from "../schemas/Product";

export default interface ScannService {
    getProdByQrId(qrId: string): Promise<Product>;
    consumeQrByQrId(qrId: string): Promise<any>;
}