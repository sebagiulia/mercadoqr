import PlaceService from "services/placeService";
import styles from "./tendences.module.css";
import Place from "@/models/place";

export async function Tendences() {
      try {
        const { success, data } = await PlaceService.getTendences();
        if (success) {
            const tendences = data as Place[]
            return (
                <div className={styles.tendences}>
                  <p>Sucursales con mayor actividad</p>
                  <div className={styles.tendences_list}>
                    {tendences.map((place, index) => <TendenceItem key={index} place={place} />)}
                  </div>
                </div>
              );
        } else {
          return(<div> Error de carga </div>)
        }
      } catch (error) {
        return(<div> Error de carga </div>)
      }
    
  }

export function TendenceSkeleton() {
    return (
        <div className={styles.tendences}>
          <p>Sucursales con mayor actividad</p>
          <div className={styles.tendences_list}>
            <div className={styles.tendenceSK_item}>Item</div>
            <div className={styles.tendenceSK_item}>Item</div>
            <div className={styles.tendenceSK_item}>Item</div>
          </div>
        </div>
      );
} 

function TendenceItem({place}:{place:Place}) {
  return (
  <div className={styles.tendence_item}>
  <div className={styles.tendence_item_img}>
    <img className={styles.tendence_item_img}
      src={place.img}
      alt=""
    />
  </div>
  <div className={styles.tendence_item_info}>
    <div className={styles.tendence_item_name}>
    {place.name}
    </div>
    <div className={styles.tendence_item_address}>
      {place.address}
    </div>
  </div>
</div>
  );
}