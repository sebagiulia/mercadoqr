import { connectDB, sequelize } from "../config/database";
import places from "../data/places.json"
import products from "../data/products.json"
import { Place } from "../models/Place"
import { Product } from "../models/Product"



async function  DBtest() {
    connectDB()
    sequelize.sync({force: true }).then(async () => {
        console.log("✅ Modelos sincronizados");
        for (let place of places) {
            await Place.create(place)
        }
        
        for (let product of products) {
            await Product.create(product)
        }
        console.log("DB test done")
    })
   
    
}

export default DBtest