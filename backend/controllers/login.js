import { validateLogin } from '../schemmas/login.js';
import { LoginModel } from '../models/mysql/login.js';
export class LoginController {
    static matchLogin = async (req, res) => {
        const result = validateLogin(req.body);
        if (!result.success) {
            console.log
            return res.json({ error: {credentials: true} });
        }
        const newLog =  await LoginModel.matchLogin(result.data);

        if(!newLog.error)
            delete newLog.user_passwordHash

        return res.json(newLog)
    }

}