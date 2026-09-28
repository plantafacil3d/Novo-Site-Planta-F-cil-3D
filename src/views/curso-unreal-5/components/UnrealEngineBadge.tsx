/** Selo "Unreal Engine 5.6": gradiente rosa→roxo e o "u" itálico do logotipo da engine. */
export function UnrealEngineBadge({ label }: { label: string }) {
  return (
    <span className="text-white inline-flex items-center gap-2 rounded-md bg-linear-to-r from-[var(--course-badge-from)] to-[var(--course-badge-to)] px-4 py-2 text-sm font-bold">
      <span className="font-serif text-lg leading-none italic">u</span>
      {label}
    </span>
  )
}
