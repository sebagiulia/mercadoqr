import Place from "@/models/place";
import styles from "./suggestion.module.css";

export function Suggestions({ places }: { places: Place[] }) {


        return (
          <div className={styles.suggestions}>
            {places.length === 0? <p>No se encontraron resultados</p>
            :places.map((place) => (
              <ButtonPlace key={place.id} place={place}/>
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

function ButtonPlace({place}:
  {place: Place}) {

  const handleClick = () => { 
    window.location.href = `/local/${place.name}`;
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

function ButtonPlaceSkeleton() {
  return (
    <div className={styles.buttonPlace} style={{padding:0}}>
      <div className={styles.skeleton} style={{height:'100%', width:'100%', borderRadius:'20px'}} />
    </div>
  );
}
