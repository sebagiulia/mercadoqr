import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
    host: "localhost",
    user: "server_mercadoqr",
    password: "",
    database: "mercadoqr_db",
});


/* por el momento no es middleware */
export const verifyToken = async (req, res) => {
    const authorization = req.get('authorization');
    let token = null;
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken.id)
        return res.status(401).json({ error: 'invalid or missing token' })

    try {
        const result = await connection.query(
            `SELECT *, BIN_TO_UUID(user_id) user_id FROM users WHERE
            user_id = UUID_TO_BIN(?)`, [decodedToken.id]
        );
        if (result[0].length == 0)
            return res.status(401).json({ error: 'invalid or missing token' })

        const user = result[0][0];
        delete user.user_passwordHash;
        return res.json(user);
    } catch (e) {
        console.error("Error en DB para token");
        return res.status(401).json({ error: 'invalid or missing token' })
    }
}
