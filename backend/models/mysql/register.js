import connection from '../../connectDB.js'
import bcrypt from 'bcrypt'

export class UserModel {
    static createUser = async (user) => {
        const passwordHash = await bcrypt.hash(user.password, 10);
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult;
        let userData = null;
        try {

            await connection.query(
                `INSERT INTO users (user_id, user_name, user_lastname, user_email, user_passwordHash)
            VALUES (UUID_TO_BIN(?),?,?,?,?);`, [uuid, user.name, user.lastname, user.email, passwordHash]
            );

            const userResult = await connection.query(
                `SELECT * FROM users WHERE
                user_id = UUID_TO_BIN(?);`, [uuid]
            )

            return userResult[0][0];


        } catch (e) {
            console.error("Error en insercion de db");
            return { error: true }
        }


    }

    static findUserByEmail = async ({ email }) => {

        try {
            const result = await connection.query(
                `SELECT user_email FROM users WHERE
                    user_email = ? `, [email]
            );
            if (result[0].length > 0) return true;
            return false;
        } catch (e) {
            console.error("Error en la busqueda de email");
            return { error: true };
        }

    }

    static getUserDataFromPlace = async ({ place_id, user_id }) => {

        try {
            let result = await connection.query(
                `SELECT *, BIN_TO_UUID(user_id) user_id FROM users WHERE
                    user_id = UUID_TO_BIN(?);`, [user_id]
            );
            if (!result[0].length) return { error: { user: true } }
            const user = result[0][0];

            result = await connection.query(`
                SELECT * FROM places WHERE
                    place_id = ?
                    AND user_id = UUID_TO_BIN(?);`, [place_id, user_id]);
            if(result[0].length) {
                delete user.passwordHash;
                return {...user, admin:true}
            }


            let userData = {
                subscriber: false,
                roll: null
            }

            result = await connection.query(
                `SELECT * FROM subscriptions WHERE
                    user_id = UUID_TO_BIN(?)
                    AND
                    place_id = ?;`, [user_id, place_id]
            );
            if (result[0].length) userData.subscriber = true;

            result = await connection.query(
                `SELECT roll_id, roll_name, roll_color FROM rolls WHERE
                    roll_id IN (SELECT roll_id FROM user_rolls WHERE
                                    user_id = UUID_TO_BIN(?)
                                    AND place_id = ?);`, [user_id, place_id]
            );
            userData.roll = result[0][0];

            const obj = { ...user, ...userData }
            delete obj.passwordHash;
            return obj;

        } catch (e) {
            console.error("Error en la busqueda de usuario" + e);
            return { error: true };
        }

    }
}

