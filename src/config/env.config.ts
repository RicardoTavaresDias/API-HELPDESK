import z from "zod"

const envSchema = z.object({
  PORT: z.string().default("3000"),
  SECRET: z.string(),
  DATABASE_URL: z.string()
})

export const env = envSchema.parse(process.env)