import serverData from "../../serverData";
import { MercadoPagoError } from "../../errors/errors";
import MercadoPagoRepository from "../../repositories/mercadoPagoRepository";
import PlaceRepository from "../../repositories/placeRepository";
import MercadoPagoService from "../MercadoPagoService";
import { MercadoPagoConfig, Preference } from 'mercadopago';
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
    }
    async getInitPoint(place_id:number, prod_id:number, prod_cant:number, email:string, telefono:string): Promise<string> {
      const place = await this.PlaceRepository.getPlaceById(Number(place_id));
      const client = new MercadoPagoConfig({ accessToken: place.credential });
      
      const product = await this.PlaceRepository.getProductById(Number(place_id), Number(prod_id));
      const payment_id = await this.mercadoPagoRepository.createNewPayment();

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
                back_urls: {success: serverData.frontUrl + '/compra/:' + payment_id,
                            failure: serverData.frontUrl + '/compra/failure',
                            pending:  serverData.frontUrl + '/compra/pending'},
                notification_url: serverData.url + '/api/mp/notify'
              }
            })
          if(preferenceConcrete.init_point && preferenceConcrete.id){
            const paymentRecord = { payment_id, preference_id:preferenceConcrete.id, email, telefono, place_id, prod_id, prod_cant };
            await this.mercadoPagoRepository.saveDataPayment(paymentRecord);
            return preferenceConcrete.init_point;
          }
        throw new MercadoPagoError('Error de preferencia');
    }

    async notifyPayment(payment_id:string): Promise<void> {
        const payment = await this.mercadoPagoRepository.getDataPayment(payment_id);
        const product = await this.PlaceRepository.getProductById(payment.place_id, payment.prod_id);
        const qr = { id: payment_id,
                     code: payment_id,
                     place_id: payment.place_id,
                     prod_id: payment.prod_id,
                     prod_cant: payment.prod_cant,
                     expiration: product.expiration}; 
        await this.QrService.createQr(qr);
        await this.NotifierService.notifyByEmail(payment.email, payment_id);
        await this.NotifierService.notifyByWhatsapp(payment.telefono, payment_id);
        await this.mercadoPagoRepository.removeDataPayment(payment_id);
    }
}