import Qr from "../schemas/Qr";

export default interface QrService {
    getQrByCode(qrCode: string): Promise<Qr>;
    getQrById(qrId: string): Promise<Qr>;
}
