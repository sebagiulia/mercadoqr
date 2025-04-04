"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Place_1 = require("./Place");
class Product extends sequelize_1.Model {
    getStatus() {
        if (this.stock > 0 && this.stock < 5) {
            return "Quedan pocos";
        }
        if (this.stock > 5) {
            return "Disponible";
        }
        return "Agotado";
    }
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
    stock: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    start_date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    end_date: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { sequelize: database_1.sequelize, modelName: "product", timestamps: false });
Place_1.Place.hasMany(Product, { foreignKey: "place_id", sourceKey: "id" });
Product.belongsTo(Place_1.Place, { foreignKey: "place_id", targetKey: "id" });
