import Place from "@/models/place";
import styles from "./suggestion.module.css";
import PlaceService from "services/placeService";

export async function Suggestions({ placename }: { placename: string }) {
  if(placename === "") {
    return <div></div>
  } 
  try {
      const {success, data, error} = await PlaceService.getPlaces(placename);
      if(success) {
        const places = data || [];
        return (
          <div className={styles.suggestions}>
            {places.map((place) => (
              <Suggestion key={place.id} place={place} />
            ))}
          </div>
        );
      } else {
        return <div>No existe sucursal</div>
      }
    } catch (error) {
      return <div>No existe sucursal</div>
    }
  }

export function SuggestionsSkeleton() {
      return (
        <div className={styles.suggestions}>
          <div className={styles.suggestionSk_item}>Item</div>
          <div className={styles.suggestionSk_item}>Item</div>
          <div className={styles.suggestionSk_item}>Item</div>
        </div>
      );
}



function Suggestion({ place}: { place: Place}) {
    return (
      <div className={styles.suggestion} >
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