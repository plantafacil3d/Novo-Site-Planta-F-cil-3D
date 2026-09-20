# Planta Fácil 3D

Antes de uma tarefa de código, leia a skill relevante em `.claude/skills/` (as três só quando a mudança atravessa áreas):

* `arquitetura`: camadas, pastas, dependências e troca de infraestrutura.
* `design-system`: tokens, regras de UX e catálogo de componentes.
* `seguranca`: autenticação, RLS, Storage e dados de usuário.

Siga os checklists de cada skill e mostre a árvore de arquivos antes de mudanças estruturais.

## Comandos

* `npm run dev`: desenvolvimento · `npm run build`: build de produção
* `npm run lint` · `npm run typecheck` · `npm run format`

Antes de dar uma tarefa por concluída, rode `lint`, `typecheck` e, se mexeu em rotas ou config, `build`.

## Ao concluir uma tarefa

Termine com um resumo curto e visual das skills seguidas, com o que foi feito em cada uma. É o feedback para conferir se as regras foram cumpridas.

* Liste só as skills que a tarefa realmente tocou; se uma não se aplicou, omita.
* Um bloco curto por skill, de 2 a 4 linhas: o que foi feito de concreto (arquivo, componente, token), qual regra da skill isso atendeu e por que a decisão foi essa. Detalhado, mas sem texto longo.
* Se algo não foi seguido ou ficou pendente, diga, com o motivo. Não maquie o resumo.
* Use ícones para organizar a leitura. Modelo:

```text
✅ Tarefa concluída · skills seguidas

🏗️ arquitetura
   • Feito: <arquivos criados ou alterados e em qual camada ficaram>
   • Regra atendida: <ex.: dependência só para baixo, reutilizei em vez de criar>
   • Por quê: <a decisão em uma frase>

🎨 design-system
   • Feito: <componentes, variantes ou tokens usados ou criados>
   • Regra atendida: <ex.: só tokens semânticos, catálogo atualizado>
   • Por quê: <a decisão em uma frase>

🔒 seguranca
   • Feito / Regra atendida / Por quê: <mesmo formato>

🧪 Verificação: <lint · typecheck · build, o que rodou e o resultado>
⚠️ Pendências: <só se houver>
```
