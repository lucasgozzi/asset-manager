---
name: project-asset-manager
description: Asset Manager — sistema de gerenciamento de brinquedos inflaveis para empresa de animacao infantil
metadata:
  type: project
---

Sistema para cadastrar brinquedos, registrar armazenagem no barracao e acompanhar calendario de limpeza.

**Why:** Cliente precisa controlar quando cada brinquedo precisa de limpeza apos eventos.

**How to apply:** Nao adicionar features nao solicitadas — cliente vai pedindo incrementalmente apos ver o MVP.

## Stack decidida
- Next.js 15 + TypeScript
- Tailwind CSS (mobile-first, uso no browser do celular)
- Supabase (PostgreSQL + Storage para fotos)
- Vercel (deploy)

## Estado atual (MVP criado)
- Schema SQL em `supabase/schema.sql` — ainda nao aplicado no Supabase real
- Paginas: `/bem-vindo`, `/` (home), `/brinquedos`, `/brinquedos/novo`, `/armazenar`, `/manutencao`
- Sem autenticacao — nome+empresa salvo em localStorage
- View `estado_brinquedos` no Postgres calcula dias restantes para limpeza automaticamente

## Pendente antes do primeiro deploy
1. Criar projeto no Supabase e rodar `supabase/schema.sql`
2. Criar bucket `fotos` no Supabase Storage (public)
3. Preencher `.env.local` com URL e anon key do Supabase
4. Deploy na Vercel

## Proximos passos apos feedback do cliente
- Tela de detalhe do brinquedo (`/brinquedos/[id]`)
- Reset manual do calendario de limpeza (quem registra e quando)
- Historico de armazenagens por brinquedo
- Roles de usuario (admin vs colaborador)
