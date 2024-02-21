import { generarPalabraAleatoria } from '../../randomword.js'
import connection from '../../connectDB.js'
import path from 'path';

export class PlaceModel {

    static matchPlace = async (object) => {

        try {
            /* Buscar por email y password */
            const result = await connection.query(
                `SELECT *, BIN_TO_UUID(user_id) user_id FROM places WHERE 
                                place_name = ?`, [object.name]
            );

            if (result[0].length == 0) return { error: { match: true } }
            const place = result[0][0];
            return ({
                state: "Sucursal encontrada",
                ...place
            });

        } catch (e) {
            console.error("Error match de places DB");
            return { error: true }
        }
    }

    static findPlaces = async (object) => {

        try {
            /* Buscar por email y password */
            const result = await connection.query(
                `SELECT * FROM places WHERE 
                                place_name LIKE ?`, ['%' + object.name + '%']
            );

            if (result[0].length == 0) return { error: "404" }
            const places = result[0];
            return ({
                state: "Sucursal encontrada",
                places
            });

        } catch (e) {
            console.error("Error Matching Places DB " + e);
            return { error: true }
        }
    }

    static getPlaceDataByPlaceName = async ({ name }) => {

        const place = await this.matchPlace({ name });
        if (place.error) {
            return place
        }

        try {

            const resultCategories = await connection.query(
                `SELECT * FROM categories WHERE
                                    place_id = ?`, [place.place_id]
            )
            const categories = resultCategories[0];


            const resultProducts = await connection.query(
                `SELECT * FROM products WHERE
                    place_id = ?`, [place.place_id]
            )
            const place_products = resultProducts[0];

            const products = {}
            categories.forEach(cat => {
                products[cat.category_name] = [...place_products.filter(prod => prod.category_id === cat.category_id)]
            })


            return {
                success: true,
                ...place,
                products: { ...products }
            };

        } catch (e) {
            console.error("Error Matching Products DB" + e);
            return { error: true }
        }

    }

    static getQrListFromUserId = async ({ place_id, user_id }) => {

        try {
            /* Buscar por email y password */
            const result = await connection.query(
                `SELECT * FROM qrs WHERE 
                                place_id = ?
                                AND user_id = UUID_TO_BIN(?)`, [place_id, user_id]
            );

            const qr_list = result[0];
            return qr_list;

        } catch (e) {
            console.error("Error Matching Qrs DB");
            return { error: true }
        }
    }
    static subscribeToPlace = async ({ place_id, user_id }) => {

        try {
            await connection.execute(`
        INSERT INTO subscriptions (user_id, place_id)
            VALUES (UUID_TO_BIN(?), ?)`, [user_id, place_id]);
            return { success: true }
        } catch (e) {
            console.error("Error en subscribeToPlace " + e);
            return { error: { subscribed: true } }
        }

    }

    static unsubscribeToPlace = async ({ place_id, user_id }) => {
        try {
            await connection.execute(`
        DELETE FROM subscriptions WHERE
            user_id = UUID_TO_BIN(?)
            AND
            place_id = ?`, [user_id, place_id]);
            return {success: true}
        } catch (e) {
            console.error("Error en unsubscribeToPlace " + e);
            return { error: true }
        }
    }

