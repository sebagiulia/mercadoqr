export default interface NotifierService {
    notifyByEmail(email: string, data:string): Promise<void>;
    notifyByWhatsapp(telefono: string, data:string): Promise<void>;
}