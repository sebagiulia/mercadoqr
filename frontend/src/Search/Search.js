import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Search.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import searchServices from '../services/searchServices.js'


function LinkPage({ place }) {
  const navigate = useNavigate();
  const handlePlaceClick = (place_name) => {
    navigate("/" + place_name);
  }

  return (
    <div className={styles.search_places_linkplace} onClick={() => handlePlaceClick(place.place_name)}>
      <div className={styles.search_places_linkplace_img}>
        <img src={place.place_img} alt={place.place_name} />
      </div>
      <div className={styles.search_places_linkplace_info}>
        <p className={styles.search_places_linkplace_name}>{place.place_name}</p>
        <p className={styles.search_places_linkplace_location}>{place.place_location}</p>
      </div>
    </div>
  );
}

export function SearchPlaces({ places }) {
  return (
    <div className={styles.search_places}>
      {places.map(place =>
        <LinkPage key={place.place_name} place={place} />)
      }
    </div>
  );
}


export function Search({ user, handlePlace }) {

  const [click, setClick] = useState(true);
  const [input, setInput] = useState('');
  const [places, setPlaces] = useState([])

  const handleInputChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  }

  

  useEffect(() => {

    const doSearching = async () => {

      try {
        const place = await searchServices.search(input);
        if(place.state) setPlaces(place.places);
      } catch (e) {
        console.error('Error en la busqueda de places: ' + e);
      }
      return;
    }

    const time = setTimeout(() => {
      if(input !== '')
        doSearching(); 
    }, 300); // Esperar 500 milisegundos después de que el usuario deja de escribir

    // Limpiar el temporizador anterior cada vez que el usuario escribe
    return () => clearTimeout(time);
  }, [input])

  if (click) {
    return (
      <div className={styles.search}>
        <button onClick={() => setClick(false)} type="button" className="btn btn-outline-primary rounded-5">
          <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
        </button>
      </div>
    );
  }
  return (
    <div className={styles.search}>
      <form>
        <input onChange={handleInputChange} value={input} className="form-control rounded-5 border-primary text-center" type="text" placeholder="Place" aria-label="default input example"></input>
      </form>
      {places ? <SearchPlaces places={places} /> : null}
    </div>
  );
}