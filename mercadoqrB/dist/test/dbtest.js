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
exports.default = DBtest;
const Place_1 = require("../models/Place");
const Product_1 = require("../models/Product");
const places_json_1 = __importDefault(require("../data/places.json"));
const products_json_1 = __importDefault(require("../data/products.json"));
function DBtest() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let place of places_json_1.default) {
            yield Place_1.Place.create(place);
        }
        for (let product of products_json_1.default) {
            yield Product_1.Product.create(product);
        }
        console.log("DBtest done");
    });
}
