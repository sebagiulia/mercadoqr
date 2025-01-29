import Place from "@/models/place";
import styles from "./suggestion.module.css";
import Link from "next/link";

export function Suggestions({ places }: { places: Place[] }) {

        return (
          <div className={styles.suggestions}>
            {places.map((place) => (
              <Link key={place.id} href={'/local/' + place.name} >
              <Suggestion key={place.id} place={place} />
              </Link>
            ))}
          </div>
        );
  }

export function SuggestionsSkeleton() {
      return (
        <div className={styles.suggestions}>
          <div className={styles.suggestionSk_item}>Loading...</div>
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