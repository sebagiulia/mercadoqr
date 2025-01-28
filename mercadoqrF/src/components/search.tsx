'use client'
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import styles from "./search.module.css";
import { useDebouncedCallback } from "use-debounce";
export default function Search({placeholder}: {placeholder: string}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const handleSearch = useDebouncedCallback((placename: string) => {
        const params = new URLSearchParams();
        if(placename) {
            params.set('placename', placename);
        } else {
            params.delete('placename');
        }
        replace(`${pathname}?${params.toString()}`);
    },300)
    return (
        <div className={styles.search}>
            <input 
            onChange={(event) => handleSearch(event.target.value)}
            placeholder={placeholder}
            defaultValue={searchParams.get('placename')?.toString()}
            />
        </div>
    )
}