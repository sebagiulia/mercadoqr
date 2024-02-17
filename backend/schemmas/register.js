import { number, z } from 'zod'

const registerSchema = z.object({
    name: z.string().toLowerCase(),
    lastname: z.string().toLowerCase(),
    email: z.string().email().toLowerCase(),
    password: z.string().min(6).toLowerCase(),
})

export const validateRegister = (object) => {
    return registerSchema.safeParse(object);
}