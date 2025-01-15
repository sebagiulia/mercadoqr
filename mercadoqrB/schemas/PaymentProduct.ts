export default interface PaymentProduct {
    
    /* Product Info */
    prod_id: number;
    payment_method: string;
    price: number;
    quantity: number;
    total: number;

    /* User Info */
    name: string;
    lastname: string;
    email: string;
    phone: string;
    nationalid: string;
} 