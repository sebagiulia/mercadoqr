import Qr from "../schemas/Qr";
import QrResponse from "../schemas/QrResponse";

export default interface QrService {
    createQr(qr:Qr): Promise<Qr>;
    getQrById(qrId: string): Promise<QrResponse>;
}
