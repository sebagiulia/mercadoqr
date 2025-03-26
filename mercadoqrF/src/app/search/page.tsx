'use client'
import Place from "@/models/place";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import PlaceService from "services/placeService";
import {Suggestions, SuggestionsSkeleton} from "@/components/suggestion";
import styles from "./page.module.css";


export default function Page() {
    return (<Suspense fallback={<p>Cargando...</p>}>
                <SearchPage />
            </Suspense>)
    
}

function SearchPage() {
    const [places, setPlaces] = useState<Place[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const searchParams = useSearchParams();
    const placename = searchParams.get('l') || '';
   
    useEffect(() => {
        const fetchPlaces = async () => {
            setIsLoading(true);
            try {
                const {success, data} = await PlaceService.getPlaces(placename);
                if (success) {
                    const places = data || [];
                    setPlaces(places);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(error);
                setIsLoading(false);
                setPlaces([])
            }
        };
        fetchPlaces();
    }, [placename]);
    
    
    return (
        <div className={styles.page}>
            <h1 className={styles.header}>
            Busqueda: {placename}
            </h1>
                {isLoading? <SuggestionsSkeleton />
                :
                <Suggestions places={places} />
                }
        </div>
    )
}
