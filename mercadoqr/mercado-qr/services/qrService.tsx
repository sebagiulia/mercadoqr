import ErrorType from 'errors/errorType';
import Qr from '../models/qr';
import { apiClient } from 'utils/apiClient';
import endpoints from 'utils/endpoints';

export default class QrService  {
    static async getQrByCode(code: string): Promise<ErrorType<Qr>> {
        return apiClient(endpoints.qr.qrByCode(code));
    }
    static async getQrById(id: string): Promise<ErrorType<Qr>> {
        return apiClient(endpoints.qr.qrById(id));
    }
}