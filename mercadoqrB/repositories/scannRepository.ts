export default interface ScannRepository {
    validate(localName: string, validationCode: string): Promise<Boolean>;
}