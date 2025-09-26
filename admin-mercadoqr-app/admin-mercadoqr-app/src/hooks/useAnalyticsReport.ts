import { useState, useEffect } from "react";
import { AnalyticsReport, Movement } from "../domain/entities/AnalyticsReport";
import { BackAnalyticsRepository } from "../infrastructure/analytics/BackAnalyticsRepository";
import { GetSalesStats } from "../application/analytics/GetSaleStats";
import { Product } from "../domain/entities/Product";
import { BackProductsRepository } from "../infrastructure/products/BackProductsRepository";

const analyticsRepo = new BackAnalyticsRepository();
const analytics = new GetSalesStats(analyticsRepo);
const productRepo = new BackProductsRepository();

export function useAnalyticsReport(token: string, onUnauthorized?: () => void) {
  const [report, setReport] = useState<
    AnalyticsReport & { allMovements?: (Movement & { img?: string })[] } | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const fetchReport = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const responseAn = await analytics.execute(token);
      if (!responseAn.success || !responseAn.data) {
        if (responseAn.error?.code === "401" || responseAn.error?.code === "403") {
          onUnauthorized?.();
        } else {
          throw new Error(responseAn.error?.message || "Error desconocido");
        }
        return;
      }

      const responseProd = await productRepo.getAll(token);
      if (!responseProd.success || !responseProd.data) {
        if (responseProd.error?.code === "401" || responseProd.error?.code === "403") {
          onUnauthorized?.();
        } else {
          throw new Error(responseProd.error?.message || "Error desconocido");
        }
        return;
      }

      const products = responseProd.data;
      setAllProducts(products);

      const enrichWithImages = (movements: Movement[]) =>
        movements.map((m) => {
          const product = products.find((p) => p.id === m.prod_id);
          return { ...m, img: product?.img ?? "" };
        });

      setReport({
        consumed: enrichWithImages(responseAn.data.consumed),
        toConsume: enrichWithImages(responseAn.data.toConsume),
        allMovements: enrichWithImages(responseAn.data.allMovements),
      });
    } catch (error) {
      console.error("Error fetchReport", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [token]);

  return { report, allProducts, loading, fetchReport };
}
