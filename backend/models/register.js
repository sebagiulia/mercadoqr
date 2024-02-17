import fs from 'node:fs';
import bcrypt from 'bcrypt'
import readJSON from './../utils.js'
const usersData = readJSON('../data/users.json')
const rollsData = readJSON('../data/rolls.json')
let subscribersData = readJSON('../data/subscriptions.json')

const push = (json, file) => {
  fs.writeFile("/home/seba/Escritorio/qrcket/data/" + file + ".json", JSON.stringify(json, null, 2), "utf-8", (error) => {
    if (error) {
      console.error('Error al escribir en el archivo:', error);
    } else {
      console.log('Los datos se han escrito en el archivo JSON satisfactoriamente.');
    }
  });
}

export class UserModel {
  static createUser = async (user) => {
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.id = id;
    delete user.password
    usersData.push({ ...user, passwordHash })
    push(usersData, "users");
    return { success: true }
  }

  static findUserByEmail = async ({ email }) => {
    return usersData.some(u => u.email === email)
  }

  static getUserDataFromPlace = async ({ place_id, user_id }) => {
    
    const user = usersData.find(u => u.id === user_id);
    
    if(!user) return { error: { user: true } };

    let userData = {
      subscriber: false,
      roll: null
    };
    const data = subscribersData.find(obj => obj.place_id === place_id && obj.user_id === user_id)
    if (data) {
      userData.subscriber = true
      const roll = rollsData.find(r => r.roll_id === data.roll_id)
      if (roll) {
        userData.roll = {
          name: roll.roll_name,
          color: roll.color
        }
      }
    }
    const obj = {...user, ...userData}
    delete obj.passwordHash;

    return obj
  }

}
