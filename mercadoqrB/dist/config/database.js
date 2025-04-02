"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("dotenv/config");
const db_name = process.env.DB_DB || "mi_base";
const db_host = process.env.DB_HOST || "localhost";
const db_user = process.env.DB_USER || "root";
const db_password = process.env.DB_PASSWORD || "password";
const db_port = parseInt(process.env.DB_PORT || "3306", 10);
const db_dialect = process.env.DB_DIALECT || "postgres";
exports.sequelize = new sequelize_1.Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: db_dialect,
    port: db_port,
    logging: false,
    define: {
        timestamps: false,
    },
    dialectOptions: {
        ssl: true,
    },
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate({ logging: false });
        console.log("✅ Base de datos conectada");
    }
    catch (error) {
        console.error("❌ Error al conectar la BD:", error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
