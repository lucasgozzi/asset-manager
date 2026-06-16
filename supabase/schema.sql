-- Asset Manager Schema

-- Categorias de brinquedos
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz default now()
);

-- Brinquedos
create table brinquedos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria_id uuid references categorias(id) on delete set null,
  foto_url text,
  prazo_max_dias_sem_limpeza int not null default 30,
  ativo boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Flags possiveis ao registrar armazenagem
-- molhado | rasgado | faltando_peca | precisa_atencao | ok
create type flag_estado as enum (
  'ok',
  'molhado',
  'rasgado',
  'faltando_peca',
  'precisa_atencao',
  'sujo'
);

-- Registros de armazenagem no barracao
create table armazenagens (
  id uuid primary key default gen_random_uuid(),
  brinquedo_id uuid not null references brinquedos(id) on delete cascade,
  data_entrada date not null default current_date,
  flags flag_estado[] not null default '{"ok"}',
  observacoes text,
  registrado_por text, -- nome do colaborador (vem do localStorage)
  created_at timestamptz default now()
);

-- Registros de limpeza (para resetar o calendario)
create table limpezas (
  id uuid primary key default gen_random_uuid(),
  brinquedo_id uuid not null references brinquedos(id) on delete cascade,
  data_limpeza date not null default current_date,
  registrado_por text,
  observacoes text,
  created_at timestamptz default now()
);

-- Indices para queries frequentes
create index idx_armazenagens_brinquedo on armazenagens(brinquedo_id);
create index idx_armazenagens_data on armazenagens(data_entrada desc);
create index idx_limpezas_brinquedo on limpezas(brinquedo_id);
create index idx_limpezas_data on limpezas(data_limpeza desc);

-- View: estado atual de cada brinquedo (ultima armazenagem + ultima limpeza)
create view estado_brinquedos as
select
  b.id,
  b.nome,
  b.foto_url,
  b.prazo_max_dias_sem_limpeza,
  c.nome as categoria,
  a.data_entrada as ultima_entrada,
  a.flags as flags_atual,
  a.observacoes as observacoes_atual,
  l.data_limpeza as ultima_limpeza,
  -- Data limite para proxima limpeza
  coalesce(l.data_limpeza, a.data_entrada) + b.prazo_max_dias_sem_limpeza * interval '1 day' as data_limite_limpeza,
  -- Dias restantes ate o prazo
  extract(day from (
    coalesce(l.data_limpeza, a.data_entrada) + b.prazo_max_dias_sem_limpeza * interval '1 day'
  ) - current_date)::int as dias_restantes
from brinquedos b
left join categorias c on c.id = b.categoria_id
left join lateral (
  select * from armazenagens
  where brinquedo_id = b.id
  order by data_entrada desc
  limit 1
) a on true
left join lateral (
  select * from limpezas
  where brinquedo_id = b.id
  order by data_limpeza desc
  limit 1
) l on true
where b.ativo = true;

-- Dados iniciais de categorias
insert into categorias (nome) values
  ('Castelo Inflavel'),
  ('Piscina de Bolinhas'),
  ('Touro Mecanico'),
  ('Escorregador'),
  ('Cama Elastica'),
  ('Outros');
