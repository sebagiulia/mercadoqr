import Qr from '../models/qr';

export default interface QrService {
    getQrByCode(code: string): Promise<Qr | null> ;
    getQrById(id: string): Promise<Qr | null> ;
}