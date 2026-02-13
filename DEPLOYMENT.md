# Deployment Guide

This guide covers deploying the Quantum Mechanics Playground to various platforms.

## Docker Deployment (Any Platform)

### Prerequisites
- Docker and Docker Compose installed
- Server with ports 80, 443, 8000 available

### Production Deployment

1. Clone the repository
```bash
git clone <your-repo-url>
cd quantum-physics
```

2. Configure environment variables
```bash
cp .env.example quantum-backend/.env
cp quantum-frontend/.env.example quantum-frontend/.env.local
```

3. Start services
```bash
docker-compose up -d
```

4. Verify deployment
```bash
curl http://localhost:8000/
curl http://localhost:3000/
```

### With Reverse Proxy (Nginx/Traefik)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name quantum.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Cloud Platforms

### AWS ECS

1. Build and push images to ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t quantum-backend ./quantum-backend
docker tag quantum-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/quantum-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/quantum-backend:latest

docker build -t quantum-frontend ./quantum-frontend
docker tag quantum-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/quantum-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/quantum-frontend:latest
```

2. Create ECS task definitions and services using the pushed images

### Google Cloud Run

```bash
# Backend
gcloud builds submit --tag gcr.io/PROJECT-ID/quantum-backend ./quantum-backend
gcloud run deploy quantum-backend --image gcr.io/PROJECT-ID/quantum-backend --platform managed

# Frontend
gcloud builds submit --tag gcr.io/PROJECT-ID/quantum-frontend ./quantum-frontend
gcloud run deploy quantum-frontend --image gcr.io/PROJECT-ID/quantum-frontend --platform managed
```

### Azure Container Instances

```bash
# Create resource group
az group create --name quantum-rg --location eastus

# Backend
az container create \
  --resource-group quantum-rg \
  --name quantum-backend \
  --image <your-registry>/quantum-backend:latest \
  --dns-name-label quantum-backend \
  --ports 8000

# Frontend
az container create \
  --resource-group quantum-rg \
  --name quantum-frontend \
  --image <your-registry>/quantum-frontend:latest \
  --dns-name-label quantum-frontend \
  --ports 80
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Backend: Dockerfile at `quantum-backend/Dockerfile`
   - Frontend: Dockerfile at `quantum-frontend/Dockerfile`
3. Set environment variables
4. Deploy

## Kubernetes

### Using kubectl

1. Create namespace
```bash
kubectl create namespace quantum
```

2. Apply manifests (create these based on your needs)
```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

### Using Helm (when chart is created)

```bash
helm install quantum ./helm-chart -n quantum
```

## Environment Variables

### Backend
- `PYTHONUNBUFFERED=1` - Python output buffering
- `LOG_LEVEL` - Logging level (info, debug, warning, error)
- `API_HOST` - Host to bind (default: 0.0.0.0)
- `API_PORT` - Port to bind (default: 8000)

### Frontend
- `VITE_API_URL` - Backend API URL

## Monitoring

### Health Checks

Backend health endpoint:
```bash
curl http://localhost:8000/
```

Frontend health check:
```bash
curl http://localhost:3000/
```

### Logs

View Docker logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Metrics

Consider adding:
- Prometheus for metrics collection
- Grafana for visualization
- ELK stack for log aggregation

## Scaling

### Horizontal Scaling

Update docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      replicas: 3
```

Or use Kubernetes HPA:
```bash
kubectl autoscale deployment quantum-backend --cpu-percent=70 --min=2 --max=10
```

### Vertical Scaling

Adjust resource limits in docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Security Considerations

1. Use HTTPS in production
2. Set up proper CORS origins
3. Use environment variables for secrets
4. Enable rate limiting
5. Regular security updates
6. Use non-root users in containers

## Backup

### Database (if added)
```bash
docker-compose exec backend pg_dump -U user dbname > backup.sql
```

### Configuration
- Backup .env files
- Version control docker-compose.yml
- Document custom configurations

## Troubleshooting

### Container won't start
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Port conflicts
```bash
docker-compose down
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Out of memory
```bash
docker system prune -a
docker volume prune
```

## Rollback

```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose up --build -d
```
