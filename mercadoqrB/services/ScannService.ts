import QrResponse from "../schemas/QrResponse";
export default interface ScannService {
    consumeQrByQrId(qrId: string, place_id:number, scanner_id: number): Promise<any>;
    getQRData(qr_code: any, place_id:number, scanner_id: number): Promise<QrResponse>;
}