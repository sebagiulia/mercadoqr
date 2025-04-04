import Place from "@/models/place";
import styles from "./suggestion.module.css";
import { useRouter } from "next/navigation";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { GridLoader } from "react-spinners";



export function Suggestions({ places }: { places: Place[] }) {


        const router = useRouter();
        return (
          <div className={styles.suggestions}>
            {places.length === 0? <p>No se encontraron resultados</p>
            :places.map((place) => (
              <ButtonPlace key={place.id} place={place} router={router}/>
            ))}
          </div>
        );
  }

export function SuggestionsSkeleton() {
      return (
        <div className={styles.suggestions}>
          <ButtonPlaceSkeleton />
          <ButtonPlaceSkeleton />
          <ButtonPlaceSkeleton />
          <ButtonPlaceSkeleton />
        </div>
      );
}

function ButtonPlace({place, router}:
  {place: Place, router: AppRouterInstance}) {

  const [click, setClick] = useState(false);

  const handleClick = () => { 
    setClick(true);
    window.location.href = `/local/${place.name}`;
    // Hacer algo con la sucursal
  }
  return (
  <div className={styles.buttonPlace} onClick={handleClick} >
    <div className={styles.buttonPlace_img}>
      <img className={styles.buttonPlace_img}
          src={place.img}
          alt=""
      />
    </div>
  <div className={styles.buttonPlace_info}>
  <div className={styles.buttonPlace_name}>
    {place.name}
  </div>
  <div className={styles.buttonPlace_address}>
    {place.address}
  </div>
  </div>
  {/* click && (
  <div className={styles.loader_overlay}>
  <GridLoader color="#ffffff" size={15} />
  </div>
  ) */}
  </div>

  )
}

function ButtonPlaceSkeleton() {
  return (
    <div className={styles.buttonPlace} style={{padding:0}}>
      <div className={styles.skeleton} style={{height:'100%', width:'100%', borderRadius:'20px'}} />
    </div>
  );
}
