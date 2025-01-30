'use client'
import styles from "./searchSuggestions.module.css";
import Place from "@/models/place";
import { Suggestions, SuggestionsSkeleton } from "./suggestion";
import { Suspense, useEffect, useState } from "react";
import PlaceService from "services/placeService";

export default function Search({placeholder}:
                               {placeholder: string}) {
    const [placename, setPlacename] = useState<string>('')
    const [places, setPlaces] = useState<Place[]>([])
    const [msg, setMsg] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (!placename.trim()) {
            setPlaces([]); // Limpiar los resultados si el campo está vacío
            setMsg(''); // Opcional: limpiar el mensaje
            return;
        }

        const fetchPlaces = async () => {
            setIsLoading(true);
            try {
                const { success, data, error } = await PlaceService.getPlaces(placename);
                if (success) {
                    const places = data || [];
                    setPlaces(places);
                    setIsLoading(false);
                } else {
                    setMsg(error?.message || 'No existe sucursal');
                    setIsLoading(false);
                }
            } catch (error) {
                setMsg('No se pudo cargar datos');
                setIsLoading(false);
            }
        };

        const delayedFetchPlaces = () => {
            clearTimeout(timeout);
            timeout = setTimeout(fetchPlaces, 300);
        };

        delayedFetchPlaces();

        return () => {
            clearTimeout(timeout);
        };
    }, [placename]);
    return (
        <div className={styles.search}>
            <input 
            onChange={(event) => setPlacename(event.target.value)}
            placeholder={placeholder}
            />
        {isLoading? <SuggestionsSkeleton />: msg?<>{msg}</>: <Suggestions places={places} />}
            

        </div>
    )
}