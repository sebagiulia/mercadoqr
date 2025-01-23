'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Logo from "@/public/mercadoqr-logo.svg";
import { notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ErrorProvider } from "errors/ErrorContext";
import Place from "@/models/place";
import PlaceService from "services/placeService";
import Link from "next/link";

export default function Home() {
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
        const response = await PlaceService.getPlaces(inputValue);
        if(!response.success || !response.data) {
          notFound();
        } else {
          setPlaces(response.data);          
        }
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
    router.push(`/local/${place.name}`);
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
                  <Suggestion
                    key={index}
                    onClick={() => handlePlaceClick(place)}
                    place={place}
                  />
                ))
              ): isLoading === 3 ? <div>No existe sucursal con ese nombre</div> : <></> }
            </div>
          )}

          <div className={styles.footer}>
            <Link href="/scann">Escanear</Link>
          </div>
        </main>
      </div>
    </ErrorProvider>
  );
}

function Suggestion({ place, onClick }: { place: Place; onClick: any }) {
  return (
    <div className={styles.suggestion} onClick={onClick}>
      <div className={styles.suggestion_img}>
        <img className={styles.suggestion_img}
          src={place.img}
          alt=""
        />
      </div>
      <div className={styles.suggestion_info}>
        <div className={styles.suggestion_name}>
        {place.name}
        </div>
        <div className={styles.suggestion_address}>
          {place.address}
        </div>
      </div>
    </div>
  );
}
