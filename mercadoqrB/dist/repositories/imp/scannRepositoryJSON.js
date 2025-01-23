"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scann_json_1 = __importDefault(require("../../data/scann.json"));
const places_json_1 = __importDefault(require("../../data/places.json"));
class ScannRepositoryJSON {
    validate(localName, validationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Validando scanner en repositorio");
            const place = places_json_1.default.find((place) => place.name === localName);
            if (!place)
                return false;
            else {
                const placeId = place.id;
                const result = scann_json_1.default.find((scann) => scann.place_id === placeId && scann.validationCode === validationCode);
                if (!result)
                    return false;
                return true;
            }
        });
    }
}
exports.default = ScannRepositoryJSON;
