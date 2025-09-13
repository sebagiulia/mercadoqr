import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Place extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public address!: string;
  public img!: string;
  public passwordHash!: string;     // contraseña hasheada
  public mpToken!: string;          // token de MercadoPago
}

Place.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    mpToken: { type: DataTypes.STRING, allowNull: false }, // MercadoPago private token
  },
  { sequelize, modelName: "place", timestamps: false }
);
