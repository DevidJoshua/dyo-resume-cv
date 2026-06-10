#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${STACK_NAME:-devid-porto}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
ENV_FILE="${ENV_FILE:-.env}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }

cleanup() {
  if [ $? -ne 0 ]; then
    error "Deployment failed. Check the logs above."
  fi
}
trap cleanup EXIT

# ---------- Prerequisites ----------
if ! command -v docker &>/dev/null; then
  error "Docker is not installed."
  exit 1
fi

if ! docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q active; then
  warn "Docker Swarm is not initialized. Run 'docker swarm init' first."
  warn "Attempting to initialize swarm..."
  docker swarm init 2>/dev/null || {
    error "Failed to initialize Swarm. Are you a manager node?"
    exit 1
  }
  info "Swarm initialized."
fi

# ---------- Load environment ----------
if [ -f "$ENV_FILE" ]; then
  info "Loading environment from $ENV_FILE"
  set -a; source "$ENV_FILE"; set +a
else
  warn "$ENV_FILE not found. Using defaults (not recommended for production)."
fi

# ---------- Pull images ----------
info "Pulling images from Docker Hub..."
docker pull "devid11/devid-porto-backend:latest"
docker pull "devid11/devid-porto-frontend:latest"
docker pull "mysql:8.0"

# ---------- Create secrets (if not exist) ----------
_create_secret() {
  local name="$1"
  local value="$2"
  if ! docker secret ls --format '{{.Name}}' | grep -q "^${name}$"; then
    echo "$value" | docker secret create "$name" -
    info "Created secret: $name"
  else
    info "Secret already exists: $name"
  fi
}

# Uncomment below to use Docker secrets instead of env vars:
# _create_secret "db_root_password"    "${MYSQL_ROOT_PASSWORD:-root}"
# _create_secret "db_password"         "${MYSQL_PASSWORD:-dyo_pass}"
# _create_secret "jwt_secret"          "${JWT_SECRET:-devid-porto-jwt-secret-key-2024}"

# ---------- Deploy stack ----------
info "Deploying stack '$STACK_NAME'..."
docker stack deploy \
  --prune \
  --with-registry-auth \
  -c "$COMPOSE_FILE" \
  "$STACK_NAME"

info "Deployment complete!"
info ""
info "Services:"
docker stack services "$STACK_NAME" --format "table {{.Name}}\t{{.Mode}}\t{{.Replicas}}\t{{.Image}}"

info ""
info "Monitor with:  docker stack ps $STACK_NAME"
info "Logs:          docker service logs ${STACK_NAME}_backend"
info "               docker service logs ${STACK_NAME}_frontend"
