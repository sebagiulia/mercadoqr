import ScannRepository from "../scannRepository";
import scann from "../../data/scann.json";
import places from "../../data/places.json";
import ScannSchema from "../../schemas/Scann";
import Place from "../../schemas/Place";


export default class ScannRepositoryJSON implements ScannRepository {
    async validate(localName:string, validationCode:string): Promise<Boolean> {
        console.log("Validando scanner en repositorio");
        const place = places.find((place:Place) => place.name === localName);
        if (!place) return false;
        else {
            const placeId = place.id
            const result = scann.find((scann:ScannSchema) => scann.place_id === placeId && scann.validationCode === validationCode);
            if (!result) return false;
        return true
        }
    }
}