import AuthService from "../AuthService";
import PlaceRepository from "../../repositories/placeRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ScannRepository from "../../repositories/scannRepository";
import { AuthorizationError, NotFoundError } from "../../errors/errors";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

export default class AuthServiceJSON implements AuthService {
    private placeRepository: PlaceRepository;
    private scannRepository: ScannRepository;
    constructor(placeRepository: PlaceRepository, scannRepository: ScannRepository) {
        this.placeRepository = placeRepository;
        this.scannRepository = scannRepository;
    }

    async loginAdmin(name: string, password: string): Promise<{ token: string }> {
        const place = await this.placeRepository.getPlace(name);
        if (!place) throw new NotFoundError("Lugar no encontrado");
        const valid = await bcrypt.compare(password, place.passwordHash);
        if (!valid) throw new AuthorizationError("Credenciales inválidas");

        const token = jwt.sign({ placeId: place.id }, JWT_SECRET, { expiresIn: "1h" });
        return { token };
    }

    async loginScanner(name: string, password: string): Promise<{ token: string }> {
        const token = "Not implemented";
        return { token };
    }
}