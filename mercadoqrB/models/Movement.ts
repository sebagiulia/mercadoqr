export default interface Movement {
    id: string;
    place_id: number;
    prod_id: number;
    prod_quant: number;
    balance: number;
    user_email: string;
    user_phone: string;
    expired_at: Date;
    status: "Consumido" | "Por consumir";
}