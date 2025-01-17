import Qr from '../models/qr';
import qrService from './qrService';
import { apiClient } from 'utils/apiClient';
import endpoints from 'utils/endpoints';

export default class QrServiceApiImp implements qrService {
    async getQrByCode(code: string): Promise<Qr | null> {
        return apiClient(endpoints.qr.qrByCode(code));
    }
    async getQrById(id: string): Promise<Qr | null> {
        return apiClient(endpoints.qr.qrById(id));
    }
}