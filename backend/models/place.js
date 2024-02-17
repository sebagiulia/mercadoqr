import fs, { read } from 'node:fs';
import crypto from 'node:crypto';
import readJSON from './../utils.js'
import { generarPalabraAleatoria } from '../randomword.js'
let placesData = readJSON('../data/places.json')
const categoriesData = readJSON('../data/categories.json')
let usersData = readJSON('../data/users.json')
const productsData = readJSON('../data/products.json')
let qrsData = readJSON('../data/qrs.json')
let subsciptionsData = readJSON('../data/subscriptions.json')

const push = (json, file) => {
    fs.writeFile("/home/seba/Escritorio/qrcket/data/" + file + ".json", JSON.stringify(json, null, 2), "utf-8", (error) => {
        if (error) {
            console.error('Error al escribir en el archivo:', error);
        } else {
            console.log('Los datos se han escrito en el archivo JSON satisfactoriamente.');
        }
    });
}

export class PlaceModel {

    static matchPlace = async (object) => {
        const result = placesData.find(p => p.name === object.name);
        if (result) {
            return {
                state: "Sucursal encontrada",
                ...result
            };
        }
        /* Devolver datos de usuario si matchea */

        /* Devolver error si no matchea */
        return {
            error: "No hubo matcheo"
        }
    }

    static findPlaces = async (object) => {
        const result = placesData.filter(p => p.name.includes(object.name))
        if (result) {
            return {
                state: "Sucursal encontrada",
                places: result
            };
        }

        /* Devolver error si no matchea */
        return {
            error: "404"
        }
    }

    static getPlaceDataByPlaceName = async ({ name }) => {

        const place = await this.matchPlace({ name });
        if (place.error) {
            return place
        }

        const categories = categoriesData.filter(cat => cat.place_id === place.id);
        const place_products = productsData.filter(prod => prod.place_id === place.id);
        const products = {}
        categories.forEach(cat => {
            products[cat.name] = [...place_products.filter(prod => prod.category_id === cat.category_id)]
        })


        return {
            success: true,
            ...place,
            products: { ...products }
        };
    }

    static getQrListFromUserId = async ({ place_id, user_id }) => {
        const qr_list = qrsData.filter(qr => qr.place_id === place_id && qr.user_id === user_id);
        if (qr_list) return qr_list;
        return { error: { qr_list: true } };
    }

    static subscribeToPlace = async ({ place_id, user_id }) => {
        const exist = subsciptionsData.find(obj => obj.place_id === place_id && obj.user_id === user_id);
        if (exist) return { error: { subscribed: true } }
        subsciptionsData.push({ place_id, user_id })
        push(subsciptionsData, 'subscriptions');
        return { success: true };
    }

    static unsubscribeToPlace = async ({ place_id, user_id }) => {
        subsciptionsData = subsciptionsData.filter(obj => obj.place_id !== place_id || obj.user_id !== user_id);
        push(subsciptionsData, 'subscriptions');
        return { success: true };
    }

    static buyqr = async ({ place_id, user_id, product_id, quantity }) => {
        const user = usersData.find(u => u.id === user_id);
        if (!user) return { error: { user: true } };

        const product = productsData.find(p => p.prod_id === product_id && p.place_id === place_id);
        if (!product) return { error: { product: true } };

        if (user.balance < product.price * quantity)
            return { error: { balance: true } }

        usersData = usersData.map(u => {
            if (u.id === user.id)
                return { ...u, balance: (u.balance - product.price * quantity) }
            return u;
        })
        if (!usersData) return { error: { update: true } };

        const qr_id = crypto.randomUUID();
        const date = new Date();
        const place_qrs = qrsData.filter(qr => qr.place_id === place_id).map(qr => qr.code);
        const code = generarPalabraAleatoria(place_qrs, 6);
        const qr_object = { code, user_id, place_id, qr_id, product_id, name: product.prod_name, date: date.toDateString(), expiration: 7, quantity }

        qrsData.push(qr_object);

        push(usersData, 'users');
        push(qrsData, 'qrs');

        const img = qr_id /* qrGenerator(qr_id) */
        return { success: true, qr: img }

    }

    static getqrs = async ({ user_id }) => {
        const qr_list = qrsData.filter(qr => qr.user_id === user_id);
        if (qr_list) return { success: true, qr_list: qr_list };
        return { success: true, qr_list: [] };
    }

    static getsubs = async ({ user_id }) => {
        const subs_places = subsciptionsData.filter(s => s.user_id === user_id)
        const subs = subs_places.map(s => placesData.find(p => p.id === s.place_id));
        if (subs) return { success: true, subs };
        return { success: true, subs: [] };
    }

    static getplaces = async ({ user_id }) => {
        const places = placesData.filter(p => p.user_id === user_id)
        if (places) return { success: true, places };
        return { success: true, places: [] };
    }

}