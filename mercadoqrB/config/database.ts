import { Dialect, Sequelize } from "sequelize";
import 'dotenv/config'
const db_name = process.env.DB_DB || "mi_base";
const db_host = process.env.DB_HOST || "localhost";
const db_user = process.env.DB_USER || "root";
const db_password = process.env.DB_PASSWORD || "password"
const db_port = parseInt(process.env.DB_PORT || "3306", 10);
const db_dialect = process.env.DB_DIALECT || "postgres";
export const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  dialect: db_dialect as Dialect,
  port: db_port,
  logging:false,
  define: {
    timestamps: false,
  },
  dialectOptions: {
    ssl: true,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate({ logging: false });
    console.log("✅ Base de datos conectada");
  } catch (error) {
    console.error("❌ Error al conectar la BD:", error);
    process.exit(1);
  }
};
