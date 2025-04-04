'use client'

import styles from "./page.module.css";
import Link from "next/link";
import Search from "@/components/search";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { GridLoader } from "react-spinners";

export default function Home( ) {


    const [click, setClick] = useState(false);
    const router = useRouter();

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
        {click && (
        <div className={styles.loader_overlay}>
          <GridLoader color="#ffffff" size={15} />
        </div>
      )}
      </div>
    );
  }





