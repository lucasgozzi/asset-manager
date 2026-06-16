# Asset Manager

Sistema de gerenciamento de brinquedos inflaveis e equipamentos de animacao infantil.

## Contexto do negocio

Empresa de brinquedos inflaveis e animacao de criancas. O sistema permite cadastrar brinquedos, registrar sua entrada no barracao apos eventos com flags de estado, e acompanhar o calendario de manutencao/limpeza.

## Stack

- **Framework:** Next.js 15 + TypeScript (front e back)
- **Estilo:** Tailwind CSS, mobile-first (uso primario no browser do celular)
- **Banco de dados:** Supabase (PostgreSQL + Storage para fotos)
- **Deploy:** Vercel

## Funcionalidades do MVP

### Cadastro de brinquedos
- Nome, foto, categoria
- Prazo maximo de dias sem limpeza (por brinquedo)
- Flags de estado ao registrar armazenagem: molhado, rasgado, faltando peca, precisa de atencao, ok

### Armazenagem
- Registrar entrada no barracao com data e flags de estado
- Campo de observacoes livres
- Fluxo simples: tudo registrado de uma vez pelo colaborador

### Dashboard de manutencao
- Lista de brinquedos ordenada por urgencia de limpeza
- Indicador visual por proximidade do prazo (verde / amarelo / vermelho)
- Data maxima de limpeza visivel por brinquedo

### Primeiro acesso
- Cadastro basico (nome + empresa) salvo em localStorage
- Sem autenticacao formal no MVP

## Decisoes de design

- Sem login/autenticacao no MVP; identidade do usuario salva em cookie ou localStorage
- Roles de usuario existem no modelo de dados mas nao sao usadas no MVP
- Rastreamento de ciclo completo (saida/retorno de eventos) fora do escopo por ora
- Reset do calendario de limpeza: a definir apos feedback do cliente
- ~100+ brinquedos esperados

## Convencoes de codigo

- Portugues para nomes de dominio (ex: `brinquedo`, `armazenagem`), ingles para codigo tecnico
- Componentes em `src/components/`, paginas em `src/app/`
- Server Actions para mutacoes, Route Handlers apenas quando necessario
- Variaveis de ambiente no `.env.local` (nunca commitadas)
