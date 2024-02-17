import { number, z } from 'zod'

const productSchema = z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    price: z.number().min(0),
    expiration: z.string().toLowerCase(),
    img: z.string().toLowerCase(),
})

export const validateProduct = (object) => {
    return productSchema.safeParse(object);
}