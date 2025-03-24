import { Place } from "../models/Place"
import { Product } from "../models/Product"
import places from "../data/places.json"
import products from "../data/products.json"

export default async function  DBtest() {
    for (let place of places) {
        await Place.create(place)
    }

    for (let product of products) {
        await Product.create(product)
    }

    console.log("DBtest done")
}