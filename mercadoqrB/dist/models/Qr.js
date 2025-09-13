"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qr = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Place_1 = require("./Place");
const Product_1 = require("./Product");
const crypto_1 = __importDefault(require("crypto"));
class Qr extends sequelize_1.Model {
}
exports.Qr = Qr;
Qr.init({
    id: { type: sequelize_1.DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => crypto_1.default.randomUUID() },
    prod_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    place_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    prod_cant: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    start_date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    end_date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { sequelize: database_1.sequelize, modelName: "qr", timestamps: false });
Place_1.Place.hasMany(Qr, { foreignKey: "place_id", sourceKey: "id", onDelete: 'NO ACTION' });
Product_1.Product.hasMany(Qr, { foreignKey: "prod_id", sourceKey: "id" });
Qr.belongsTo(Product_1.Product, { foreignKey: "prod_id", targetKey: "id" });
Qr.belongsTo(Place_1.Place, { foreignKey: "place_id", targetKey: "id" });
