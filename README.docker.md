# Docker Setup

This project includes Docker Compose configurations for both production and development environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Production

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development

```bash
# Build and start with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

## Services

- **Backend**: FastAPI application on port 8000
- **Frontend**: React application on port 3000 (dev) or 80 (production)

## Environment Variables

### Backend

Create `backend/.env` with required configuration:

```env
NEXTCLOUD_URL=http://localhost:8080
NEXTCLOUD_USERNAME=your_username
NEXTCLOUD_PASSWORD=your_password
SMTP_HOST=smtp.example.com
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_password
SMTP_FROM_EMAIL=noreply@example.com
NOTIFICATION_EMAILS=["admin@example.com"]
CORS_ORIGINS=["http://localhost:3000"]
SECRET_KEY=your-secret-key
API_TOKEN=your-api-token
```

### Frontend

For development, set environment variables in `docker-compose.dev.yml` or create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_TOKEN=your-api-token
```

## Building

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Rebuild without cache
docker-compose build --no-cache
```

## Troubleshooting

### Port conflicts

If ports 8000 or 3000 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Change host port
```

### View service logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Access container shell

```bash
# Backend
docker-compose exec backend /bin/bash

# Frontend
docker-compose exec frontend /bin/sh
```

### Clean up

```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

