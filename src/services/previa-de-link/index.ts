import 'server-only'

import { HttpLeitorDePrevia } from './HttpLeitorDePrevia'
import type { LeitorDePrevia } from './LeitorDePrevia'

export type { FotoDaPrevia, LeitorDePrevia, PreviaDoLink } from './LeitorDePrevia'
export const leitorDePrevia: LeitorDePrevia = new HttpLeitorDePrevia()
