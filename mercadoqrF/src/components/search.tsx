import { FormEventHandler, MouseEventHandler, useState } from 'react';
import styles from './search.module.css';
import { IoIosSearch } from "react-icons/io";

export default function Search({ onSubmit }: { onSubmit: (sq: string) => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const handleSubmitEnter: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        onSubmit(searchQuery);
    };
    
    const handleSubmitClick: MouseEventHandler<HTMLSpanElement> = (e) => {
        onSubmit(searchQuery);
    }
    return (<div className={styles.container}>
        <form onSubmit={handleSubmitEnter}>
        <input className={styles.input} type="text" placeholder="Buscar local" onChange={handleChange} autoCapitalize='none'/>
        </form>
        <span className={styles.span} onClick={handleSubmitClick}><IoIosSearch /></span>
        </div>)
  }