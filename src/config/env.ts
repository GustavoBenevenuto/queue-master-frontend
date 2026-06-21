import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url({
    message:
      'NEXT_PUBLIC_API_URL deve ser uma URL válida (ex: https://api.example.com)',
  }),

  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Enterprise Boilerplate'),

  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),

  // Number coercion: variáveis de ambiente sempre chegam como string
  NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD: z.coerce
    .number()
    .int()
    .positive()
    .default(60),

  // Apenas server-side: NÃO deve ser exposta ao client.
  // AUTH_COOKIE_SECRET: z.string().min(16, {
  //   message: 'AUTH_COOKIE_SECRET deve ter pelo menos 16 caracteres',
  // }),
  AUTH_COOKIE_SECRET: z.string().optional(),
})

/**
 * Tipo derivado automaticamente do schema. Qualquer alteração no schema
 * acima propaga o tipo para todo o projeto sem trabalho manual.
 */
export type Env = z.infer<typeof envSchema>

/**
 * Faz o parse e valida `process.env`. Se algo estiver inválido, lança um
 * erro detalhado e interrompe o boot da aplicação.
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD:
      process.env.NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD,
    AUTH_COOKIE_SECRET: process.env.AUTH_COOKIE_SECRET,
  })

  if (!parsed.success) {
    console.error(
      '❌ Variáveis de ambiente inválidas:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error(
      'Variáveis de ambiente inválidas. Verifique o arquivo .env.local',
    )
  }

  return parsed.data
}

export const env = validateEnv()
