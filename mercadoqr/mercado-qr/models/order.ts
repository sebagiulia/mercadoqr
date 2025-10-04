import Product from "./product";

export default interface Order {
    product: Product;
    quantity: number;
    phone: string;
    email: string;
}