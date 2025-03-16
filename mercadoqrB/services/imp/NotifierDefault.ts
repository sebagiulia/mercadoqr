import NotifierService from "../NotifierService";

export default class NotifierDefault implements NotifierService {
    async notifyByEmail(email: string, data: string): Promise<void> {
        console.log('Email enviado a: ', email, ' con el mensaje: ', data);
    }
    async notifyByWhatsapp(telefono: string, data: string): Promise<void> {
        console.log('Whatsapp enviado a: ', telefono, ' con el mensaje: ', data);
    }
}