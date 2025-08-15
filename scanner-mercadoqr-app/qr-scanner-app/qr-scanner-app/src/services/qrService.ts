// services/qrService.ts
import Product from "../models/Product";
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
  
  export async function fetchQRData(qrCode: string): Promise<Product> {
    try {
       const res = await fetch(`http://192.168.0.100:8080/api/qrid/${qrCode}`);
  
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
  
      const result = await res.json();
      const data = result.data as Product;
      // Validación mínima
      if (!data.prod_name) {
        throw new Error("Respuesta inválida");
      } 

  
      return data;
    } catch (err) {
      console.error("Error en fetchQRData:", err);
      throw err;
    }
  }

  export async function consumeQrByQrId(qrCode:string): Promise<boolean>{
    try {
      const res = await fetch(`http://192.168.0.100:8080/api/scann/consume/${qrCode}`);
 
     if (!res.ok) {
       throw new Error(`Error HTTP: ${res.status}`);
     }
 
     const result = await res.json();
     // Validación mínima
     if (!result.success) {
       throw new Error("Respuesta inválida");
     } 

 
     return true;
   } catch (err) {
     console.error("Error en fetchQRData:", err);
     throw err;
   }
  }
  