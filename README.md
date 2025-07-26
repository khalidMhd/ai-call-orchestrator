# AI Call Orchestrator

AI Call Orchestrator is a Node.js-based backend system designed to manage outbound AI-generated calls using a queue-based architecture. It utilizes BullMQ (powered by Redis) for job management, PostgreSQL with TypeORM for persistence, and Express.js for HTTP API endpoints.

---

## Features

### Job Queue Management with BullMQ
- Jobs are added to a queue for asynchronous processing.
- Each job simulates an AI phone call with a mock call ID.
- Controls concurrency (e.g., only 30 calls handled simultaneously).
- Retries failed jobs up to 3 times with exponential backoff.
- Avoids duplicate in-flight calls per phone number.
- Jobs are removed after completion or failure.
- Receives completion status from external provider.
- Verifies authenticity (HMAC).

### Job Lifecycle Events
- Tracks job events: `waiting`, `active`, `completed`, `failed`, and `retried`.
- Uses event listeners like `on("completed")`, `on("failed")`, etc., in workers.

### Database Integration
- PostgreSQL connected via TypeORM.
- Migration support enabled.

### Worker (BullMQ)
- Background worker processes jobs in the queue.
- Handles exponential backoff and retry strategy.
- Logs job lifecycle and errors.

### Error Handling
- Global error handler to catch unhandled exceptions.
- Returns meaningful error messages in JSON format.
- 404 handler for unknown routes.

### Docker Support
- Runs Redis, PostgreSQL, and Node.js app using Docker Compose.
- `.env` file used for configuration.

---

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Queue Manager**: BullMQ
- **Queue Backend**: Redis
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Environment**: Docker + Docker Compose
- **Dev Tools**: ts-node-dev, TypeScript

---

## Remarks and Design Decisions

1. **Why BullMQ is the right choice over Kafka in current scenario?**  
   BullMQ is preferred because it provides built-in concurrency control and retry mechanisms that suit job orchestration out of the box. It allows faster development with minimal setup and works seamlessly with Redis and Node.js.  
   Kafka, while powerful for high-throughput event streaming, adds unnecessary complexity and is overkill for this use case.

2. **External API Call Simulation**  
   The external AI-Call API call behavior is simulated within the codebase. The actual call to the external API is currently commented out with detailed comments explaining the expected flow and assumptions made. This helps demonstrate intended integration without depending on an external service.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/khalidmhd/ai-call-orchestrator.git
cd ai-call-orchestrator
cp .env.example .env
```

### 2. Run with Docker

```bash
docker compose up --build

```

### 3. Run Locally Without Docker
```bash
# Make sure Redis and PostgreSQL are running locally
npm install
npm run dev

```

### 4. Run Database Migrations
```bash
npm run migration:generate
npm run migration:run

```
