# ═══════════════════════════════════════════════════════════════
# GLOBAL FDI MONITOR — AZURE API DEPLOYMENT
# Deploys apps/api to Azure Container Apps
# Run this ONCE from your local terminal with Azure CLI installed
# Time: ~20 minutes
# Prerequisites: az CLI installed, logged in (az login)
# ═══════════════════════════════════════════════════════════════

#!/usr/bin/env bash
set -euo pipefail

# ── EDIT THESE ────────────────────────────────────────────────
RESOURCE_GROUP="gfm-production"
LOCATION="eastus"
CONTAINER_APP_NAME="gfm-api"
CONTAINER_REGISTRY="gfmregistry"          # Must be globally unique — change if taken
IMAGE_NAME="gfm-api"
IMAGE_TAG="latest"

# From Azure Portal — your PostgreSQL and Redis connection strings
DATABASE_URL="postgresql://gfm_app:DB_PASSWORD_REDACTED@YOUR_POSTGRES_HOST:5432/gfm"
REDIS_URL="rediss://YOUR_REDIS_HOST:6380"

# From Stripe dashboard
STRIPE_SECRET_KEY="sk_live_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"

# From Anthropic console
ANTHROPIC_API_KEY="sk-ant-YOUR_KEY"

# Your JWT secret (generate: openssl rand -hex 64)
JWT_SECRET="YOUR_64_CHAR_SECRET"
# ──────────────────────────────────────────────────────────────

echo "=== GFM Azure API Deployment ==="

# 1. Create resource group if needed
echo "[1/7] Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
echo "✓ Resource group: $RESOURCE_GROUP"

# 2. Create Azure Container Registry
echo "[2/7] Creating container registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_REGISTRY \
  --sku Basic \
  --admin-enabled true \
  --output none
echo "✓ Registry: $CONTAINER_REGISTRY.azurecr.io"

# 3. Build and push Docker image
echo "[3/7] Building and pushing Docker image..."
az acr build \
  --registry $CONTAINER_REGISTRY \
  --image $IMAGE_NAME:$IMAGE_TAG \
  --file apps/api/Dockerfile \
  apps/api/
echo "✓ Image pushed: $CONTAINER_REGISTRY.azurecr.io/$IMAGE_NAME:$IMAGE_TAG"

# 4. Create Container Apps environment
echo "[4/7] Creating Container Apps environment..."
az containerapp env create \
  --name gfm-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --output none
echo "✓ Environment: gfm-env"

# 5. Get registry credentials
REGISTRY_SERVER="$CONTAINER_REGISTRY.azurecr.io"
REGISTRY_USERNAME=$(az acr credential show --name $CONTAINER_REGISTRY --query username -o tsv)
REGISTRY_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY --query passwords[0].value -o tsv)

# 6. Deploy Container App
echo "[5/7] Deploying Container App..."
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment gfm-env \
  --image "$REGISTRY_SERVER/$IMAGE_NAME:$IMAGE_TAG" \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD \
  --target-port 3001 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 5 \
  --cpu 1 \
  --memory 2Gi \
  --env-vars \
    NODE_ENV=production \
    PORT=3001 \
    DATABASE_URL="$DATABASE_URL" \
    REDIS_URL="$REDIS_URL" \
    JWT_SECRET="$JWT_SECRET" \
    STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
    STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET" \
    ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
  --output none
echo "✓ Container App deployed"

# 7. Get the API URL
echo "[6/7] Getting API URL..."
API_URL=$(az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  -o tsv)

echo ""
echo "════════════════════════════════════════"
echo "✓ AZURE API DEPLOYMENT COMPLETE"
echo "════════════════════════════════════════"
echo ""
echo "  API URL: https://$API_URL"
echo ""
echo "NEXT STEPS:"
echo "  1. Add DNS CNAME record:"
echo "     api.fdimonitor.org → $API_URL"
echo ""
echo "  2. Add GitHub Secret:"
echo "     NEXT_PUBLIC_API_URL = https://$API_URL"
echo "     (or https://api.fdimonitor.org once DNS propagates)"
echo ""
echo "  3. Test the API:"
echo "     curl https://$API_URL/api/v1/health"
echo "     Expected: {\"status\":\"ok\"}"
echo ""
echo "  4. Run database migration:"
echo "     az containerapp job create \\"
echo "       --name gfm-migrate \\"
echo "       --resource-group $RESOURCE_GROUP \\"
echo "       --environment gfm-env \\"
echo "       --image $REGISTRY_SERVER/$IMAGE_NAME:$IMAGE_TAG \\"
echo "       --replica-completion-count 1 \\"
echo "       --env-vars DATABASE_URL=\"$DATABASE_URL\" ADMIN_EMAIL=admin@fdimonitor.org"
