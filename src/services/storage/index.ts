import type { FileStorage } from './FileStorage'
import { SupabaseFileStorage } from './SupabaseFileStorage'

export type { ArquivoNoStorage, ArquivoPublico, FileStorage } from './FileStorage'
export const fileStorage: FileStorage = new SupabaseFileStorage()
