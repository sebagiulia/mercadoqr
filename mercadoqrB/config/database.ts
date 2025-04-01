import { Sequelize } from "sequelize";
import 'dotenv/config'
const db_name = process.env.DB_DB || "mi_base";
const db_host = process.env.DB_HOST || "localhost";
const db_user = process.env.DB_USER || "root";
const db_password = process.env.DB_PASSWORD || "password"
const db_port = parseInt(process.env.DB_PORT || "3306", 10);
export const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  dialect: "mssql",
  //port: db_port,
  dialectOptions: {
    options: {
      encrypt: true,   // Cambiar a true si usas Azure SQL
      trustServerCertificate: true  // Evita problemas con SSL si no tienes certificado
    }
  },
  logging:false
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
