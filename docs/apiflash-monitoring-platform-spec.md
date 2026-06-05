# apiFlash Monitoring Platform Spec

## 1. Product definition

`apiFlash` deixa de ser apenas um HTTP workbench e vira uma plataforma SaaS de observabilidade para APIs e serviços HTTP.

O produto passa a ter quatro pilares:

1. `API Workbench`
Ambiente manual para testar requisições, reproduzir incidentes, salvar requests e montar diagnósticos.

2. `Monitoring`
Cadastro de endpoints, checks agendados, health checks distribuídos por região, retries, latency tracking, SSL awareness e uptime.

3. `Incidents`
Abertura automática e manual de incidentes, timeline de eventos, ack/resolve, impacto por monitor, postmortem e histórico.

4. `Status Pages`
Páginas públicas ou privadas com uptime, incidentes recentes, componentes, janelas de manutenção e branding por workspace.

O objetivo é posicionar o projeto como um produto profissional na linha de `Postman + Better Stack + UptimeRobot + Statuspage`, mas com foco em DX e visual Dracula.

---

## 2. Positioning

### Core promise

`Know when an API breaks, why it broke, where it broke, and reproduce it immediately.`

### Ideal user

- desenvolvedor solo que precisa monitorar APIs e webhooks
- time pequeno de backend
- startup com múltiplos serviços HTTP
- time de plataforma que precisa de status page e incident flow simples

### Product differentiator

O diferencial do `apiFlash` é unir:

- observabilidade HTTP
- runbook operacional
- incident workflow
- replay/debug manual no mesmo produto

Em vez de ter monitoring de um lado e client HTTP de outro, o monitor vira ponto de entrada para abrir no workbench e reproduzir a falha.

---

## 3. Product scope

### In scope for v1

- auth com GitHub
- workspaces multi-tenant
- monitors HTTP/HTTPS
- checks agendados por intervalo
- execução por regiões
- retries por monitor
- métricas de status e latência
- incidentes automáticos e manuais
- status pages públicas
- alertas por e-mail e webhook
- dashboard com uptime, latency e incident volume
- workbench integrado ao monitor
- RBAC básico

### Out of scope for v1

- monitor de browser/synthetic full-page
- tracing distribuído
- logs centralizados
- SLA contractual billing
- on-call rotations complexas
- SMS/WhatsApp/PagerDuty nativo
- check TCP/UDP/ICMP

Esses pontos podem entrar em v2.

---

## 4. Product architecture

### High-level architecture

O projeto deve continuar como `Next.js` no frontend e backend de produto, mas com módulos explícitos:

- `web app`
Next.js App Router para UI, auth, dashboards, status pages e APIs internas.

- `database`
PostgreSQL para entidades transacionais e agregados operacionais.

- `queue`
Fila para disparo de checks, retries, envio de alertas, atualização de agregados e incident automation.

- `workers`
Processos separados para executar checks HTTP, consolidar métricas e emitir alertas.

- `cron scheduler`
Responsável por enfileirar checks no tempo correto.

- `time-series storage`
Inicialmente PostgreSQL com tabelas append-only e agregados por minuto.
Se crescer, migrar para TimescaleDB sem quebrar o modelo conceitual.

### Recommended stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Framer Motion`
- `Auth.js v5`
- `Prisma 7`
- `PostgreSQL`
- `Redis` para fila e coordenação
- `BullMQ` para jobs
- `Zod` para contracts e validation
- `Resend` ou `Nodemailer` para alertas por e-mail
- `Svix`-style signing própria para webhooks de alertas
- `Recharts` para séries de latência/uptime

### Deployment model

- `web`: Next.js app
- `worker-checks`: executa checks HTTP
- `worker-alerts`: processa dispatch de alertas
- `worker-rollups`: consolida métricas por minuto/hora/dia
- `scheduler`: roda cron e publica jobs na fila

Tudo pode viver no mesmo repositório, mas com entrypoints separados.

---

## 5. Mandatory separation of areas

O projeto deve ser organizado em áreas distintas, tanto no produto quanto no código.

### Public marketing area

Rotas públicas:

- `/`
- `/pricing` opcional no v1
- `/docs`
- `/status/[slug]`

Objetivo:

- explicar o produto
- converter para login
- expor status pages públicas

