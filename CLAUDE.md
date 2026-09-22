# Planta Fácil 3D

Antes de uma tarefa de código, leia a skill relevante em `.claude/skills/` (as três só quando a mudança atravessa áreas):

- `arquitetura`: camadas, pastas, dependências e troca de infraestrutura.
- `design-system`: tokens, regras de UX e catálogo de componentes.
- `seguranca`: autenticação, RLS, Storage e dados de usuário.

Siga os checklists de cada skill e mostre a árvore de arquivos antes de mudanças estruturais.

## Comandos

- `npm run dev`: desenvolvimento · `npm run build`: build de produção
- `npm run lint` · `npm run typecheck` · `npm run format`

Antes de dar uma tarefa por concluída, rode `lint`, `typecheck` e, se mexeu em rotas ou config, `build`.

## Ao concluir uma tarefa

Termine com um feedback curto para conferir se as regras foram cumpridas. Nomeie as skills seguidas e diga, em uma ou duas frases cada, o que foi seguido.

- Liste só as skills que a tarefa realmente tocou; se uma não se aplicou, omita.
- Uma linha por skill (no máximo duas), começando pelo nome da skill e dizendo qual regra foi seguida, com o exemplo concreto. Ex.: "segui a skill de arquitetura: o front-end continua desacoplado do backend".
- Linguagem de leigo esclarecido: simples e direta, sem jargão. Se usar um termo técnico, explique em poucas palavras. Nada de listas de arquivos e hex, salvo se o usuário pedir.
- Se algo não foi seguido ou ficou pendente, diga, com o motivo. Não maquie o resumo.
- Use ícones para organizar a leitura. Modelo:

```text
✅ Tarefa concluída

🏗️ arquitetura: <regra seguida, ex.: o front-end continua desacoplado do backend>
🎨 design-system: <ex.: só usei tokens de cor, sem cor solta; reaproveitei componentes em vez de criar novos>
🔒 seguranca: <regra seguida>

🧪 Verificação: <o que rodou e o resultado, em uma linha>
⚠️ Pendências: <só se houver>
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
