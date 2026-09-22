import type { FileStorage } from './FileStorage'
import { SupabaseFileStorage } from './SupabaseFileStorage'

export type { ArquivoNoStorage, FileStorage } from './FileStorage'
export const fileStorage: FileStorage = new SupabaseFileStorage()
