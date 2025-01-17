import Qr from "../../schemas/Qr";
import QrService from "../QrService";
import QrRepository from "../../repositories/qrRepository";
import { NotFoundError } from "../../errors/errors";


export default class QrServiceImp implements QrService {
    private qrRepository: QrRepository;
    constructor(qrRepository: QrRepository) {
        this.qrRepository = qrRepository;
    }

    async getQrByCode(qrCode: string): Promise<Qr> {
        const qr = await this.qrRepository.getQrByCode(qrCode);
        if(!qr) {
            throw new NotFoundError('Qr not found');
        } else {
            return qr
        }
    }

    async getQrById(qrId: string): Promise<Qr> {
        const qr = await this.qrRepository.getQrById(qrId);
        if(!qr) {
            throw new NotFoundError('Qr not found');
        } else {
            return qr
        }
    }
}