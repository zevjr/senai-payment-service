# senai-payment-service

Disciplina: **Desenvolvimento de Sistemas Móveis e Distribuídos**

Projeto de microsserviços para processamento de pagamentos da empresa fictícia **CompreFácil**, utilizando arquitetura distribuída com comunicação assíncrona via RabbitMQ.

---

## Arquitetura

```
┌──────────────────────┐        ┌──────────────┐        ┌──────────────────────────┐
│  ms-payment-service  │───────▶│   RabbitMQ   │───────▶│  ms-notification-service │
│     (porta 3001)     │        │  (porta 5672)│        │      (porta 3002)         │
└──────────────────────┘        └──────────────┘        └──────────────────────────┘
          │
          ▼
   ┌─────────────┐
   │  PostgreSQL │
   │ (porta 5432)│
   └─────────────┘
```

### Fluxo de Processamento

```
1. Cliente envia POST /transactions
2. Payment Service salva transação com status PENDING no PostgreSQL
3. Payment Service publica mensagem na fila transaction.received
4. Notification Service consome a fila e exibe log de recebimento
5. Payment Service atualiza status para SUCCESS no PostgreSQL
6. Payment Service publica mensagem na fila transaction.confirmed
7. Notification Service consome a fila e exibe log de confirmação
```

---

## Tecnologias

| Serviço | Tecnologias |
|---|---|
| ms-payment-service | NestJS, TypeScript, Prisma, PostgreSQL, amqplib |
| ms-notification-service | NestJS, TypeScript, amqplib |
| Infraestrutura | Docker, Docker Compose, PostgreSQL, RabbitMQ |

---

## Estrutura de Pastas

```
senai-payment-service/
├── docker-compose.yml
├── README.md
├── ms-payment-service/
│   ├── Dockerfile
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── app.controller.ts
│       ├── prisma/
│       │   └── prisma.service.ts
│       ├── payment/
│       │   ├── payment.module.ts
│       │   ├── payment.controller.ts
│       │   ├── payment.service.ts
│       │   ├── payment.repository.ts
│       │   └── dto/
│       │       └── create-transaction.dto.ts
│       └── messaging/
│           ├── messaging.module.ts
│           └── messaging.service.ts
└── ms-notification-service/
    ├── Dockerfile
    ├── .env.example
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── app.controller.ts
        ├── notification/
        │   ├── notification.module.ts
        │   └── notification.service.ts
        └── messaging/
            └── messaging.consumer.ts
```

---

## Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

---

## Execução com Docker (recomendado)

Na pasta raiz do projeto (`senai-payment-service/`), execute:

```bash
docker-compose up --build
```

Todos os serviços sobem automaticamente na ordem correta:
1. PostgreSQL e RabbitMQ (com health checks)
2. ms-payment-service (após o banco estar saudável)
3. ms-notification-service (após o RabbitMQ estar saudável)

Para parar os serviços:

```bash
docker-compose down
```

Para remover também os volumes de dados:

```bash
docker-compose down -v
```

---

## Execução Local (desenvolvimento)

### Pré-requisitos adicionais

- Node.js 20+
- PostgreSQL e RabbitMQ em execução (ou via Docker apenas a infra)

### Subir apenas a infraestrutura

```bash
docker-compose up postgres rabbitmq -d
```

### ms-payment-service

```bash
cd ms-payment-service
cp .env.example .env
npm install
npx prisma migrate deploy
npm run start:dev
```

### ms-notification-service

```bash
cd ms-notification-service
cp .env.example .env
npm install
npm run start:dev
```

---

## Endpoints da API

### ms-payment-service (porta 3001)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status do serviço |
| GET | `/transactions/test` | Dispara transação de teste completa |
| GET | `/transactions` | Lista todas as transações |
| GET | `/transactions/:id` | Busca transação por ID |
| POST | `/transactions` | Cria transação customizada |

### ms-notification-service (porta 3002)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status do serviço |

### Exemplo — Criar transação

```bash
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 150.00, "description": "Compra de produto X"}'
```

**Resposta (201):**

```json
{
  "id": "uuid-gerado",
  "amount": 150,
  "description": "Compra de produto X",
  "status": "SUCCESS",
  "createdAt": "2026-04-26T21:00:00.000Z",
  "updatedAt": "2026-04-26T21:00:00.000Z"
}
```

### Exemplo — Rota de teste (browser)

```
GET http://localhost:3001/transactions/test
```

---

## Verificando as Notificações

As notificações são exibidas nos logs do `ms-notification-service`:

```bash
docker-compose logs -f notification-service
```

Saída esperada:

```
[NotificationService] [NOTIFICAÇÃO] Solicitação de transação recebida | ID: abc-123 | Valor: R$ 150.00 | Descrição: Compra de produto X | Status: PENDING
[NotificationService] [NOTIFICAÇÃO] Transação confirmada com sucesso | ID: abc-123 | Valor: R$ 150.00 | Descrição: Compra de produto X | Status: SUCCESS
```

---

## Painel do RabbitMQ

Acesse: [http://localhost:15672](http://localhost:15672)

- **Usuário:** `dsmd`
- **Senha:** `dsmd123`

---

## Critérios de Avaliação Atendidos

| Critério | Status |
|---|---|
| Serviços independentes | ✅ Dois serviços NestJS separados em containers independentes |
| Comunicação assíncrona via mensageria | ✅ RabbitMQ com amqplib |
| Fluxo de processamento completo | ✅ PENDING → publicação → consumo → SUCCESS → publicação → consumo |
