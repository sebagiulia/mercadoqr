import { AnalyticsReport, Movement } from "../../domain/entities/AnalyticsReport";
import { IAnalyticsRepository } from "../../domain/repositories/IAnalyticsRepository";
import { MockAnalyticsRepository } from "../../infrastructure/analytics/MockAnalyticsRepository";
import ErrorType from "../../utils/errorType";

export class GetSalesStats {
    private repo: IAnalyticsRepository;

    constructor(repo?: IAnalyticsRepository) {
        // Permite inyectar otro repo si se quiere, por defecto usa el mock
        this.repo = repo ?? new MockAnalyticsRepository();
    }

    async execute(token:string): Promise<ErrorType<AnalyticsReport>> {
        const groupByProduct = (movs: Movement[]) => {
            const grouped: Record<number, Movement> = {};
    
            movs.forEach(m => {
                if (grouped[m.prod_id]) {
                    grouped[m.prod_id].quantity += m.quantity;
                    grouped[m.prod_id].total_price += m.total_price;
                } else {
                    grouped[m.prod_id] = { ...m }; // clonar para no mutar original
                }
            });
    
            return Object.values(grouped);
        };

        try {
            const response = await this.repo.getMovements(token);
            if (!response.success || !response.data) {
                return { success: false, error: response.error };
            } else {
                const movements = response.data;
                const consumed = groupByProduct(movements.filter(m => m.status === "Consumido"));
                const toConsume = groupByProduct(movements.filter(m => m.status === "Por consumir"));
                return { success: true, data: { consumed, toConsume, allMovements: movements } };
            }

        } catch (error) {
            return { success: false, error: {message:"Unknown error", code:"500", details:""} };};
        }       

    }
