# 🎁 Secret Santa API

API backend para gerenciamento de sorteios de **Amigo Secreto**, desenvolvida com foco em **arquitetura, regras de negócio, resiliência e qualidade de código**.

---

## 🧠 O que essa API resolve?

- Criação de grupos de amigo secreto
- Gerenciamento de participantes
- Execução segura do sorteio
- Garantia de que ninguém tira a si mesmo
- Persistência do resultado do sorteio
- Envio de notificações por email de forma assíncrona
- Proteção contra execuções duplicadas
- Isolamento de falhas externas (email não quebra o sorteio)

Tudo isso com autenticação, documentação e ambiente dockerizado.

---

## 🧩 Principais habilidades demonstradas

- Modelagem de domínio e regras de negócio
- Uso de NestJS com arquitetura modular
- Prisma ORM com transações e constraints reais
- Autenticação JWT
- Processamento assíncrono com BullMQ + Redis
- Workers e filas com retry e backoff
- Logs estruturados e correlation id
- Testes unitários focados em comportamento
- Docker para ambiente local previsível
- Swagger/OpenAPI bem documentado

---

## 🛠️ Stack utilizada

- Node.js + TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- BullMQ + Redis
- Swagger / OpenAPI
- Docker & Docker Compose
- Jest

---

## 🗂️ Organização do projeto

Estrutura:

```text
src/
 ├── auth/
 ├── users/
 ├── groups/
 ├── draw/
 ├── notifications/
 ├── infra/
 │   ├── database/
 │   ├── queue/
 │   └── logger/
 └── main.ts
```
---

## 🗃️ Modelo de dados (resumo)

### User
- id
- name
- email
- passwordHash

### Group
- id
- name
- status (DRAFT | DRAWN)
- creatorId

### Participant
- userId
- groupId

### DrawResult
- groupId
- giverUserId
- receiverUserId

**Decisão importante**  
O resultado do sorteio é persistido, não recalculado.  
Isso garante idempotência, auditoria e reenvio de notificações.

---

## 🎲 Sorteio (core do sistema)

O sorteio é a principal regra de negócio.

### Regras
- Grupo precisa estar em DRAFT
- Mínimo de participantes
- Só o criador pode executar
- Um grupo só pode ser sorteado uma vez

### Fluxo

POST /groups/:id/draw

1. Valida permissões
2. Valida estado do grupo
3. Executa algoritmo de sorteio
4. Persiste os pares (transação)
5. Atualiza status para DRAWN
6. Enfileira envio de emails

Falha no envio de email **não invalida o sorteio**.

---

## 📩 Emails e processamento assíncrono

- Envio via fila (BullMQ)
- Worker dedicado
- Retry automático
- Backoff
- Falhas isoladas do fluxo principal

Fluxo:

Sorteio concluído  
→ Job na fila  
→ Worker  
→ Email  
→ Retry / DLQ se falhar  

---

## 🔍 Observabilidade

- Logs estruturados em JSON
- Correlation ID por request
- Logs de sorteio, envio de email e falhas externas

---

## 📑 Documentação da API

Swagger disponível em:

http://localhost:3000/docs

Principais endpoints:

POST /auth/login  
POST /users/create-user  
GET  /users/me  
POST /groups  
GET  /groups  
POST /groups/:id/participants  
POST /groups/:id/draw  

---

## 🧪 Testes

Cobertura focada em regras críticas:

- Sorteio não executa duas vezes
- Sorteio exige mínimo de participantes
- Falha no email não quebra o fluxo
- Algoritmo de sorteio validado isoladamente

---

## 🐳 Executando localmente

```bash
docker-compose up -d
```

Serviços:
- API
- PostgreSQL
- Redis

---

## ⚖️ Trade-offs assumidos

- JWT simples (sem refresh token)
- Monólito modular
- Observabilidade básica

---

## 🚀 Próximos passos

- Rate limiting
- Versionamento de API
- OpenTelemetry
- Deploy em cloud

---