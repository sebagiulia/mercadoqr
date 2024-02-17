import { validateRegister } from '../schemmas/register.js';
import { UserModel } from '../models/mysql/register.js';

export class UserController {
    static createUser = async (req, res) => {
        const validated = validateRegister(req.body);
        if (!validated.success) {
            return res.status(400).json({ error: JSON.parse(validated.error.message) });
        }

        const newReg = validated.data;
        const status = await UserModel.findUserByEmail(newReg);
        if(status.error)
            return res.json({ error: true })

        if (status)
            return res.json({ error: { email: "already exists" } })
        const result = await UserModel.createUser(newReg);
        delete result.user_passwordHash;

        console.log("Usuario registrado [" + newReg.name + " " + newReg.lastname + "]")
        return res.json({success: true, ...result});
    }

    static getUserDataFromPlace = async (req, res) => {
        const { place_id, user_id } = req.body;
        const userData = await UserModel.getUserDataFromPlace({place_id, user_id});
        if (userData.error) return res.json({ error: { user: "Usuario no encontrado" } });
        return res.json(userData);
    }


}
