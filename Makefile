.PHONY: help dev prod stop clean logs test

help:
	@echo "Quantum Mechanics Playground - Make Commands"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make dev          - Start development environment (hot-reload)"
	@echo "  make prod         - Start production environment"
	@echo "  make stop         - Stop all containers"
	@echo "  make clean        - Stop and remove containers, volumes"
	@echo "  make logs         - View logs from all services"
	@echo "  make logs-backend - View backend logs"
	@echo "  make logs-frontend- View frontend logs"
	@echo ""
	@echo "Local Development:"
	@echo "  make local-backend - Run backend locally"
	@echo "  make local-frontend- Run frontend locally"
	@echo ""
	@echo "Utilities:"
	@echo "  make test         - Run tests (when implemented)"
	@echo "  make rebuild      - Rebuild containers without cache"

# Docker commands
dev:
	docker-compose -f docker-compose.dev.yml up

prod:
	docker-compose up --build

stop:
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

clean:
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

rebuild:
	docker-compose build --no-cache
	docker-compose up

# Local development
local-backend:
	cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000

local-frontend:
	cd frontend && npm run dev

# Testing (placeholder)
test:
	@echo "Tests not yet implemented"
