import { SupabaseAuthService } from './SupabaseAuthService'
import type { AuthService } from './AuthService'

export type { AuthService, UsuarioLogado } from './AuthService'
export const authService: AuthService = new SupabaseAuthService()
