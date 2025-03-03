'use client'
import Place from "@/models/place";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PlaceService from "services/placeService";
import {Suggestions} from "@/components/suggestion";
import styles from "./page.module.css";

export default function Page() {
    
    const [places, setPlaces] = useState<Place[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const placename = searchParams.get('l') || '';
   
    useEffect(() => {
        const fetchPlaces = async () => {
            setIsLoading(true);
            try {
                const { success, data, error } = await PlaceService.getPlaces(placename);
                if (success) {
                    const places = data || [];
                    setPlaces(places);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchPlaces();
    }, []);
    
    
    return (
        <div className={styles.page}>
            <h1 className={styles.header}>
            Busqueda: {placename}
            </h1>
                {isLoading? <p>Cargando...</p>
                :
                <Suggestions places={places} />
                }
        </div>
    )
}
