import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Place } from "./Place"; 
import { Product } from "./Product"; 
import crypto from "crypto";
import { Payment } from "./Payment";

export class Qr extends Model {
  public id!: string;
  public payment_id!: string;
  public place_id!: number;
  public prod_cant!: number;
  public prod_id!: number;
  public number!: string;
  public start_date!: string;
  public end_date!: string;
}

Qr.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => crypto.randomUUID() },
    payment_id: { type: DataTypes.STRING, allowNull: true},
    prod_id: { type: DataTypes.INTEGER, allowNull: false },
    place_id: { type: DataTypes.INTEGER, allowNull: false },
    prod_cant: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.STRING, allowNull: false },
    end_date: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "qr", timestamps: false }
);

Place.hasMany(Qr, { foreignKey: "place_id", sourceKey: "id" });
Product.hasMany(Qr, { foreignKey: "prod_id", sourceKey: "id" });
Payment.hasOne(Qr, { foreignKey: "payment_id", sourceKey: "id" });
Qr.belongsTo(Product, { foreignKey: "prod_id", targetKey: "id" });
Qr.belongsTo(Place, { foreignKey: "place_id", targetKey: "id" });