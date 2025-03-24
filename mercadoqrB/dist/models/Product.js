"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Place_1 = require("./Place");
class Product extends sequelize_1.Model {
}
exports.Product = Product;
Product.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    place_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    price: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    img: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    start_date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    end_date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { sequelize: database_1.sequelize, modelName: "product", timestamps: false });
Place_1.Place.hasMany(Product, { foreignKey: "place_id", sourceKey: "id" });
Product.belongsTo(Place_1.Place, { foreignKey: "place_id", targetKey: "id" });
