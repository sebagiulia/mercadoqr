export interface Movement {
    payment_id: number;
    prod_id: number;
    place_id: number;
    quantity: number;
    total_price: number;
    status: "Consumido" | "Por consumir";
    user_id: number;
}

export interface AnalyticsReport {
    consumed: Movement[];
    toConsume: Movement[];
    allMovements: Movement[];
}