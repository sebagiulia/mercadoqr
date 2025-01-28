import styles from "./page.module.css";
import {Suggestions, SuggestionsSkeleton} from "@/components/suggestion"
import {Tendences, TendenceSkeleton} from "@/components/tendences"
import Search from "@/components/search";
import { Suspense } from "react";
import Link from "next/link";

export default async function Home({searchParams}: {searchParams?:{placename: string}} ) {
  const placename = (await searchParams)?.placename || "";
  return (
      <div className={styles.page}>
          <div className={styles.info}>
            <h2>mercadoQR.</h2>
            <p>Comprá ahora, retirá después</p>
              <Search placeholder={'Buscar local'} />
              <Suspense key={placename} fallback={<SuggestionsSkeleton />}>
                <Suggestions placename={placename} />
              </Suspense>
          </div>

          <Suspense fallback={<TendenceSkeleton />}>
            <Tendences/>
          </Suspense>
            
          <div className={styles.footer}>
            <Link href="/scann">Escanear</Link>
          </div>
      </div>
  );
}




