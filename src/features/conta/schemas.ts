import { z } from 'zod'

// Dados de formulário são entrada não confiável (skill `seguranca` §8): validados aqui, no servidor.

export const schemaLogin = z.object({
  email: z.email().max(254),
  senha: z.string().min(1).max(200),
})
