// Provisória: valida tokens e fontes. Será substituída pela view da home.
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center gap-4 bg-inverse-strong px-4 text-fg-inverse">
      <p className="text-xs font-semibold tracking-[0.12em] text-accent uppercase">
        Projetos arquitetônicos prontos
      </p>
      <h1 className="text-4xl">
        Encontre o projeto ideal para o <span className="text-accent">seu sonho</span>
      </h1>
      <span className="rounded-md bg-primary px-4 py-3 font-medium">Botão primário</span>
    </main>
  )
}
