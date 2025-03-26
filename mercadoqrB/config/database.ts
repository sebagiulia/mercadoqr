import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("mi_base", "root", "secret", {
  host: "localhost",
  dialect: "mysql",
  port: 3307,
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
