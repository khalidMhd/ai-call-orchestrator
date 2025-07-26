# AI Call Orchestrator

# AI Call Orchestrator

AI Call Orchestrator is a Node.js-based backend system designed to manage outbound AI-generated calls using a queue-based architecture. It utilizes BullMQ (powered by Redis) for job management, PostgreSQL with TypeORM for persistence, and Express.js for HTTP API endpoints.

---

## Features

### Job Queue Management with BullMQ
- Jobs are added to a queue for asynchronous processing.
- Each job simulates an AI phone call with a mock call ID.
- Controls concurrency (e.g., only 30 calls handled simultaneously).
- Retry mechanism: failed jobs are retried up to 3 times with exponential backoff.
- Logs job failures with expiration after retries.
- Jobs are removed after completion or failure (for cleanup).
- Duplicate job prevention and ensures the same call ID is not queued multiple times.

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

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/khalidmhd/ai-call-orchestrator.git
cd ai-call-orchestrator


---

## Features

### Job Queue Management with BullMQ
- Jobs are added to a queue for asynchronous processing.
- Each job simulates an AI phone call with a mock call ID.
- Job concurrency control (e.g., only 30 calls handled simultaneously).
- Retry mechanism: failed jobs are retried up to 3 times with exponential backoff.
- Job failure logging with expiration after retries.

### Job Lifecycle Events
- Tracks job waiting, active, completed, failed, and retried status in the console.
- Uses `on("completed")`, `on("failed")`, `on("waiting")`, `on("active")` event hooks.

### Database Integration
- PostgreSQL database connected via TypeORM.
- Future support for storing job logs and call history.

### Docker Support
- Runs Redis, PostgreSQL, and the Node.js server via Docker Compose.

---

## Tech Stack

| Layer           | Technology        |
|----------------|-------------------|
| Language        | TypeScript        |
| Runtime         | Node.js           |
| Server Framework| Express.js        |
| Queue Manager   | BullMQ            |
| Queue Backend   | Redis             |
| ORM             | TypeORM           |
| Database        | PostgreSQL        |
| Environment     | Docker + Docker Compose |
| Dev Tools       | ts-node-dev, TypeScript |

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/khalidmhd/ai-call-orchestrator.git
cd ai-call-orchestrator

```

### 2. Create a .env file in the root
```bash
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=ai_calls

EXTERNAL_API_URL=https://provider.com/api/v1/calls
CALLBACK_URL=http://localhost:3000/callbacks/call-status
CALLBACK_SECRET=supersecret
MAX_RETRIES=3
MAX_IN_PROGRESS=30

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

```

### 3. Run with Docker

```bash
docker compose up --build

```

### 4. Run Locally Without Docker
```bash
# Make sure Redis and PostgreSQL are running locally
npm install
npm run dev

```

### 5. Run Database Migrations
```bash
npm run migration:generate
npm run migration:run

```
