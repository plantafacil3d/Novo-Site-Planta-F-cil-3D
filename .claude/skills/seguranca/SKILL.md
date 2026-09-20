---
name: seguranca
description: Regras de segurança para aplicações web com React + Supabase. Use ao criar ou alterar autenticação, autorização, RLS, rotas protegidas, Storage, uploads, Edge Functions, integrações externas ou dados de usuário.
---

# Segurança

Esta skill define **como proteger o sistema**. Complementa `arquitetura` e não repete regras de organização do código.

**Princípio central:** tudo vindo do navegador é não confiável. Segurança real deve ser garantida no servidor, banco ou infraestrutura confiável.

## 1. Fronteiras

```text
Navegador → UI e validação de UX
Backend/Edge Function → segredos, operações privilegiadas e integrações protegidas
Banco/RLS → autorização dos dados
```

## 2. Segredos

* Nunca expor segredos no front-end, bundle, Git ou logs.
* Variáveis do front-end são públicas.
* `service_role`, tokens privados e chaves secretas ficam somente no backend/secrets.
* `.env` real nunca vai para o Git; use `.env.example`.
* Segredo vazado = revogar e substituir.

## 3. Autenticação e autorização

* Use o sistema oficial de Auth.
* Nunca implemente senha/token manualmente.
* Não confiar em estado local para provar autenticação.
* Autenticação e autorização são coisas diferentes.
* Papéis e permissões nunca devem depender de dados que o usuário possa alterar.
* Operações sensíveis podem exigir reautenticação.

## 4. RLS e banco

* Toda tabela acessível ao cliente deve ter RLS e Policies adequadas.
* Conceda somente o acesso necessário por operação.
* Use `auth.uid()` e regras do servidor para validar propriedade.
* Nunca confie em `user_id` enviado pelo cliente.
* Dados como papel, permissões e status sensíveis não devem ser alterados pelo cliente sem validação do servidor.
* Evite Policies excessivamente permissivas.
* Teste acesso permitido e negado.

## 5. Rotas e URLs

* Rotas privadas exigem autenticação.
* Rotas administrativas exigem autenticação e autorização.
* Guard de rota no front é UX, não segurança.
* IDs e parâmetros da URL são entrada não confiável.
* Toda operação deve verificar autorização do recurso no servidor.
* Impedir acesso a recursos de outro usuário alterando IDs.
* Redirecionamentos devem aceitar somente destinos permitidos.
* Bloquear esquemas perigosos, como `javascript:`.

## 6. Storage e uploads

* Arquivos privados usam buckets e Policies privadas.
* Controle upload, leitura, alteração e exclusão.
* Nunca confiar no caminho enviado pelo cliente para autorizar acesso.
* Validar tamanho, extensão e MIME type.
* Gerar nomes de arquivos controlados pela aplicação.
* Arquivos privados devem usar acesso temporário quando necessário.

## 7. Edge Functions e integrações

Qualquer operação que exija segredo, privilégio elevado ou autorização que não possa ser burlada deve passar pelo backend/Edge Function.

```text
Front → Service → Edge Function → Serviço externo
```

* Validar entrada no servidor.
* Autorizar no servidor.
* Nunca expor credenciais privadas.
* Erros internos não devem vazar para o cliente.
* Webhooks devem validar assinatura e ser idempotentes.

## 8. Entrada e conteúdo

* Toda entrada do usuário é não confiável.
* Validar dados no servidor.
* Sanitizar conteúdo HTML antes de renderizar.
* Evitar `dangerouslySetInnerHTML` com conteúdo não confiável.
* Nunca usar `eval` ou `new Function`.
* SQL sempre parametrizado.
* Não expor stack trace, tokens ou detalhes internos ao usuário.

## 8.1 Consultas e volume

Uma consulta sem limite também é um risco de segurança: quem pede "tudo" (ou uma página gigante) pode derrubar o banco e o site. Organização da paginação em `arquitetura` §3.1.

* Página, tamanho, busca, filtro e ordenação vêm da URL e são não confiáveis. Valide com Zod no servidor: `pagina` inteiro ≥ 1; `porPagina` com **teto fixo** (ex.: 48); texto de busca com tamanho máximo (ex.: 100).
* O teto vale no servidor/repository, não só na tela. Sem página ou tamanho válidos, use o padrão em vez de erro.
* Ordenação e filtro só por campos de uma lista permitida; nunca aceite nome de coluna vindo do cliente.
* Texto do usuário não vira filtro montado à mão (ex.: `.or()` do Supabase com o texto concatenado): use os métodos parametrizados.
* Vale igual para o painel administrativo, que também exige autenticação e autorização (§5).

* Usar HTTPS.
* Configurar cabeçalhos de segurança em `headers()` do `next.config.ts`: CSP, HSTS, `X-Content-Type-Options` e `Referrer-Policy`. Modelo em `stack.md`.

## 9.1 Servidor e cliente no Next.js

* Só variáveis `NEXT_PUBLIC_*` chegam ao navegador; todo o resto fica no servidor. Segredo nunca leva o prefixo `NEXT_PUBLIC_`.
* Código com segredo ou `service_role` importa `server-only`, para o build falhar se ele vazar para um componente cliente.
* Server Actions e Route Handlers são endpoints públicos: valide a entrada (Zod), autentique e autorize em cada um.
* Não passe do servidor para componentes cliente mais dados do que a tela precisa; props de componentes cliente vão para o navegador.
* Verifique o usuário no servidor; `middleware` sozinho não é autorização.
* Páginas privadas ou por usuário: `noindex` e sem cache compartilhado.
* CSP deve liberar somente os recursos realmente utilizados.

## 10. Testes de segurança

Sempre testar:

```text
Sem login → negar
Sem permissão → negar
Com permissão → permitir
Usuário A → não acessa recurso de B
ID/URL alterado → autorização continua sendo verificada
```

Também testar RLS, Storage, rotas e Edge Functions quando existirem.

## Checklist

* [ ] Nenhum segredo no front, Git ou logs?
* [ ] Autenticação correta?
* [ ] Autorização no servidor?
* [ ] RLS/Policies corretas?
* [ ] Recursos protegidos contra acesso por outro usuário?
* [ ] Storage protegido?
* [ ] Entradas e uploads validados?
* [ ] Listagens com teto de itens por página e parâmetros validados no servidor?
* [ ] Integrações com segredo protegidas?
* [ ] HTTPS e cabeçalhos adequados?
* [ ] Cenários permitidos e negados testados?

**O front-end controla a experiência. O backend e o banco controlam a segurança.**
