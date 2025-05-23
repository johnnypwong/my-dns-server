# 🚀 My-dns-server

This repository contains a high-performance Fastify backend service managed with [`pnpm`](https://pnpm.io/) and containerized using [`Docker Compose`](https://docs.docker.com/compose/).

---

## 🧱 Tech Stack

- **[Fastify](https://www.fastify.io/)** – Fast and low-overhead web framework for Node.js
- **[pnpm](https://pnpm.io/)** – Fast, disk space-efficient package manager
- **[Docker Compose](https://docs.docker.com/compose/)** – Multi-container Docker environments

---

## 📁 Project Structure

```text
.
├── docker-compose.yml     # Defines services

├── app/
│   ├── server.js          # Fastify server entry point
│   └── routes/            # Route definitions
│   ├── pnpm-lock.yaml     # Lockfile for dependencies
│   ├── package.json       # Scripts and metadata
│   └── Dockerfile         # Docker image for Fastify app
├── mongo/
│   ├── init-mongo.js      # Mongo DB setup script
└── README.md

```

## 🚀 Getting Started

### 🛠 Prerequisites

Make sure the following tools are installed on your system:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

---

### 🐳 Build and Run with Docker Compose

To start the application using Docker Compose:

```bash
docker compose up --build
```

This will start the Fastify server (usually at http://localhost:3000).
# Stop container
```bash
docker compose down
```


# API
### Add DNS Record
```bash
curl --location 'localhost:3000/api/dns' \
--header 'Content-Type: application/json' \
--data '{
    "type": "A",
    "hostname": "example.com",
    "value": "192.168.1.1"
}'
```
or 

```bash
curl --location 'localhost:3000/api/dns' \
--header 'Content-Type: application/json' \
--data '{
    "type": "CNAME",
    "hostname": "alias.example.com",
    "value": "example.com"
}'
```

### Resolve DNS
```bash
curl --location 'localhost:3000/api/dns/alias.example.com'
```

### Get DNS Record

```bash
curl --location 'localhost:3000/api/dns/example.com/records'
```

### Delete DNS Record
```bash
curl --location --request DELETE 'localhost:3000/api/dns/alias.example.com?type=CNAME&value=example.com'
```