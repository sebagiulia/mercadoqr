"use client"
import { ArrowForward } from "@mui/icons-material";

export default function Crear() {

  const handleClick = (n:number) => {
    switch (n) {
      case 1:
        window.location.href = '/crear';
        break;
      case 2:
        alert('En desarrollo');
        break;
      case 3:
        alert('En desarrollo');
        break;
      default:
        break;
    } 
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-10 h-screen">
      <div onClick={() => handleClick(1)} className="transition-opacity active:opacity-50 cursor-pointer flex justify-between items-center text-black bg-[var(--foreground)]  w-9/10 max-w-100 p-3 rounded-full"><p className="pl-2">Abrir negocio</p><ArrowForward fontSize="large" /></div>
      <div onClick={() => handleClick(2)} className="transition-opacity active:opacity-50 cursor-pointer flex justify-between items-center text-black bg-[var(--foreground)] w-9/10 max-w-100  p-3 rounded-full"><p className="pl-2">Administracion</p><ArrowForward fontSize="large" /></div>
      <div onClick={() => handleClick(3)} className="transition-opacity active:opacity-50 cursor-pointer flex justify-between items-center text-black bg-[var(--foreground)] w-9/10 max-w-100 p-3 rounded-full"><p  className="pl-2">Scanner</p><ArrowForward fontSize="large" /></div>
    </div>
  );
}