### Auth area

Rotas:

- `/login`

Baseado diretamente no `dracula-repo-template`.

Requisitos:

- manter `src/auth.ts`
- manter `app/api/auth/[...nextauth]/route.ts`
- manter adapter Prisma
- usar `GitHub` como primeiro provider
- preservar shape de sessão com `session.user.id`

### Protected app area

Rotas dentro de `app/(app)`:

- `/dashboard`
- `/monitors`
- `/monitors/[monitorId]`
- `/incidents`
- `/incidents/[incidentId]`
- `/alerts`
- `/status-pages`
- `/status-pages/[statusPageId]`
- `/workbench`
- `/settings`

### Workbench area

O `workbench` não some. Ele vira um módulo explícito de produto.

Funções:

- testar endpoints manualmente
- importar request a partir de um monitor
- reproduzir falha com headers/body/timeout do monitor
- salvar request como template operacional

O `workbench` precisa ficar separado visualmente de `monitoring`, mas integrado por ações contextuais.

Exemplo:

- botão `Open in Workbench` na tela de monitor
- botão `Replay failing request` no incidente
- botão `Save as monitor` no workbench

---

## 6. Information architecture

### Navigation

#### Top-level nav for authenticated app

- `Dashboard`
- `Monitors`
- `Incidents`
- `Alerts`
- `Status Pages`
- `Workbench`
- `Settings`

#### Secondary navigation inside monitor detail

- `Overview`
- `Checks`
- `Latency`
- `Regions`
- `Incidents`
- `Config`

### Primary user journey

1. user lands on marketing page
2. user logs in with GitHub
3. user creates workspace
4. user creates first monitor
5. scheduler starts checks
6. dashboard begins showing latency and uptime
7. failure triggers retries
8. incident opens automatically if threshold reached
9. alerts are dispatched
10. user opens failing request in workbench
11. user resolves issue
12. incident is resolved
13. public status page reflects resolution

---

## 7. Visual direction

### Design language

Preservar a linha `Dracula`, mas com tratamento mais “infra product” e menos “toy dev tool”.

Direção:

- superfícies escuras com profundidade real
- contraste alto em números e estados operacionais
- neon controlado para estados críticos
- visual de command center
- cards densos, compactos e legíveis

### Color semantics

- `healthy`: green/cyan
- `degraded`: amber
- `incident`: red/pink
- `maintenance`: blue
- `neutral`: dracula comment/slate

### Motion

- stagger leve na entrada do dashboard
- shimmer discreto em loading states
- animated pulse para incidentes ativos
- live ticker suave para checks recentes
- transições rápidas, sem exagero

### Typography

Evitar aspecto genérico. Usar tipografia técnica para métricas e uma família forte para hero e headlines.

Sugestão:

- headline: `Space Grotesk` ou `Sora`
- UI/body: `Inter Tight` ou `Manrope`
- metric mono: `JetBrains Mono`

---

## 8. Landing page spec

### Landing goals

- explicar claramente o que o produto faz
- mostrar que é observabilidade real, não só client HTTP
- vender a integração entre monitoring, incidents e workbench
- converter para login

### Landing structure

#### Section 1: Hero

Headline:
`Monitor APIs, catch incidents fast, replay failures instantly.`

Subheadline:
`apiFlash combines HTTP monitoring, incident workflows, status pages and a built-in workbench for reproducing failures in seconds.`

CTA:

- `Start with GitHub`
- `See live status page`

Hero visual:

- painel com lista de monitores
- gráfico de latência
- incidente ativo
- painel lateral com request replay

#### Section 2: Product pillars

4 blocos:

- `Monitoring`
- `Incidents`
- `Status Pages`
- `Workbench`

#### Section 3: Why it is different

Comparativo narrativo:

- outras ferramentas alertam
- `apiFlash` alerta e já abre contexto reproduzível

#### Section 4: Metrics preview

Exibir mock com:

- uptime %
- p95 latency
- incident count
- region comparison

#### Section 5: Workflow timeline

`Check fails -> retries trigger -> incident opens -> alerts fire -> replay in workbench -> resolve`

#### Section 6: Status page preview

Mock de página pública com componentes e incidente recente.

#### Section 7: Final CTA

Mensagem orientada a tempo de resposta operacional.

