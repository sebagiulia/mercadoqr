import qrs from '@/data/qr.json';
import Qr from '@/models/qr';
import qrService from '@/servicios/qrService';

export default class qrServiceJSONImp implements qrService {
    async getQrByCode(code: string): Promise<Qr | null> {
        const qr = qrs.find(qr => qr.code === code);
        return qr !== undefined ? qr : null;
    }
}