'use client'

import styles from "./page.module.css";
import Link from "next/link";
import Search from "@/components/search";

export default function Home( ) {
    const handleSearchSubmit = (searchQuery: string) => {
      //setClick(true);
      //window.location.href = (`/search?l=${searchQuery}`);
      window.location.href = `/search?l=${searchQuery}`;
    };

    return (
      <div className={styles.page}>
        <div className={styles.info}>
          <h2>mercadoQR.</h2>
          <p>Reservá ahora, consumí después</p>
        </div>
        <Search onSubmit={handleSearchSubmit} />
        <div className={styles.footer}>
          <div className={styles.link}><Link href="/">Escanear</Link></div>
          <div className={styles.link}><Link href="/">Creador</Link></div>
        </div>
      </div>
    );
  }