### Landing asset prompts for image/animation model

Se for usar um modelo para gerar imagens ou frames de motion, usar prompts controlados.

#### Prompt 1: Hero product mockup

`Create a high-end dark SaaS product mockup for an API monitoring platform named apiFlash. Show a monitoring dashboard with endpoint cards, latency charts, uptime badges, an active incident timeline, and a side panel for HTTP request replay. Visual style: Dracula-inspired but premium, black graphite surfaces, neon cyan, amber and red operational states, crisp typography, subtle glass, no generic purple glow overload, cinematic dashboard composition, desktop-first with mobile companion card.`

#### Prompt 2: Status page mockup

`Generate a polished public status page UI for apiFlash with service components, uptime badges, maintenance banner, incident history and response time sparkline charts. Dark professional infrastructure SaaS aesthetic, Dracula-compatible palette, strong spacing, trustworthy typography, minimal clutter, suitable for a real status product.`

#### Prompt 3: Motion storyboard

`Generate storyboard frames for a SaaS landing page animation: endpoint turns from healthy to degraded, retries appear, incident opens, alert dispatches, engineer replays request in HTTP workbench, status returns to operational. Dark command-center style, premium motion design, readable UI panels, consistent product identity.`

### Landing animation guidance

As animações devem ser implementadas em `Framer Motion`, não em vídeo pesado.

Animações prioritárias:

- cards entrando em cascade
- gráfico de latência desenhando no carregamento
- timeline do incidente expandindo
- request replay panel abrindo lateralmente
- badge de status alternando `operational -> degraded -> resolved`

---

## 9. Login spec

### Auth base

O login deve ser baseado no `dracula-repo-template`, sem reinventar a camada de auth.

Arquivos-base esperados:

