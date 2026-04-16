# 🎁 Secret Santa API (NestJS)

> **Objetivo**: API backend orientada a produção para gerenciamento de sorteios de amigo secreto, construída com foco em **arquitetura, resiliência, observabilidade e boas práticas**, alinhada a um contexto de sistemas críticos (ex: crédito e risco).

Este documento funciona como **plano técnico e guia de implementação**.

---

## 📌 Escopo do MVP

### Incluído
- Autenticação básica com JWT
- Criação e gestão de grupos de sorteio
- Gerenciamento de participantes
- Execução de sorteio com regras de negócio claras
- Envio de emails de forma assíncrona
- Observabilidade básica (logs estruturados)
- Documentação via Swagger / OpenAPI
- Ambiente dockerizado

### Fora do escopo (intencional)
- Frontend
- OAuth / Refresh Token
- Lista de presentes
- Painel administrativo
- Deploy em cloud

---

## 🧱 Stack Tecnológica

- **Node.js + TypeScript**
- **NestJS**
- **PostgreSQL** (consistência e transações)
- **Prisma ORM**
- **BullMQ + Redis** (filas)
- **Swagger / OpenAPI**
- **Docker & Docker Compose**
- **Jest** (testes)

---

## 🗂️ Arquitetura Geral

- Monólito modular (preparado para futura extração de serviços)
- Separação clara entre:
  - Controllers (HTTP)
  - Services (regras de negócio)
  - Repositórios (acesso a dados)
- Integrações externas isoladas por abstrações

```text
src/
 ├── modules/
 │   ├── auth/
 │   ├── users/
 │   ├── groups/
 │   ├── draw/
 │   ├── notifications/
 │
 ├── shared/
 │   ├── database/
 │   ├── logger/
 │   ├── errors/
 │
 ├── jobs/
 └── main.ts
```

---

## 🗃️ Modelagem do Banco de Dados

### User
```text
id            UUID (PK)
name          string
email         string (unique)
passwordHash  string
createdAt     timestamp
```

### Group (Sorteio)
```text
id         UUID (PK)
name       string
status     DRAFT | DRAWN
creatorId UUID (FK -> User)
createdAt timestamp
```

### Participant
```text
id       UUID (PK)
userId   UUID (FK -> User)
groupId  UUID (FK -> Group)
```

### DrawResult
```text
id             UUID (PK)
groupId        UUID (FK -> Group)
giverUserId    UUID (FK -> User)
receiverUserId UUID (FK -> User)
```

📌 **Decisão importante**:
- Os pares do sorteio são **persistidos** (não calculados em memória)
- Permite auditoria, idempotência e reenvio de notificações

---

## 🔄 Estados e Regras de Negócio

### Estados do Grupo
- `DRAFT`: participantes podem ser alterados
- `DRAWN`: sorteio realizado, grupo imutável

### Regras
- Mínimo de **3 participantes** para sortear
- Um grupo só pode ser sorteado **uma única vez**
- Participantes não podem ser alterados após `DRAWN`

---

## 🎲 Sorteio (Draw)

### Características
- Executado via endpoint protegido
- Envolvido em **transação no banco**
- Operação idempotente

### Fluxo
```text
POST /groups/:id/draw

1. Valida status = DRAFT
2. Valida quantidade de participantes
3. Executa algoritmo de sorteio
4. Persiste pares
5. Atualiza status para DRAWN
6. Enfileira envio de emails
```

📌 **O sorteio não falha se o email falhar**

---

## 📩 Envio de Email (Assíncrono)

### Estratégia
- Emails são enviados via **fila**
- Worker dedicado para envio
- Retry automático
- DLQ para falhas definitivas

```text
Draw Completed
   ↓
Queue Email Job
   ↓
Worker
   ↓
Email Provider
   ↓
DLQ (se falhar)
```

### Garantias
- Timeout configurado
- Retry com limite
- Falha isolada do fluxo principal

---

## 🔍 Observabilidade

### Logs
- Logger estruturado (JSON)
- CorrelationId por request

### Eventos importantes logados
- Sorteio realizado
- Tentativas de envio de email
- Falhas externas

---

## 📑 API (OpenAPI / Swagger)

- Swagger disponível em `/docs`
- DTOs explícitos
- Respostas de erro padronizadas

### Endpoints principais
```http
POST   /auth/register
POST   /auth/login

POST   /groups
GET    /groups

POST   /groups/:id/participants
DELETE /groups/:id/participants/:userId

POST   /groups/:id/draw
```

---

## 🧪 Testes

### Cobertura mínima
- Sorteio não executa duas vezes
- Sorteio exige mínimo de participantes
- Falha no email não invalida sorteio

---

## 🐳 Docker

### Serviços
- API
- PostgreSQL
- Redis

Executar localmente:
```bash
docker-compose up -d
```

---

## ⚖️ Trade-offs Assumidos

- JWT simples (sem refresh)
- Monólito ao invés de microserviços
- Observabilidade básica

➡️ Escolhas feitas para **velocidade sem comprometer boas práticas**

---

## 🚀 Próximos Passos (fora do escopo)
- Versionamento de API
- OpenTelemetry completo
- Deploy em GCP
- Rate limiting
- Feature flags

---

## 🧠 Nota Final

Este projeto prioriza **clareza arquitetural, decisões explícitas e maturidade de backend**, simulando um sistema real de impacto, mesmo com domínio simples.
