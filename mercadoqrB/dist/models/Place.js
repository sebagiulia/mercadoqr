"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Place extends sequelize_1.Model {
}
exports.Place = Place;
Place.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    address: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    img: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    credential: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { sequelize: database_1.sequelize, modelName: "place", timestamps: false });