- `src/auth.ts`
- `src/prisma.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `prisma/schema.prisma`

### Login behavior

- provider principal: GitHub
- login page pública em `/login`
- se sessão ativa, redirecionar para `/dashboard`
- se sem workspace, redirecionar para onboarding

### Post-login onboarding

Após primeiro login:

1. criar `workspace`
2. escolher nome do workspace
3. escolher slug da status page opcional
4. criar primeiro monitor ou importar do workbench

### RBAC

Papéis mínimos:

- `OWNER`
- `ADMIN`
- `MEMBER`
- `VIEWER`

Permissões:

- owner/admin criam e editam monitores
- member pode operar workbench e reconhecer incidentes
- viewer acessa dashboards e status pages privadas

---

## 10. Dashboard spec

### Dashboard overview

O dashboard principal precisa responder:

- quantos monitores estão saudáveis
- quais incidentes estão ativos
- como a latência mudou hoje
- quais regiões falharam
- qual monitor está mais instável

### Modules

- top summary cards
- active incidents list
- uptime by monitor
- p50/p95/p99 latency chart
- failures by region
- recent check feed
- alert dispatch log
- quick actions

### Summary cards

- `Operational monitors`
- `Active incidents`
- `Global uptime 24h`
- `p95 latency 24h`

### Quick actions

- `New monitor`
- `Open workbench`
- `Create status page`
- `Acknowledge incidents`

---

## 11. Monitoring domain spec

### Monitor types in v1

- `HTTP`
- `HTTPS`

No modelo, ambos podem ser um único tipo `HTTP`, com flags de SSL validation.

### Monitor configuration

Cada monitor deve permitir:

- nome
- descrição
- URL
- método HTTP
- intervalo de check
- timeout
- headers
- auth opcional
- body opcional
- expected status codes
- string matcher opcional
- region set
- retry count
- retry backoff
- SSL validation on/off
- redirect policy
- paused on/off

### Check intervals

Sugestão v1:

- `30s`
- `60s`
- `5m`
- `15m`

### Regions

Modelo conceitual:

- `us-east`
- `us-west`
- `sa-east`
- `eu-west`

No início, se a infra for única, as regiões podem ser lógicas/simuladas por workers identificados. A spec deve manter a abstração de região desde o início.

### Check result capture

Cada execução precisa salvar:

- status final
- HTTP status code
- DNS/connect/TLS/TTFB/total duration quando disponível
- erro normalizado
- região
- tentativa
- timestamp
- response size opcional
- response excerpt truncado

### Health evaluation

Estados:

- `OPERATIONAL`
- `DEGRADED`
- `DOWN`
- `PAUSED`
- `MAINTENANCE`

Regras:

- sucesso dentro do esperado: `OPERATIONAL`
- sucesso com latência acima do threshold: `DEGRADED`
- falha após retries: `DOWN`
- pausado manualmente: `PAUSED`
- em janela declarada: `MAINTENANCE`

---

## 12. Incident domain spec

### Incident creation rules

Incidente automático abre quando:

- X falhas consecutivas ocorrerem em uma ou mais regiões
- ou disponibilidade cair abaixo de threshold em janela curta
- ou monitor entrar em `DOWN`

Incidente manual também deve existir.

### Incident fields

- título
- summary
- severity
- state
- source
- startedAt
- acknowledgedAt
- resolvedAt
- affected monitors
- affected regions
- timeline entries
- impact message para status page

### Incident states

- `OPEN`
- `ACKNOWLEDGED`
- `RESOLVED`
- `POSTMORTEM_PENDING`

### Incident severity

- `SEV1`
- `SEV2`
- `SEV3`
- `SEV4`

### Incident timeline entry types

- `CREATED`
- `AUTO_DETECTED`
- `CHECK_FAILED`
- `RETRY_SCHEDULED`
- `ALERT_SENT`
- `ACKNOWLEDGED`
- `STATUS_PAGE_UPDATED`
- `RESOLVED`
- `POSTMORTEM_ATTACHED`

### Incident automation

Quando um incidente é aberto:

1. registra timeline inicial
2. marca monitores afetados
3. dispara alertas
4. atualiza status page se configurado
5. expõe ação `Open in Workbench`

---

## 13. Alerts spec

### Alert channels for v1

- email
- webhook

### Alert triggers

- incident opened
- incident acknowledged
- incident resolved
- monitor degraded
- monitor recovered
- SSL expiring soon

### Alert routing

Entidades:

- alert policy
- alert channel
- alert subscription

Exemplo:

- `SEV1` vai para webhook + e-mail
- `SEV3` só vai para e-mail

### Retry behavior

Alert dispatch também precisa de retry e dead-letter.

### Webhook payload shape

O webhook deve incluir:

- event type
- workspace
- monitor
- incident
- timestamps
- deep links para dashboard e status page

---

## 14. Status pages spec

### Status page goals

- expor disponibilidade pública
- comunicar incidentes
- comunicar manutenção
- reforçar confiança da operação

### Status page features

- slug customizado
- branding simples
- visibilidade pública ou protegida
- componentes associados a monitores
- status atual por componente
- incident history
- uptime percentual
- maintenance windows

### Status page component states

- `Operational`
- `Degraded performance`
- `Partial outage`
- `Major outage`
- `Maintenance`

### Public route

- `/status/[slug]`

### Incident publishing

Configuração por monitor/status page:

- auto publish on incident open
- manual publish only

---

## 15. Workbench integration spec

### Workbench role in the product

O `workbench` é um diferencial central. Ele deixa de ser uma ferramenta separada e vira braço operacional do monitoring.

### Workbench capabilities

- editar e enviar request manual
- carregar configuração de monitor
- carregar último request de falha
- comparar resposta atual vs resposta esperada
- salvar request em coleção operacional
- converter request em novo monitor

### New workbench scenarios

- `Replay from incident`
- `Replay from monitor`
- `Save request as monitor`
- `Diff current response against last failure`

### Saved operational collections

Nova categoria:

- `Runbooks`

Exemplos:

- health checks críticos
- endpoints de autenticação
- webhooks de parceiros
- requests de diagnóstico pós-incidente

---

## 16. Data model spec

### Auth and base entities

A base de `User`, `Session`, `Account` e `VerificationToken` deve seguir o template.

### New entities

- `Workspace`
- `WorkspaceMember`
- `Monitor`
- `MonitorRegion`
- `MonitorCheck`
- `MonitorStatMinute`
- `MonitorStatHour`
- `Incident`
- `IncidentMonitor`
- `IncidentTimelineEntry`
- `AlertChannel`
- `AlertPolicy`
- `AlertDispatch`
- `StatusPage`
- `StatusPageComponent`
- `MaintenanceWindow`
- `SavedRequest`
- `RequestCollection`

### Prisma model draft

```prisma
enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum MonitorState {
  OPERATIONAL
  DEGRADED
  DOWN
  PAUSED
  MAINTENANCE
}

