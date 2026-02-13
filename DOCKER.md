# Docker Setup Guide

This project includes Docker configurations for easy deployment and development.

## Quick Start with Docker

### Production Build

Build and run both frontend and backend:

```bash
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Individual Services

### Backend Only

```bash
cd quantum-backend
docker build -t quantum-backend .
docker run -p 8000:8000 quantum-backend
```

### Frontend Only

```bash
cd quantum-frontend
docker build -t quantum-frontend .
docker run -p 3000:80 quantum-frontend
```

## Docker Compose Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Rebuild and start
```bash
docker-compose up --build
```

### View logs
```bash
docker-compose logs -f
```

### View specific service logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Configuration

### Environment Variables

Create `.env` files for custom configuration:

**Backend (.env in quantum-backend/):**
```env
PYTHONUNBUFFERED=1
LOG_LEVEL=info
```

**Frontend (.env in quantum-frontend/):**
```env
VITE_API_URL=http://localhost:8000
```

### Ports

Default ports can be changed in `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8000:8000"  # Change first number for host port
  frontend:
    ports:
      - "3000:80"    # Change first number for host port
```

## Development vs Production

### Development (docker-compose.dev.yml)
- Hot reload enabled
- Source code mounted as volumes
- Faster iteration
- Frontend on port 5173
- Uses Vite dev server

### Production (docker-compose.yml)
- Optimized builds
- No source code mounting
- Nginx serving static files
- Frontend on port 3000
- Better performance

## Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -ti:8000
# Kill the process
kill -9 <PID>
```

### Clear Docker cache
```bash
docker-compose down -v
docker system prune -a
```

### Rebuild without cache
```bash
docker-compose build --no-cache
docker-compose up
```

### Check container status
```bash
docker-compose ps
```

### Access container shell
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Health Checks

Both services include health checks:
- Backend: Checks if API responds at root endpoint
- Frontend: Checks if Nginx is serving content

View health status:
```bash
docker-compose ps
```

## Networks

Services communicate through a Docker network:
- Production: `quantum-network`
- Development: `quantum-network-dev`

Frontend can access backend at `http://backend:8000` within the network.
