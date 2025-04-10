"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import PlaceService from "services/placeService";

export default function Page() {
    return(
        <div className="flex flex-col items-center justify-center gap-y-10 h-screen">
            <FormularioNegocio />
        </div>
    )
}

function FormularioNegocio() {
    const [step, setStep] = useState(1);
  
    const [formData, setFormData] = useState({
      nombre: "",
      nombreCompleto: "",
      direccion: "",
      instagram: "",
      imagen: "",
      mercadopago: "",
      email: "",
    });

    const handleStep = (step: number) => {
        switch (step) {
            case 2:
                if (!formData.nombre || !formData.nombreCompleto || !formData.direccion) {
                    alert("Por favor completa todos los campos obligatorios");
                    return;
                }
                break;
            default:
                break;
            }
        setStep(step);
        
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleImagenChange = (url: string) => {
      setFormData((prev) => ({ ...prev, imagen: url }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if(!formData.nombre || !formData.nombreCompleto || !formData.direccion || !formData.mercadopago || !formData.email) {
        alert("Por favor completa todos los campos obligatorios");
        return;
      }


      try {
        const response = await PlaceService.createPlace(formData);
  
        if (response.success) {
          setStep(3);
        } else {
          alert("Error al registrar negocio");
        }
      } catch (error) {
        console.error(error);
        alert("Error inesperado");
      }
    };
  
    return (
      <form
        onSubmit={handleSubmit}
        className="max-w-100 w-9/10 mx-auto bg-[var(--catalog)] shadow-md rounded-xl p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-[var(--foreground)]">
          Registro de Negocio
        </h2>
  
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ImagenNegocio onImageUrlChange={handleImagenChange} />
  
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Nombre del negocio
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Nombre completo del titular
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Instagram (opcional)
              </label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="nombre de usuario"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            <div className="flex justify-center">
              <button
                type="button"
                onClick={()=> handleStep(2)}
                className="w-full cursor-pointer bg-[var(--foreground)] text-[var(--background)] font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition-all duration-300 active:opacity-80"
              >
                Siguiente
              </button>
            </div>
            </motion.div>
        )}
  
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x : 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
            >
            <div>
              <label htmlFor="mercadopago" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Credencial MercadoPago
              </label>
              <input
                type="text"
                id="mercadopago"
                name="mercadopago"
                value={formData.mercadopago}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
  
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => handleStep(1)}
                className="cursor-pointer text-[var(--foreground)] hover:underline font-medium"
              >
                Volver
              </button>
              <button
                type="submit"
                className="cursor-pointer bg-[var(--category)] text-[var(--foreground)] font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition-all duration-300 active:opacity-80"
              >
                Solicitar apertura
              </button>
            </div>
            </motion.div>
        )}
        {step === 3 && <Succeed />}
      </form>
    );
  }
  

  type ImagenNegocioProps = {
    onImageUrlChange: (url: string) => void;
  };
  
  function ImagenNegocio({ onImageUrlChange }: ImagenNegocioProps) {
    const [modo, setModo] = useState("url");
    const [imagenUrl, setImagenUrl] = useState("");
    const [preview, setPreview] = useState("");
  
    const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setImagenUrl(url);
      setPreview(url);
      onImageUrlChange(url); // importante!
    };
  
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Imagen del negocio (opcional)
        </label>
  
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="modo"
              value="url"
              checked={modo === "url"}
              onChange={() => {
                setModo("url");
                setPreview("");
                setImagenUrl("");
                onImageUrlChange("");
              }}
            />
            Usar URL
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="modo"
              value="archivo"
              checked={modo === "archivo"}
              onChange={() => {
                setModo("archivo");
                setPreview("");
                setImagenUrl("");
                onImageUrlChange("");
              }}
            />
            Subir archivo
          </label>
        </div>
  
        {modo === "url" ? (
          <input
            type="url"
            value={imagenUrl}
            onChange={handleUrl}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : (
          <span className="text-sm text-gray-500">No disponible por el momento</span>
        )}
  
        {preview && (
          <div className="justify-self-center w-[100px] h-[100px] border rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setPreview("")}
            />
          </div>
        )}
      </div>
    );
  }

  function Succeed() {
    const handleClick = () => {
      window.location.href = "/";
    };
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-green-500">¡Solitud enviada correctamente!</h1>
        <p className="mt-4 text-[var(--foreground)]">Analizaremos la información y te estaremos notificando por email con las credenciales para tu negocio digital.</p>
        <button onClick={handleClick} className="cursor-pointer mt-10 bg-[var(--foreground)] text-[var(--background)] font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition-all duration-300 active:opacity-80">
          Volver al inicio
        </button>
      </div>
    );
  }