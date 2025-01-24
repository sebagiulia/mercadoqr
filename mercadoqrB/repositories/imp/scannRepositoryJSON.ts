import ScannRepository from "../scannRepository";
import scann from "../../data/scann.json";
import places from "../../data/places.json";
import ScannSchema from "../../schemas/Scann";
import Place from "../../schemas/Place";
import { NotFoundError, ValidationError } from "../../errors/errors";


export default class ScannRepositoryJSON implements ScannRepository {
    private scanns: ScannSchema[] = scann;
    constructor() { 
        this.scanns = scann;
    }
    async validate(localName:string, validationCode:string): Promise<Place> {
        const place = places.find((place:Place) => place.name === localName);
        if (!place) throw new NotFoundError('Place not found');
        else {
            const placeId = place.id
            const result = this.scanns.find((scann:ScannSchema) => scann.place_id === placeId && scann.validationCode === validationCode);
            if (!result) new ValidationError('Credenciales invalidas');
        return place;
        }
    }
}