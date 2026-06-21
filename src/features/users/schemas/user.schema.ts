import { z } from 'zod'

export const USER_ROLES = ['ADMIN', 'INVENTOR', 'OPERATOR'] as const

export const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  operatorNumber: z.string().min(1, 'Operator number is required'),
  role: z.enum(USER_ROLES),
  active: z.boolean(),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm the new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
