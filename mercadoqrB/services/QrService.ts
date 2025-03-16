import Qr from "../schemas/Qr";

export default interface QrService {
    createQr(qr:Qr): Promise<Qr>;
    getQrByCode(qrCode: string): Promise<Qr>;
    getQrById(qrId: string): Promise<Qr>;
}
