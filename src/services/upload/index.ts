import type { FileUploader } from './FileUploader'
import { SupabaseFileUploader } from './SupabaseFileUploader'

export type { FileUploader } from './FileUploader'
export const fileUploader: FileUploader = new SupabaseFileUploader()
