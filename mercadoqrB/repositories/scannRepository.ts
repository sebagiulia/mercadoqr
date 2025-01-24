import Place from "../schemas/Place";

export default interface ScannRepository {
    validate(localName: string, validationCode: string): Promise<Place>;
}