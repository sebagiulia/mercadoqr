import Qr from "../schemas/Qr";

export default interface QrRepository {
    createQr(qr: Qr): Promise<string>;
    getQrById(qrId: string): Promise<Qr | null>;
    getQrByCode(qrCode: string): Promise<Qr | null>;
    updateQr(qr: Qr): Promise<void>;
    deleteQr(qrId: string): Promise<void>;
}