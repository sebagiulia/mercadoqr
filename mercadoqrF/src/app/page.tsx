'use client'
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
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
        const {success, error, data} = await PlaceService.getPlaces(inputValue);
        if(success) {
          setPlaces(data as Place[]);          
          setIsLoading(2);
        } else {
          setIsLoading(3);
        }
      } catch (error) {
          setIsLoading(3);
      } 
    }, 400); // 0.4 segundos de espera

    // Limpiar el temporizador si el usuario escribe de nuevo antes de los 400ms
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(isLoading === 3)
      setIsLoading(0);  
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
          <div className={styles.info}>
            <h2>mercadoQR.</h2>
            <p>Comprá ahora, retirá después</p>
            <div className={styles.search}>
              <input
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
                  ): isLoading === 3 ? <div>No existe sucursal con ese nombre</div> : null }
                </div>
              )}
            </div>
          </div>
            
          <Tendences onClick={handlePlaceClick}/>
          <div className={styles.footer}>
            <Link href="/scann">Escanear</Link>
          </div>
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

function Tendences({onClick}: {onClick: any}) {
  const [tendences, setTendences] = useState<Place[]>([]);
  const [error, setError] = useState(false);
  const fetchData = async () => {
    try {
      const { success, data } = await PlaceService.getTendences();
      if (success) {
        setTendences(data as Place[]);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.tendences}>
      <p>Sucursales con mayor actividad</p>
      <div className={styles.tendences_list}>
        {error? <div>Error al cargar las tendencias</div> : 
        tendences.map((place, index) => <Suggestion key={index} place={place} onClick={() => onClick(place)} />)}
      </div>
    </div>
  );
}
