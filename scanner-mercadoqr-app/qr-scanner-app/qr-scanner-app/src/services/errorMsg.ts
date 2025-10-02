export default function errorMsg(code: string, message:string): string {
  const num = code? parseInt(code, 10) : 7;
  switch (num) {
    case 1:
      return "QR inválido.";
    case 2:
      return "El QR ya fue consumido.";
    case 3:
      return "El QR no pertenece a esta sucursal.";
    case 4:
      return "El QR ha expirado.";
    case 5:
      return "No puedes escanear este QR en tu nivel.";
    case 6:
      return "El producto no está disponible.";
    case 7:
        return "Error del servidor. Intenta nuevamente más tarde.";
    default:
      if (message) {
        return message;
      } 
      return "Error desconocido. Intenta nuevamente.";
  }
}