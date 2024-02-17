import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import connection from '../../connectDB.js'

export class LoginModel {
    static matchLogin = async ({ email, password }) => {

        try {
            /* Buscar por email y password */
            const result = await connection.query(
                `SELECT *, BIN_TO_UUID(user_id) user_id FROM users WHERE 
                                user_email = ?`, [email]
            );

            if(result[0].length == 0) return {error : {email: true}}
            const user = result[0][0];
            
            if (await bcrypt.compare(password, user.user_passwordHash)) {
                const userForToken = {
                    id: user.user_id,
                    name: user.user_name
                }
                const token = jwt.sign(userForToken, process.env.SECRET)
                return ({ state: "permiso concedido.", ...user, token });
            }
            return ({ error: { password: true } })

        } catch(e) {
            console.error("Error login DB");
            return { error: true }
        }
    }
}