enum IncidentState {
  OPEN
  ACKNOWLEDGED
  RESOLVED
  POSTMORTEM_PENDING
}

enum IncidentSeverity {
  SEV1
  SEV2
  SEV3
  SEV4
}

enum AlertChannelType {
  EMAIL
  WEBHOOK
}

model Workspace {
  id          String            @id @default(cuid())
  name        String
  slug        String            @unique
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  members     WorkspaceMember[]
  monitors    Monitor[]
  incidents   Incident[]
  statusPages StatusPage[]
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole
  createdAt   DateTime      @default(now())
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

model Monitor {
  id                   String         @id @default(cuid())
  workspaceId          String
  name                 String
  description          String?
  url                  String
  method               String
  timeoutMs            Int
  intervalSeconds      Int
  expectedStatusCodes  Int[]
  expectedBodyContains String?
  requestHeaders       Json?
  requestBody          String?
  authConfig           Json?
  retryCount           Int            @default(0)
  retryBackoffMs       Int            @default(1000)
  followRedirects      Boolean        @default(true)
  validateTls          Boolean        @default(true)
  paused               Boolean        @default(false)
  currentState         MonitorState   @default(OPERATIONAL)
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
  workspace            Workspace      @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  regions              MonitorRegion[]
  checks               MonitorCheck[]
}

model MonitorRegion {
  id        String   @id @default(cuid())
  monitorId String
  region    String
  monitor   Monitor  @relation(fields: [monitorId], references: [id], onDelete: Cascade)

  @@unique([monitorId, region])
}

model MonitorCheck {
  id                String    @id @default(cuid())
  monitorId         String
  region            String
  attempt           Int
  success           Boolean
  state             MonitorState
  statusCode        Int?
  errorCode         String?
  errorMessage      String?
  dnsMs             Int?
  connectMs         Int?
  tlsMs             Int?
  ttfbMs            Int?
  totalMs           Int?
  responseSizeBytes Int?
  responseExcerpt   String?
  checkedAt         DateTime  @default(now())
  monitor           Monitor   @relation(fields: [monitorId], references: [id], onDelete: Cascade)

  @@index([monitorId, checkedAt])
  @@index([region, checkedAt])
}

model MonitorStatMinute {
  id              String   @id @default(cuid())
  monitorId       String
  minuteBucket    DateTime
  checksCount     Int
  successCount    Int
  failureCount    Int
  avgLatencyMs    Int?
  p95LatencyMs    Int?
  p99LatencyMs    Int?

  @@unique([monitorId, minuteBucket])
}

model Incident {
  id             String             @id @default(cuid())
  workspaceId     String
  title           String
  summary         String?
  severity        IncidentSeverity
  state           IncidentState
  source          String
  startedAt       DateTime
  acknowledgedAt  DateTime?
  resolvedAt      DateTime?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  workspace       Workspace          @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  monitors        IncidentMonitor[]
  timelineEntries IncidentTimelineEntry[]
}

model IncidentMonitor {
  id         String   @id @default(cuid())
  incidentId  String
  monitorId   String

  @@unique([incidentId, monitorId])
}

model IncidentTimelineEntry {
  id          String   @id @default(cuid())
  incidentId   String
  type        String
  message     String
  metadata    Json?
  createdAt   DateTime @default(now())

  @@index([incidentId, createdAt])
}

model AlertChannel {
  id          String           @id @default(cuid())
  workspaceId String
  name        String
  type        AlertChannelType
  config      Json
  enabled     Boolean          @default(true)
  createdAt   DateTime         @default(now())
}

model AlertDispatch {
  id             String   @id @default(cuid())
  workspaceId     String
  channelId       String
  eventType      String
  status         String
  attempts       Int      @default(0)
  lastError      String?
  payload        Json
  createdAt      DateTime @default(now())
}

model StatusPage {
  id          String                @id @default(cuid())
  workspaceId String
  name        String
  slug        String                @unique
  isPublic    Boolean               @default(true)
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
  components  StatusPageComponent[]
}

model StatusPageComponent {
  id           String   @id @default(cuid())
  statusPageId String
  monitorId    String?
  name         String
  description  String?
  sortOrder    Int      @default(0)
}
```

### Notes on schema

- manter a base de auth do template
- usar `Json` para configs flexíveis em v1
- separar `raw checks` de `aggregated stats`
- tratar `monitor checks` como tabela append-only

---

## 17. API spec

### Authenticated routes

- `GET /api/workspaces/current`
- `POST /api/workspaces`
- `GET /api/monitors`
- `POST /api/monitors`
- `GET /api/monitors/:id`
- `PATCH /api/monitors/:id`
- `DELETE /api/monitors/:id`
- `POST /api/monitors/:id/pause`
- `POST /api/monitors/:id/resume`
- `POST /api/monitors/:id/run-now`
- `GET /api/monitors/:id/checks`
- `GET /api/monitors/:id/stats`
- `GET /api/incidents`
- `POST /api/incidents`
- `GET /api/incidents/:id`
- `POST /api/incidents/:id/acknowledge`
- `POST /api/incidents/:id/resolve`
- `GET /api/alerts/channels`
- `POST /api/alerts/channels`
- `GET /api/status-pages`
- `POST /api/status-pages`
- `GET /api/status-pages/:id`
- `PATCH /api/status-pages/:id`
- `POST /api/workbench/replay`

### Public routes

- `GET /api/public/status/:slug`

### Internal worker routes

Se necessário, separar internals:

- `POST /api/internal/schedule-checks`
- `POST /api/internal/check-complete`

Idealmente protegidos por secret interno ou executados fora da camada pública.

---

## 18. Worker and queue spec

### Queues

- `monitor-checks`
- `monitor-retries`
- `incident-automation`
- `alert-dispatch`
- `metrics-rollup`

### Scheduler job

Executa a cada minuto:

1. busca monitores ativos
2. calcula checks vencidos
3. cria jobs por monitor/região

### Monitor check worker

Para cada job:

1. monta request do monitor
2. executa HTTP request
3. mede tempos
4. valida response
5. persiste `MonitorCheck`
6. avalia state transition
7. enfileira retry se necessário
8. enfileira automation de incidente
9. enfileira agregação

### Retry rules

- retry só em falha ou timeout
- usar `retryCount`
- aplicar `retryBackoffMs`
- só marcar `DOWN` após esgotar retries

### Rollup worker

Agrega checks brutos em buckets:

- minuto
- hora
- dia

### Alert worker

Processa dispatch:

- e-mail
- webhook

Com:

- retry
- backoff
- dead-letter

---

## 19. Metrics and observability spec

### Product metrics shown to the user

- uptime %
- success/failure counts
- avg latency
- p95 latency
- p99 latency
- failures by region
- incident count by period
- MTTA opcional
- MTTR opcional

### Internal platform observability

O próprio produto precisa observar:

- scheduler drift
- queue depth
- worker failures
- check execution duration
- alert delivery failure rate

Mesmo que v1 não tenha UI completa disso, deve haver logs estruturados.

### Logging

Usar logs estruturados com:

- `workspaceId`
- `monitorId`
- `incidentId`
- `jobId`
- `region`
- `eventType`

---

## 20. Dashboard and page specs by route

### `/`

Landing page premium, orientada a conversão e explicação do produto.

### `/login`

Tela de auth baseada no template, adaptada à identidade do `apiFlash`.

### `/dashboard`

Visão geral operacional do workspace.

### `/monitors`

Lista de monitores com:

- estado atual
- uptime
- p95
- intervalo
- regiões
- último check

### `/monitors/new`

Wizard de criação:

1. basic config
2. request config
3. validation
4. schedule and regions
5. alerts and status page

### `/monitors/[monitorId]`

Seções:

- overview
- latency
- recent checks
- incidents
- config

### `/incidents`

Tabela/lista com filtros:

- active
- acknowledged
- resolved
- severity
- monitor
- region

### `/incidents/[incidentId]`

Conteúdo:

- summary
- severity
- state
- monitors afetados
- regions afetadas
- timeline
- actions
- replay in workbench

### `/alerts`

Gerenciamento de canais e políticas.

### `/status-pages`

Lista e criação de status pages.

### `/status/[slug]`

Página pública de status.

### `/workbench`

Workbench atual evoluído, com integração ao domínio de monitors e incidents.

---

## 21. UX rules

### UX principles

- sempre mostrar estado operacional atual
- priorizar legibilidade de causa e impacto
- dar ação imediata para investigar
- evitar telas vazias sem orientação

### Empty states

Exemplos:

- sem monitores: CTA para criar monitor ou converter request do workbench
- sem incidentes: mostrar baseline de estabilidade
- sem status page: CTA com preview

### Failure states

- erro de rede deve ser explícito
- status code inesperado deve mostrar esperado vs recebido
- timeout deve destacar tempo limite configurado

### Time range controls

Dashboards e monitor detail:

- `1h`
- `24h`
- `7d`
- `30d`

---

## 22. Security and privacy

### Secrets handling

- credenciais de monitor não podem vazar no client
- mascarar secrets em UI e logs
- encrypted-at-rest idealmente em v2, mas ao menos segregados e nunca retornados integralmente pela API

### Access control

- todo endpoint autenticado deve validar `workspace membership`
- nenhuma query por monitor/incidente sem filtro por workspace

### Public status page isolation

- status page pública nunca expõe request headers, body ou detalhes sensíveis do monitor

---

## 23. Implementation structure

### Suggested route grouping

```txt
app/
  (marketing)/
    page.tsx
    docs/page.tsx
    status/[slug]/page.tsx
  (auth)/
    login/page.tsx
  (app)/
    dashboard/page.tsx
    monitors/page.tsx
    monitors/[monitorId]/page.tsx
    incidents/page.tsx
    incidents/[incidentId]/page.tsx
    alerts/page.tsx
    status-pages/page.tsx
    workbench/page.tsx
    settings/page.tsx
  api/
    auth/[...nextauth]/route.ts
    monitors/
    incidents/
    alerts/
    status/
    workbench/
src/
  auth.ts
  prisma.ts
  components/
    marketing/
    auth/
    dashboard/
    monitors/
    incidents/
    alerts/
    status-pages/
    workbench/
  services/
  server/
    monitors/
    incidents/
    alerts/
    status-pages/
    workbench/
    queue/
    scheduler/
  lib/
  hooks/
prisma/
  schema.prisma
workers/
  checks.ts
  alerts.ts
  rollups.ts
  scheduler.ts
```

### Separation rules

- UI components não acessam Prisma direto
- lógica de domínio vai para `src/server`
- route handlers só validam, autenticam e delegam
- workers não dependem de componentes React

---

## 24. Phased roadmap

### Phase 1

- migrar auth/prisma do template
- estruturar áreas `(marketing)`, `(auth)`, `(app)`
- manter workbench funcionando
- criar workspace e onboarding

### Phase 2

- CRUD de monitores
- scheduler
- worker de checks
- persistência de checks brutos

### Phase 3

- dashboard
- métricas agregadas
- monitor detail com gráficos

### Phase 4

- incident automation
- incident timeline
- ack/resolve

### Phase 5

- alert channels
- dispatch worker

### Phase 6

- status pages públicas

### Phase 7

- integração profunda com workbench
- replay from incident
- save workbench request as monitor

---

## 25. MVP acceptance criteria

O MVP está correto quando:

- usuário faz login com GitHub
- usuário cria workspace
- usuário cria monitor HTTP
- scheduler dispara checks
- checks são persistidos com região e latência
- dashboard mostra uptime e p95
- falhas consecutivas abrem incidente
- incidente dispara alerta
- status page pública reflete incidente
- usuário consegue abrir o monitor no workbench

---

## 26. Non-functional requirements

- pages autenticadas devem abrir com boa performance em mobile e desktop
- dashboard principal deve suportar dezenas de monitores sem colapsar UX
- check execution precisa ser idempotente por job
- workers devem tolerar retry sem duplicar incidentes
- rollups devem ser reprocessáveis

---

## 27. Final product statement

`apiFlash` deve parecer um produto de operação real.

O workbench continua existindo, mas deixa de ser o produto inteiro. Ele passa a ser a ferramenta de diagnóstico dentro de uma plataforma maior, com monitoring, incidents, alerting e status pages.

O `dracula-repo-template` deve servir como base do bloco autenticado e de persistência, enquanto a landing e o dashboard precisam elevar o projeto para um nível de SaaS profissional.
