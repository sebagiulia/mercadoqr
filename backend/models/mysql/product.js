import connection from '../../connectDB.js'


export class ProductModel {
    static raiseProduct = async ({ user_id, place_id, product }) => {

        try {

            /** Verifico que el usuario es el propietario del negocio */
            let result = await connection.query(`
            SELECT * FROM places WHERE
                user_id = UUID_TO_BIN(?)
                AND
                place_id = ?;`, [user_id, place_id])
            if (!result[0].length) return { error: { credentials: true } }

            /** Verifico la categoria exista, sino inserto una nueva */
            result = await connection.query(`
                SELECT * FROM categories WHERE
                place_id = ?;`, [place_id])
            const categories = result[0];
            const category = categories.find(cat => cat.category_name === product.category);
            let categoryId = null;
            if (!category) {
                // Insertar en la tabla categories
                const [resultCat, fieldsCat] = await connection.query(`
                  INSERT INTO categories (place_id, category_name)
                  VALUES (?, ?);`, [place_id, product.category]);
              
                if (resultCat.error) return { error: true };
              
                // Obtener el category_id del resultado de la inserción en categories
                categoryId = resultCat.insertId;
            } else {
                categoryId = category.category_id;
            }

              
                // Insertar en la tabla products utilizando el category_id obtenido
                const [resultProd, fieldsProd] = await connection.query(`
                  INSERT INTO products (category_id, place_id, product_name, product_price, product_img)
                  VALUES (?,?,?,?,?);`
                  , [categoryId, place_id, product.name, product.price, product.img]);
              
                if (resultProd.error) return { error: true };
              
                return { success: true };

        } catch (e) {
            console.error("Error raising product DB " + e);
            return { error: true }
        }
    }
}