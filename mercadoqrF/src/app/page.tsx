import styles from "./page.module.css";
import {Tendences, TendenceSkeleton} from "@/components/tendences"
import SearchSuggestions from "@/components/searchSuggestions";
import { Suspense } from "react";
import Link from "next/link";

export default async function Home( ) {

  return (
      <div className={styles.page}>
          <div className={styles.info}>
            <h2>mercadoQR.</h2>
            <p>Comprá ahora, retirá después</p>
          </div>
            <SearchSuggestions placeholder={'Buscar local'} />

          <Suspense fallback={<TendenceSkeleton />}>
            <Tendences/>
          </Suspense>
            
          <div className={styles.footer}>
            <Link href="/scann">Escanear</Link>
          </div>
      </div>
  );
}




