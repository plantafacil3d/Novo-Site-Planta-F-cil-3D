import { z } from 'zod'

// Id vindo do cliente (clique no coração) é entrada não confiável (skill `seguranca` §8).
export const schemaProjetoId = z.uuid()
