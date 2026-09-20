import { redirect } from 'next/navigation'

/** O Dashboard ainda não existe: `/admin` leva à única aba funcional. */
export default function AdminPage() {
  redirect('/admin/projetos')
}
