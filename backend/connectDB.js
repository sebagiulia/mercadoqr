import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config();

console.log(process.env.HOST)

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connection = pool.promise();
export default connection;