import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

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

export class Place extends Model {
  public id!: number;
  public name!: string;
  public fullName!: string;
  public description!: string;
  public address!: string;
  public city!: string;
  public socialMedia!: string;
  public email!: string;
  public img!: string;
  public passwordHash!: string;     // contraseña hasheada
  public mpToken!: string;          // token de MercadoPago
}

Place.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    socialMedia: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    img: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    mpToken: { type: DataTypes.STRING, allowNull: false }, // MercadoPago private token
  },
  { sequelize, modelName: "place", timestamps: false }
);
