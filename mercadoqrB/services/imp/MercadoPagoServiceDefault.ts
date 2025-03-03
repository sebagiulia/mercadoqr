import { MercadoPagoError } from "../../errors/errors";
import PlaceRepository from "../../repositories/placeRepository";
import MercadoPagoService from "../MercadoPagoService";
import { MercadoPagoConfig, Preference } from 'mercadopago';
export default class MercadoPagoServiceDefault implements MercadoPagoService {
    private PlaceRepository: PlaceRepository;
    constructor(PlaceRepository: PlaceRepository) {
        this.PlaceRepository = PlaceRepository;
        this.getInitPoint = this.getInitPoint.bind(this);
    }
    async getInitPoint(place_id:string, prod_id:string, quantity:number): Promise<string> {
        const place = await this.PlaceRepository.getPlaceById(Number(place_id));
        const client = new MercadoPagoConfig({ accessToken: place.credential });
        const product = await this.PlaceRepository.getProductById(Number(place_id), Number(prod_id));
        const preference = new Preference(client);
        const preferenceConcrete = await preference.create({
              body: {
                items: [
                  {
                    title: product.name,
                    quantity: quantity,
                    unit_price: product.price,
                    id: product.id.toString(),
                    picture_url:product.img
                  }
                ],
                back_urls: {success:'http://localhost:3000/success',
                            failure: 'http://localhost:3000/failure',
                            pending: 'http://localhost:3000/pending'},
                notification_url: 'http://localhost:1024/api/mp/notification_url',
                
              }
            })
        if(preferenceConcrete.init_point) {
          return preferenceConcrete.init_point;
        }
        throw new MercadoPagoError('Error de preferencia');
    }
}