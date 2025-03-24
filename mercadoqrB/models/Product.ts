import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Place } from "./Place";    

export class Product extends Model {
  public id!: number;
  public place_id!: number;
  public price!: number;
  public name!: string;
  public description!: string;
  public category!: string;
  public img!: string;
  public start_date!: string;
  public end_date!: string;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    place_id: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.STRING, allowNull: false },
    end_date: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "product", timestamps: false }
);

Place.hasMany(Product, { foreignKey: "place_id", sourceKey: "id" });
Product.belongsTo(Place, { foreignKey: "place_id", targetKey: "id" });