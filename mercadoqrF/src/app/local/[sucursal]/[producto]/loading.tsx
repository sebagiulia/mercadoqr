import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function Home() {
    return (
        <Stack spacing={3} alignItems="center" margin={10}>
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="rectangular" width={200} height={200} />
            <Skeleton variant="rectangular" width={250} height={100} />
            <Skeleton variant="rectangular" width={300} height={300} />
        </Stack>
    );
}
