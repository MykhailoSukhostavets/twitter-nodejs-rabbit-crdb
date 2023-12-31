# NODEJS RABBITMQ BD SSE Project

## Overview

This repository is a testing ground for integrating various technologies including Node.js, RabbitMQ, CockroachDB, and Server-Sent Events (SSE). It's designed to explore the capabilities of these technologies and how they can be combined in a Dockerized environment.

## Technologies Used

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **RabbitMQ**: An open-source message broker software that originally implemented the Advanced Message Queuing Protocol (AMQP).
- **CockroachDB**: A cloud-native SQL database for building global, scalable cloud services that survive disasters.
- **Docker**: A set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the Application

To start the application, execute the following command:

```bash
sh start.sh
```

This will spin up the necessary Docker containers as defined in the `docker-compose.yml` file. The services included are:

- **CockroachDB Nodes**: Three instances of CockroachDB running in a cluster.
- **RabbitMQ**: RabbitMQ service for message queuing.
- **Worker**: A Node.js worker service interacting with RabbitMQ and CockroachDB.
- **REST API**: A Node.js REST API service.
