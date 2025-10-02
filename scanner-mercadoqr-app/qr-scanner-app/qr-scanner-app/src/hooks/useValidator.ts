// hooks/useScanners.ts
import { consumeQrByQrId, fetchQRData } from "../services/qrService";
import errorMsg from "../services/errorMsg";

export function useValidator(token: string | null, onUnauthorized?: () => void) {

    const fetchProd = async (data:string) => {
      try {
        if (!token) {
            onUnauthorized?.();
            return;
        }
        const response = await fetchQRData(token, data);
        if (response.success && response.data) {
          return {success: true, data:response.data};
        } else {
          if (response.error?.code === "401" || response.error?.code === "403") {
            onUnauthorized?.();
          } else {
            return { success:false, message: errorMsg(response.error?.code || "", response.error?.message || "") };
          }
        }
      } catch (error) {
        return { success:false, message: errorMsg("", "") };
      }
    };

    const consumeQr = async (data:string) => {
      try {
        if (!token) {
            onUnauthorized?.();
            return;
        }
        const response = await consumeQrByQrId(token, data);
        console.log(response);
        if (response.success && response.data) {
          return {success: true};
        } else {
          if (response.error?.code === "401" || response.error?.code === "403") {
            onUnauthorized?.();
          } else {
            return { success:false, message: "No se pudo consumir el Qr." };
          }
        }
      } catch (error) {
        return { success:false, message: "Error desconocido. Intente mas tarde." };
      }
    }

  return { fetchProd, consumeQr };
}
