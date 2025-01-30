import Place from "@/models/place";
import styles from "./buttonPlace.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function ButtonPlace({place, router}:
                                   {place: Place, router: AppRouterInstance}) {
    
    const handleClick = () => { 
        router.push(`/local/${place.name}`);
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
      </div>
    )
}