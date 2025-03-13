'use client'

import styles from "./page.module.css";
import Link from "next/link";
import Search from "@/components/search";
import { useRouter } from "next/navigation";

export default function Home( ) {


    const router = useRouter();

    const handleSearchSubmit = (searchQuery: string) => {
      // Perform search logic here
      // For example, you can navigate to a search results page with the search query as a parameter
      router.push(`/search?l=${searchQuery}`);
    };

    return (
      <div className={styles.page}>
        <div className={styles.info}>
          <h2>mercadoQR.</h2>
          <p>Reservá ahora, consumí después</p>
        </div>
        <Search onSubmit={handleSearchSubmit} />
        <div className={styles.footer}>
          <div className={styles.link}><Link href="/escanear">Escanear</Link></div>
          <div className={styles.link}><Link href="/crear">Crear</Link></div>
        </div>
      </div>
    );
  }





