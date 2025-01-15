'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Logo from "@/public/mercadoqr-logo.svg";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ErrorProvider } from "errors/ErrorContext";
import { DependencyProvider, useDependencies } from "utils/dependencyContext";
import Place from "@/models/place";

export default function Home() {
  return <DependencyProvider><App /></DependencyProvider>;
}

function App() {
  const { placeService } = useDependencies();
  const router = useRouter();
  
  const [inputValue, setInputValue] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(0);

  useEffect(() => {
    // Si el input está vacío, no hacer nada
    if (inputValue.trim() === "") {
      setPlaces([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(1);
      try {
        const placesData = await placeService.getPlaces(inputValue);
        setPlaces(placesData);          
        setIsLoading(2);
      } catch (error) {
        setIsLoading(3);
      } 
    }, 400); // 0.4 segundos de espera

    // Limpiar el temporizador si el usuario escribe de nuevo antes de los 400ms
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handlePlaceClick = (place: Place) => {
    // Navegar a la URL de la sucursal correspondiente
    router.push(`/${place.name}`);
    setInputValue(place.name); // Opcionalmente, puedes colocar el nombre de la sucursal en el input
    setPlaces([]); // Limpiar las sugerencias
  };

  return (
    <ErrorProvider>
      <div className={styles.page}>
        <main className={styles.main}>
          <Image
            src={Logo}
            alt=""
            width={200}
            height={200}
          />
          Comprá ahora, retirá después
          <input
            className={styles.search}
            type="text"
            placeholder="Buscar sucursal"
            value={inputValue}
            onChange={handleInputChange}
          />
          {places.length >= 0 && (
            <div className={styles.suggestions}>
              {isLoading === 1 ? 
                <div>Loading...</div> // Puedes poner un spinner o mensaje de carga aquí
               :  isLoading === 2 ?  (
                places.map((place, index) => (
                  <div
                    key={index}
                    className={styles.suggestion}
                    onClick={() => handlePlaceClick(place)}
                  >
                    {place.name}
                  </div>
                ))
              ): isLoading === 3 ? <div>No existe sucursal con ese nombre</div> : <></> }
            </div>
          )}
        </main>
      </div>
    </ErrorProvider>
  );
} 
