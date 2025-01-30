import Place from "@/models/place";
import styles from "./suggestion.module.css";
import ButtonPlace from "./buttonPlace";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import Stack from '@mui/material/Stack';

export function Suggestions({ places }: { places: Place[] }) {


        const router = useRouter();
        return (
          <div className={styles.suggestions}>
            {places.map((place) => (
              <ButtonPlace key={place.id} place={place} router={router}/>
            ))}
          </div>
        );
  }

export function SuggestionsSkeleton() {
      return (
        <div className={styles.suggestions}>
          <Stack direction={'row'} spacing={'20px'} alignItems={'center'}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={200} height={30} />
          </Stack>
          <Stack direction={'row'} spacing={'20px'} alignItems={'center'}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={200} height={30} />
          </Stack>
          <Stack direction={'row'} spacing={'20px'} alignItems={'center'}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={200} height={30} />
          </Stack>
        </div>
      );
}
