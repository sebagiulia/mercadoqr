import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import reservedWords from "../utils/reservedWords";
import FormData from "../models/formData";

interface CreateScreenProps {
  error: string | null;
  createPlace: (data: FormData & { password: string }) => Promise<void>;
  onBack: () => void;
}

const CreateScreen: React.FC<CreateScreenProps> = ({
  onBack,
  createPlace,
  error,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    nombreCompleto: "",
    direccion: "",
    ciudad: "",
    instagram: "",
    imagen: "",
    mercadopago: "",
    email: "",
    password: "",
  });

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [imageValid, setImageValid] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Verifica si la URL de imagen es válida
  useEffect(() => {
    if (!formData.imagen) {
      setImageValid(false);
      setImageLoaded(false);
      return;
    }
    const img = new Image();
    img.src = formData.imagen;
    img.onload = () => setImageValid(true);
    img.onerror = () => setImageValid(false);
  }, [formData.imagen]);

  // Validación de contraseñas
  useEffect(() => {
    if (!password && !repeatPassword) {
      setPasswordError(null);
    } else if (password !== repeatPassword) {
      setPasswordError("Las contraseñas no coinciden.");
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError(null);
    }
  }, [password, repeatPassword]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "nombre") {
      const lowerValue = value.trim().toLowerCase();
      if (reservedWords.includes(lowerValue)) {
        setNombreError("Este nombre está reservado, elige otro.");
      } else if (!/^[a-zA-Z0-9_]+$/.test(lowerValue)) {
        setNombreError(
          "Solo se permiten letras, números y guiones bajos (_)."
        );
      } else {
        setNombreError(null);
      }
    }

    if (name === "imagen") {
      setImageLoaded(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombreError || passwordError) return;

    setLoading(true);
    try {
      await createPlace({ ...formData, password });
      if (!error) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Verifica si todos los campos requeridos están llenos
  const allFieldsFilled =
    formData.nombre.trim() &&
    formData.nombreCompleto.trim() &&
    formData.direccion.trim() &&
    formData.ciudad.trim() &&
    formData.email.trim() &&
    password.trim() &&
    repeatPassword.trim();

  const isDisabled = loading || !!nombreError || !!passwordError || !allFieldsFilled;

  // Monitoreo de scroll para botón sticky
  useEffect(() => {
    const handleScroll = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setIsAtBottom(rect.top <= window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pantalla de éxito
  if (success && !error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Negocio creado" onBack={onBack} />
        <main className="flex-grow flex flex-col justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg text-center border border-gray-200">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              🎉 ¡Felicidades!
            </h2>
            <p className="text-gray-700 mb-4">
              Tu negocio{" "}
              <span className="font-semibold">{formData.nombreCompleto}</span>{" "}
              ha sido creado exitosamente.
            </p>
            {formData.imagen && imageValid && (
              <img
                src={formData.imagen}
                alt="Vista previa"
                className="w-40 h-40 object-cover rounded-xl border border-gray-300 shadow-sm mx-auto mb-4"
              />
            )}
            <p className="text-gray-600">
              Ahora podés manejar y administrar tu negocio desde la app{" "}
              <span className="font-semibold text-mercado-blue">
                Admin MercadoQR
              </span>
              .
            </p>
            <button
              onClick={onBack}
              className="mt-6 bg-mercado-blue hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition"
            >
              Volver
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Formulario normal
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Abrí tu negocio" onBack={onBack} />
      <main className="flex-grow p-4 relative">
        <form
          
          className="p-6 space-y-8 max-w-3xl mx-auto"
        >
          {/* Campos del formulario */}
          {/* Vista previa de imagen */}
          {formData.imagen && imageValid && (
            <div className="flex justify-center mb-4">
              <img
                src={formData.imagen}
                alt="Vista previa"
                className={`w-40 h-40 object-cover rounded-xl border border-gray-300 shadow-sm transition-opacity duration-500 ease-in-out ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}

          {/* Nombre corto */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nombre corto
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-lg">
                @
              </span>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="panaderia_luz"
                className={`w-full border ${
                  nombreError ? "border-red-400" : "border-gray-300"
                } rounded-lg p-3 pl-8 focus:outline-none focus:ring-2 ${
                  nombreError ? "focus:ring-red-400" : "focus:ring-mercado-blue"
                }`}
                required
              />
            </div>
            {nombreError ? (
              <p className="text-sm text-red-500 mt-1">{nombreError}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Tu nombre corto se usará como identificador público (ej: @panaderia_luz)
              </p>
            )}
          </div>

          {/* Nombre completo */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nombre completo del negocio
            </label>
            <input
              type="text"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
              required
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
              required
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Ciudad
            </label>
            <select
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-mercado-blue"
              required
            >
              <option value="">Seleccionar ciudad</option>
              <option value="Rosario">Rosario</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="Mendoza">Mendoza</option>
              <option value="Santa Fe">Santa Fe</option>
              <option value="Otra">Otra</option>
            </select>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-lg">
                @
              </span>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="tu_negocio"
                className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
              />
            </div>
          </div>

          {/* Imagen URL */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Imagen (URL)
            </label>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
            />
          </div>

          {/* Token de MercadoPago */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Token de MercadoPago
            </label>
            <input
              type="text"
              name="mercadopago"
              value={formData.mercadopago}
              onChange={handleChange}
              placeholder="APP_USR-xxxxxxxxxxxxxxxxxxxxx"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
            />
            <a
              href="https://www.mercadopago.com.ar/knowledge-hub/20214"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mercado-blue hover:underline mt-1 inline-block"
            >
              ¿Cómo obtener el token?
            </a>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre@correo.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Es necesario para notificarte cualquier información referida a tu negocio.
            </p>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
              required
            />
          </div>

          {/* Repetir contraseña */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Repetir contraseña
            </label>
            <input
              type="password"
              name="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Repetir contraseña"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-mercado-blue"
              required
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Mensaje de error general */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {/* Espacio final para sticky */}
          <div ref={buttonRef}></div>
        </form>

        {/* Botón sticky */}
        {!isAtBottom && (
          <div className="fixed bottom-4 left-0 w-full px-4 z-50">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isDisabled}
                className={`w-full ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-mercado-blue hover:bg-blue-600"
                } text-white font-medium py-3 rounded-full transition`}
              >
                {loading ? "Creando negocio..." : "Crear negocio"}
              </button>
            </div>
          </div>
        )}

        {/* Botón normal al final del formulario */}
        {isAtBottom && (
          <div className="mb-4">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={isDisabled}
                className={`w-full ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-mercado-blue hover:bg-blue-600"
                } text-white font-medium py-3 rounded-full transition`}
              >
                {loading ? "Creando negocio..." : "Crear negocio"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateScreen;
