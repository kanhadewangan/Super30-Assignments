import {z} from "zod";




export const  userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
})


export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const appointmentSchema = z.object({
    date: z.string(),
    time: z.string(),
    description: z.string(),
    userId: z.number(),
})