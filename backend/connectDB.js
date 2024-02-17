import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_mercadoqr',
    password: '',
    database: 'mercadoqr_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connection = pool.promise();
export default connection;