import { useState } from 'react';
import styles from './search.module.css';
import { IoIosSearch } from "react-icons/io";

export default function Search({ onSubmit }: { onSubmit: any }) {
    const [searchQuery, setSearchQuery] = useState("");
    const handleChange = (e: any) => {
        setSearchQuery(e.target.value);
    }

    const handleSubmit = (e: any) => {
        console.log("enter");
        e.preventDefault();
        onSubmit(searchQuery);
        };

    return (<div className={styles.container}>
        <form onSubmit={handleSubmit}>
        <input className={styles.input} type="text" placeholder="Buscar local" onChange={handleChange} />
        </form>
        <span className={styles.span}><IoIosSearch /></span>
        </div>)
  }