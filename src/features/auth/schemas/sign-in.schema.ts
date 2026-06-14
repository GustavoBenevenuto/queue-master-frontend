import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email().min(1, 'E-mail is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'The password must be at least 8 characters'),
})

export type SignInFormValues = z.infer<typeof signInSchema>
