import Place from "@/models/place";
import styles from "./suggestion.module.css";
import Link from "next/link";
import ButtonPlace from "./buttonPlace";
import { useRouter } from "next/navigation";

export function Suggestions({ places }: { places: Place[] }) {


        const router = useRouter();
        return (
          <div className={styles.suggestions}>
            {places.map((place) => (
              <ButtonPlace key={place.id} place={place} router={router}/>
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
