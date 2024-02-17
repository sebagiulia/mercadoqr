import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const validateLogin = (object) => {
    return loginSchema.safeParse(object);
}
