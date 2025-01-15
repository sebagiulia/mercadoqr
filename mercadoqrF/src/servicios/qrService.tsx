import Qr from '../models/qr';

export default interface qrService {
    getQrByCode(code: string): Promise<Qr | null> ;
}