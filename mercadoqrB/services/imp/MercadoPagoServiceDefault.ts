import { MercadoPagoError } from "../../errors/errors";
import MercadoPagoRepository from "../../repositories/mercadoPagoRepository";
import PlaceRepository from "../../repositories/placeRepository";
import MercadoPagoService from "../MercadoPagoService";
import { MercadoPagoConfig, MerchantOrder, Payment, Preference } from 'mercadopago';
import NotifierService from "../NotifierService";
import QrService from "../QrService";
export default class MercadoPagoServiceDefault implements MercadoPagoService {
    private NotifierService: NotifierService;
    private PlaceRepository: PlaceRepository;
    private mercadoPagoRepository: MercadoPagoRepository;
    private QrService: QrService;
    constructor(PlaceRepository: PlaceRepository,
                mercadoPagoRepository: MercadoPagoRepository,
                NotifierService: NotifierService,
                QrService: QrService) {
        this.QrService = QrService;
        this.NotifierService = NotifierService;
        this.PlaceRepository = PlaceRepository;
        this.mercadoPagoRepository = mercadoPagoRepository;
        this.getInitPoint = this.getInitPoint.bind(this);
        this.notifyPayment = this.notifyPayment.bind(this);
        this.processMPNotification = this.processMPNotification.bind(this);
    }

    async getInitPoint(place_id:number, prod_id:number, prod_cant:number, email:string, telefono:string): Promise<string> {
      const place = await this.PlaceRepository.getPlaceById(Number(place_id));
      const product = await this.PlaceRepository.getProductById(Number(place_id), Number(prod_id));
      
      if(email==="test@test.com" && telefono==="0123456789"){
        return process.env.FRONTEND_URL + '/compra/' + 'ESTOesUNtestDEprueba';
      }
      
      
      const client = new MercadoPagoConfig({ accessToken: place.credential });
      const payment_id = await this.mercadoPagoRepository.createNewPayment(place_id, prod_id, prod_cant);
      const preference = new Preference(client);
      const preferenceConcrete = await preference.create({
              body: {
                items: [
                  {
                    title: product.name,
                    quantity: prod_cant,
                    unit_price: product.price,
                    id: product.id.toString(),
                    picture_url:product.img
                  }
                ],
                back_urls: {success: process.env.FRONTEND_URL + '/compra/' + payment_id,
                            failure: process.env.FRONTEND_URL + '/compra/failure'},
                notification_url: process.env.BACKEND_URL_PUBLIC + '/api/mp/notify/' + payment_id,
                binary_mode: true
              }
            })
          if(preferenceConcrete.init_point && preferenceConcrete.id){
            const paymentRecord = { id: payment_id, 
                                    preference_id:preferenceConcrete.id,
                                    email, 
                                    telefono, 
                                    place_id, 
                                    prod_id, 
                                    prod_cant,
                                    status: "pending"};
            await this.mercadoPagoRepository.saveDataPayment(paymentRecord);
            return preferenceConcrete.init_point;
          }
        throw new MercadoPagoError('Error de preferencia');
    }

    async notifyPayment(payment_id:string): Promise<void> {
        const payment = await this.mercadoPagoRepository.getDataPayment(payment_id);
        if(payment.status ===  "approved") return;
        const product = await this.PlaceRepository.getProductById(payment.place_id, payment.prod_id);
        const qr = { id: payment_id,
                     payment_id: payment_id,
                     code: payment_id,
                     place_id: payment.place_id,
                     prod_id: payment.prod_id,
                     prod_cant: payment.prod_cant,
                     start_date: product.start_date,
                    end_date: product.end_date };
        console.log("Pago confirmado: place:" + payment.place_id + " prod:" + payment.prod_id + " cant:" + payment.prod_cant);
        await this.mercadoPagoRepository.updateStatus(payment_id, "approved"); 
        await this.QrService.createQr(qr);
        await this.NotifierService.notifyByEmail(payment.email, payment_id);
        await this.NotifierService.notifyByWhatsapp(payment.telefono, payment_id);
        //await this.mercadoPagoRepository.removeDataPayment(payment_id);
    }

    async processMPNotification(payment_id: string, topic: any, id:any): Promise<void> {
      const { place_id, status } = await this.mercadoPagoRepository.getDataPayment(payment_id);
      if(!place_id ) throw new MercadoPagoError("No se encontro el pago");
      if(status === "approved") return;
      const { credential } = await this.PlaceRepository.getPlaceById(place_id);
      const client = new MercadoPagoConfig({ accessToken: credential });
      const payment = new Payment(client)
      const merchantOrders = new MerchantOrder(client)
      try { 
        let merchantOrder = null;
        
        if (topic === "payment") {
          const payment_response = await payment.get({id});
          if (payment_response && payment_response.order) {
            merchantOrder = await merchantOrders.get({merchantOrderId: payment_response.order.id as number});
          }
        } else if (topic === "merchant_order") {
          merchantOrder = await merchantOrders.get({merchantOrderId: id});
        }

        if (!merchantOrder || !merchantOrder.payments) {
            return;
        }

        // Calcular el monto total pagado
        let paidAmount = 0;
        merchantOrder.payments.forEach(payment => {
            if (payment.status === 'approved' && payment.transaction_amount) {
                paidAmount += payment.transaction_amount;
            }
        });

        // Verificar si se pagó el total del pedido
        if ( merchantOrder.total_amount && paidAmount >= merchantOrder.total_amount) {
          await this.notifyPayment(payment_id);
        }
                
    
      } catch (error) {
        console.error("Error handling webhook:", error);
        throw new MercadoPagoError("Error handling webhook");
    }
    }
}