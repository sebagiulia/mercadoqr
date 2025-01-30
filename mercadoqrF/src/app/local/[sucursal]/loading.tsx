import { Skeleton } from "@mui/material";
import {Stack} from "@mui/material";
import styles from "./page.module.css";
export default function Page() {
  return (
    <div className={styles.page}>

      <Stack direction={"column"} spacing={"10px"} alignItems={"center"} >
        <Skeleton variant="rounded" width={100} height={100} />
        <Skeleton variant="rounded" width={130} height={40} />
        <Skeleton variant="rounded" width={250} height={250} />
        <Skeleton variant="rounded" width={250} height={250} />
        <Skeleton variant="rounded" width={250} height={250} />
      </Stack>
    </div>
    
  );
}