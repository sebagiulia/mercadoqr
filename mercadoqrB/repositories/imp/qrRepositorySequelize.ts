import QrRepository from "../qrRepository";
import QrType from "../../schemas/Qr";
import { NotFoundError } from "../../errors/errors";
import { Qr } from "../../models/Qr";

export default class QrRepositorySequelize implements QrRepository {

    async createQr(qr: QrType): Promise<string> {
        const qrO = await Qr.create({...qr})
        return qrO.payment_id;
    }

    async getQrById(qrId: string): Promise<QrType> {
        const qr = await Qr.findByPk(qrId);
        if (!qr) {
            throw new NotFoundError("QR not found");
        }
        return qr;
    }
    
    async updateQr(qr: Qr): Promise<void> {
        const qrO = await Qr.findByPk(qr.id);
        if (!qrO) {
            throw new NotFoundError("QR not found");
        }
        qrO.update({...qr});
        return;        
    }
    async deleteQr(qrId: string): Promise<void> {
        const qr = await Qr.findByPk(qrId);
        if (!qr) {
            throw new NotFoundError("QR not found");
        }
        qr.destroy();
        return;
    }
}