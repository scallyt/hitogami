import { z } from "zod"

export const registerSchema = z.object({
    username: z.string().min(5).max(16).trim(),
    email: z.string().min(12).max(36).email(),
    password: z.string().min(8).trim()
})

export const loginSchema = z.object({
    email: z.string().min(12).max(36).email(),
    password: z.string().min(8).trim()
})