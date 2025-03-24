import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Place } from "./Place"; 
import { Product } from "./Product"; 
import crypto from "crypto";

export class Payment extends Model {
    id!:string;
    preference_id!: string;
    place_id!:number;
    prod_id!:number;
    prod_cant!:number;
    email!:string;
    telefono!:string;
    status!:string;
}

Payment.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => crypto.randomUUID() },
    preference_id: { type: DataTypes.STRING, allowNull: true },
    place_id: { type: DataTypes.INTEGER, allowNull: false },
    prod_id: { type: DataTypes.INTEGER, allowNull: false },
    prod_cant: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    telefono: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "payment", timestamps: false }
);

Place.hasMany(Payment, { foreignKey: "place_id", sourceKey: "id" });
Product.hasMany(Payment, { foreignKey: "prod_id", sourceKey: "id" });
Payment.belongsTo(Product, { foreignKey: "prod_id", targetKey: "id" });
Payment.belongsTo(Place, { foreignKey: "place_id", targetKey: "id" });