    static buyqr = async ({ place_id, user_id, product_id, quantity }) => {

        try {

            let result = connection.query(
                `SELECT user_balance FROM users WHERE
                user_id = UUID_TO_BIN(?) `, [user_id]
            );
            if (result[0].length == 0) return { error: { user: true } };
            const balance = result[0][0];

            result = connection.query(
                `SELECT product_price FROM products WHERE
                product_id = ? `, [product_id]
            );
            if (result[0].length == 0) return { error: { product: true } };
            const price = result[0][0];

            if (balance < price * quantity)
                return { error: { balance: true } }


            connection.execute(`
        UPDATE users
        SET user_balance = ?
        WHERE user_id = UUID_TO_BIN(?)`, [balance - price * quantity, user_id],
                (error, results, fields) => {
                    if (error) {
                        console.error('Error al realizar la actualización:', error);
                        return { error: { update: true } };
                    } else {
                        console.log('Fila actualizada correctamente.');
                    }
                })

            /**Creo QR */
            const qr_id = crypto.randomUUID();
            /* Genero un codigo unico para los qrs de esa sucursal para una busqueda sencilla*/
            result = connection.query(`
            SELECT qr_code FROM qrs WHERE
            place_id = ?`, [place_id]);
            const place_qrs = result[0][0];
            const qr_codecode = generarPalabraAleatoria(place_qrs, 6);

            /* Creo el qr y lo inserto*/
            const qr_object = { code, user_id, place_id, qr_id, product_id, name: product.prod_name, date: date.toDateString(), expiration: 7, quantity }

            connection.execute(`
            INSERT INTO qrs (qr_id, user_id, place_id, product_id, qr_code, expiration)
            VALUES (UUID_TO_BIN(?),UUID_TO_BIN(?),?,?,?)`, [qr_id, user_id, place_id, product_id, 7],
                (error, results, fields) => {
                    if (error) {
                        console.error("No se pudo crear qr")
                        return { error: { qr: true } }
                    } else {
                        console.log("Se a realizado una compra");
                        const img = qr_id /* qrGenerator(qr_id) */
                        return { success: true, qr: img }
                    }
                });
        }

        catch (e) {
            console.log("Error en buyqr" + e);
            return { error: true }
        }
    }
    static getqrs = async ({ user_id }) => {

        try {
            /* Buscar por email y password */
            const result = await connection.query(
                `SELECT * FROM qrs WHERE 
                    user_id = UUID_TO_BIN(?)`, [user_id]
            );

            const qr_list = result[0];
            return { success: true, qr_list };

        } catch (e) {
            console.error("Error Matching qrs DB");
            return { error: true }
        }
    }

    static getsubs = async ({ user_id }) => {

        try {
            /* Buscar subscripciones por id de usuario */
            const result = await connection.query(
                `SELECT * FROM places WHERE 
                                place_id IN (SELECT place_id FROM subscriptions WHERE
                                                user_id = UUID_TO_BIN(?))`, [user_id]
            );

            const subs = result[0];

            return { success: true, subs };

        } catch (e) {
            console.error("Error Matching subs DB" + e);
            return { error: true }
        }
    }

    static getplaces = async ({ user_id }) => {

        try {
            /* Buscar por email y password */
            const result = await connection.query(
                `SELECT * FROM places WHERE 
                                user_id = UUID_TO_BIN(?)`, [user_id]
            );

            const places = result[0];
            return { success: true, places };

        } catch (e) {
            console.error("Error Matching places DB");
            return { error: true }
        }
    }

    static createPlace = async (place, user_id, file) => {
        
        const { buffer, mimetype} = file;
        const { name, description, location, instagram, img } = place;
        try {
            const img_id = Date.now() + '.' + mimetype.split('/')[1];
            console.log(img_id)
            const [resultImg, fieldsImg] = await connection.query(`
            INSERT INTO places (place_name, place_location, place_description, place_social, place_img, user_id)
            VALUES (?, ?, ?, ?, ?, UUID_TO_BIN(?))`, [name, description, location, instagram, img_id, user_id]
            )

            await connection.query(`
            INSERT INTO profile_images (img_id, img_data, place_id)
            VALUES (?, ?, ?)`, [img_id, buffer, resultImg.insertId]
            )

            return {
                success: true,
                ...place
            }
        } catch (e) {
            console.error("Error Creating Place " + e);
            return { error: true }
        }

    }

    static getPlaceProfileImg = async ({ img_id }) => {
        try {
            const result = await connection.query(
                `SELECT img_data FROM profile_images WHERE
                    img_id = ?`, [img_id]
            )
            if(result[0].length === 0) return { error: true }
            return { success: true,
                     img_data: result[0][0].img_data,
                     img_format: path.extname(img_id)}
        } catch(e) {
            console.error('Error Get Profile Img ' + e);
            return {error: true}
        }
    }
}