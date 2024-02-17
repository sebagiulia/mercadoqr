import { z } from "zod";

const placeSchema = z.object({
    name: z.string(),
    location: z.string(),
    description: z.string(),
    instagram: z.string(),
    img: z.string()
})

export const validatePlace = (object) => {
    return placeSchema.safeParse(object);
}
