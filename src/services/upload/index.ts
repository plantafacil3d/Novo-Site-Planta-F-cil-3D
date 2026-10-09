import type { FileUploader } from './FileUploader'
import { SupabaseFileUploader } from './SupabaseFileUploader'

export type { FileUploader } from './FileUploader'
export { reduzirImagem } from './reduzirImagem'
export const fileUploader: FileUploader = new SupabaseFileUploader()
