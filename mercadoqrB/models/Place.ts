import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Place extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public address!: string;
  public img!: string;
  public credential!: string;
}

Place.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    credential: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "place", timestamps: false }
);
