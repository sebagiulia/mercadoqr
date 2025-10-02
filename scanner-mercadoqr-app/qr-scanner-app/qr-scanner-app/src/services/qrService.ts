// services/qrService.ts
import Product from "../models/Product";
import { apiClient } from "../utils/apiClient";
import endpoints from "../utils/endpoints";
import ErrorType from "../utils/ErrorType";
const example= {
    prod_name: "Chandone Decile",
    place_name: "Sucursal Central",
    description: "Un producto de ejemplo",
    category: "Espumantes",
    img: "https://www.sudamerisclub.com.py/wp-content/uploads/2023/02/7790975198651.png",
    start_date: "2023-10-01T00:00:00Z",
    end_date: "2023-10-31T23:59:59Z",
    price: 25000,
    prod_cant:2
  }
  
  export async function fetchQRData(token:string, qrCode: string): Promise<ErrorType<Product>> {
    return apiClient<ErrorType<Product>>(endpoints.GET_QR_DATA_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ qr_code: qrCode })
    });
  }

  export async function consumeQrByQrId(token:string, qrCode:string): Promise<ErrorType<boolean>>{
    return apiClient<ErrorType<boolean>>(endpoints.CONSUME_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      ,body: JSON.stringify({ qr_code: qrCode })
    });
  }
  