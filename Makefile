# ==============================================================================
# RFIDS-X (Tactical RF Defense Architecture)
# Production & Development Automation
# ==============================================================================

.PHONY: help setup dev build start docker-up docker-down typecheck clean

# ------------------------------------------------------------------------------
# Default Target: Help
help: ## Display this hyper-advanced help screen
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ------------------------------------------------------------------------------
# Core Setup
setup: ## Initialize PNPM workspace and restore dependencies
	@echo "=> Initializing tactical dependencies..."
	npm install -g pnpm@latest
	pnpm install --frozen-lockfile --ignore-scripts
	@echo "=> Setup complete. System ready."

# ------------------------------------------------------------------------------
# Local Development
dev: ## Start the Vite UI sandbox on port 5173 (run the API separately with make start)
	@echo "=> Booting UI sandbox in dev mode..."
	PORT=5173 BASE_PATH=/ pnpm --filter "./artifacts/mockup-sandbox" run dev

build: ## Compile TS and bundle UI via Vite for Production
	@echo "=> Compiling and Minifying binaries..."
	pnpm run build

start: ## Start the compiled Node.js backend cluster
	@echo "=> Igniting Production API Node..."
	NODE_ENV=production PORT=8080 node artifacts/api-server/dist/index.js

# ------------------------------------------------------------------------------
# Containerization & Microservices
docker-up: ## Launch entire RFIDS-X suite in isolated Docker containers
	@echo "=> Orchestrating Docker containers..."
	docker-compose up -d --build
	@echo "=> RFIDS-X Cluster is ONLINE."

docker-down: ## Tear down the RFIDS-X container cluster
	@echo "=> Shutting down tactical containers..."
	docker-compose down

# ------------------------------------------------------------------------------
# Quality Assurance
typecheck: ## Run strictly-typed Typescript definitions test across workspace
	pnpm run typecheck

clean: ## Scour unneeded node_modules, build outputs, and cache
	@echo "=> Scrubbing temporary artifacts..."
	rm -rf node_modules
	rm -rf artifacts/*/node_modules
	rm -rf lib/*/node_modules
	rm -rf artifacts/*/dist
	rm -rf lib/*/dist
	@echo "=> Clean complete."
