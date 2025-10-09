"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
/*
 id: number;
    name: string;
    fullName: string;
    description: string;
    address: string;
    city: string;
    socialMedia: string;
    email: string;
    img: string;
    passwordHash: string;
    mpToken: string; */
class Place extends sequelize_1.Model {
}
exports.Place = Place;
Place.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    fullName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    address: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    city: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    socialMedia: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    img: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    passwordHash: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    mpToken: { type: sequelize_1.DataTypes.STRING, allowNull: false }, // MercadoPago private token
}, { sequelize: database_1.sequelize, modelName: "place", timestamps: false });
