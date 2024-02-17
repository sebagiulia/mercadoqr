import readJSON from './../utils.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const usersData = readJSON('../data/users.json')


export class LoginModel {
    static matchLogin = async ({ email, password }) => {
        /* Buscar por email y password */
        const result = usersData.find(u => u.email === email)
        if (result) {
            console.log(result);
            if(await bcrypt.compare(password, result.passwordHash)) {
                
                const userForToken = {
                    id: result.id,
                    name: result.name
                }

                const token = jwt.sign(userForToken, process.env.SECRET)


                return ({state: "permiso concedido.", ...result, token});
            }
            return ({error: {password: true}})
        }

        /* Devolver datos de usuario si matchea */
        return ({error: {email: true}})
        /* Devolver error si no matchea */
    }

}