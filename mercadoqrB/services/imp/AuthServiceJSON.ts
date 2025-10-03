import AuthService from "../AuthService";
import PlaceRepository from "../../repositories/placeRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthorizationError, NotFoundError } from "../../errors/errors";
import ScannerRepository from "../../repositories/scannerRepository";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

export default class AuthServiceJSON implements AuthService {
    private placeRepository: PlaceRepository;
    private scannerRepository: ScannerRepository;
    constructor(placeRepository: PlaceRepository, scannerRepository: ScannerRepository) {
        this.placeRepository = placeRepository;
        this.scannerRepository = scannerRepository;
    }

    async loginAdmin(name: string, password: string): Promise<{ token: string }> {
        const place = await this.placeRepository.getPlace(name);
        if (!place) throw new NotFoundError("Lugar no encontrado");
        const valid = await bcrypt.compare(password, place.passwordHash);
        if (!valid) throw new AuthorizationError("Credenciales inválidas");

        const token = jwt.sign({ placeId: place.id }, JWT_SECRET, { expiresIn: "1h" });
        return { token };
    }

    async loginScanner(name: string, password: string, place:string): Promise<{ token: string }> {
        const placeData = await this.placeRepository.getPlace(place);
        if (!placeData) throw new NotFoundError("Lugar no encontrado");
        const scanners = await this.scannerRepository.getScanners(placeData.id);
        const scanner = scanners.find((s) => s.name === name);
        if (!scanner) throw new NotFoundError("Escáner no encontrado");
        /* const valid = await bcrypt.compare(password, scanner.passwordHash); */
        const valid = password === scanner.accessCode; // Temporal mientras no se implemente el registro de escáneres
        if (!valid) throw new AuthorizationError("Credenciales inválidas");
        const token = jwt.sign({ placeId: scanner.place_id, scannerId: scanner.id }, JWT_SECRET, { expiresIn: "5h" });
        return { token };
    }
}