"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Place_1 = require("./Place");
const Product_1 = require("./Product");
const crypto_1 = __importDefault(require("crypto"));
class Payment extends sequelize_1.Model {
}
exports.Payment = Payment;
Payment.init({
    id: { type: sequelize_1.DataTypes.STRING, primaryKey: true, defaultValue: () => crypto_1.default.randomUUID() },
    preference_id: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    place_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    prod_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    prod_cant: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    telefono: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    status: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: database_1.sequelize, modelName: "payment", timestamps: false });
Place_1.Place.hasMany(Payment, { foreignKey: "place_id", sourceKey: "id" });
Product_1.Product.hasMany(Payment, { foreignKey: "prod_id", sourceKey: "id" });
Payment.belongsTo(Product_1.Product, { foreignKey: "prod_id", targetKey: "id" });
Payment.belongsTo(Place_1.Place, { foreignKey: "place_id", targetKey: "id" });
