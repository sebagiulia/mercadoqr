export default interface PaymentProduct {
    
    /* Product Info */
    prod_id: number;
    place_id: number
    payment_method: string;
    price: number;
    quantity: number;
    total: number;

    /* User Info */
    email: string;
} 