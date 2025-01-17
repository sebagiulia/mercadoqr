import QrRepository from "../qrRepository";
import Qr from "../../schemas/Qr";
import qrsData from '../../data/qrs.json';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from "crypto";
import { NotFoundError } from "../../errors/errors";

const filePath = path.join("/home/seba/Escritorio/mvp-mercadoQR/mercadoqrB", '/data/qrs.json');

// Función para agregar datos al JSON
function addQr(newQr: Qr): void {
    const newQrs = qrsData as Qr[];
    newQrs.push(newQr);
    fs.writeFileSync(filePath, JSON.stringify(newQrs, null, 2));
}


export default class QrRepositoryJSON implements QrRepository {

    private qrs: Qr[] = qrsData;
    async createQr(qr: Qr): Promise<string> {
        const uid = randomUUID();
        qr.id = uid
        addQr(qr);
        return uid
    }
    async getQrById(qrId: string): Promise<Qr> {
        const qr = this.qrs.find((qr:Qr) => qr.id === qrId);
        if (!qr) {
            throw new NotFoundError("QR not found");
        } else {
            return qr 
        }
    }
    async getQrByCode(qrCode: string): Promise<Qr> {
        const qr = this.qrs.find((qr:Qr) => qr.code === qrCode);
        if (!qr) {
            throw new NotFoundError("QR not found");
        } else {
            return qr 
        }
    }
    async updateQr(qr: Qr): Promise<void> {
        const qrIndex = this.qrs.findIndex((qrItem:Qr) => qrItem.id === qr.id);
        if (qrIndex === -1) {
            throw new NotFoundError("QR not found");
        }
        this.qrs[qrIndex] = qr;
        fs.writeFileSync(filePath, JSON.stringify(this.qrs, null, 2));
    }
    async deleteQr(qrId: string): Promise<void> {
        const qrIndex = this.qrs.findIndex((qr:Qr) => qr.id === qrId);
        if (qrIndex === -1) {
            throw new NotFoundError("QR not found");
        }
        this.qrs.splice(qrIndex, 1);
        fs.writeFileSync(filePath, JSON.stringify(this.qrs, null, 2));
    }
}