import { ProductModel } from '../models/mysql/product.js';
import { validateProduct } from '../schemmas/product.js';



export class ProductController {
    static raiseProd = async (req, res) => {
        const data = {...req.body}
        const { place_id, user_id } = req.body;
        const file = req.file;
        const img = "http://192.168.0.19:1234/product-images/" + file.filename;
        data.img = img;
        data.price = parseInt(data.price, 10);
        delete data.place_id;
        delete data.user_id;

        const result = validateProduct(data);
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const newProd =  await ProductModel.raiseProduct({place_id, user_id, product:result.data});
        if(newProd.success) {
            console.log("Producto creado [" + data.name  + "] by " + user_id + ' in ' + place_id);
        }
        return res.json(newProd);
    }
}