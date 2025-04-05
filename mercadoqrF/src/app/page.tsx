'use client'

import styles from "./page.module.css";
import Search from "@/components/search";
import {  ArrowForward } from "@mui/icons-material";

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
          <IngresoVendedoresButton />
      </div>
      </div>
    );
  }

  function IngresoVendedoresButton () {
    const handleClick = () => {
      alert("En desarrollo");
    }

    return (
      <div onClick={handleClick} className={styles.ingresoVendedores}>
        <span>Ingreso vendedores</span>
        <div className={styles.ArrowForward}>
        <ArrowForward fontSize="large" />
        </div>
      </div>
    );
  }





