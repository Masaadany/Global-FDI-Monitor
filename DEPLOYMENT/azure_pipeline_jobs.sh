#!/bin/bash
# Deploy data pipeline as Azure Container Apps Jobs (scheduled)
# Run AFTER API is deployed and DB is connected.

set -euo pipefail

RG="fdi-monitor-prod"
ENV="fdi-environment"
REGISTRY="melsaadany"
IMAGE="gfm-pipeline:latest"

DB_URL="${DATABASE_URL}"
REDIS_URL="${REDIS_URL}"

echo "=== Building pipeline image ==="
docker build -t $REGISTRY/gfm-pipeline apps/pipeline/
docker push $REGISTRY/gfm-pipeline

echo "=== Creating scheduled pipeline jobs ==="

# 1. Signal detection — every 15 minutes
az containerapp job create \
  --name gfm-signal-detection \
  --resource-group $RG \
  --environment $ENV \
  --trigger-type Schedule \
  --cron-expression "*/15 * * * *" \
  --image "$REGISTRY/$IMAGE" \
  --cpu 0.5 --memory 1Gi \
  --replica-completion-count 1 --replica-retry-limit 2 \
  --env-vars "DATABASE_URL=$DB_URL" "REDIS_URL=$REDIS_URL" \
  --command "python" --args "collectors/master_pipeline.py" \
  --output none && echo "✓ Signal detection job (15min)"

# 2. World Bank / macro data — daily 02:00 UTC
az containerapp job create \
  --name gfm-macro-data \
  --resource-group $RG \
  --environment $ENV \
  --trigger-type Schedule \
  --cron-expression "0 2 * * *" \
  --image "$REGISTRY/$IMAGE" \
  --cpu 0.5 --memory 1Gi \
  --replica-completion-count 1 --replica-retry-limit 2 \
  --env-vars "DATABASE_URL=$DB_URL" \
  --command "python" --args "collectors/worldbank_v2.py" \
  --output none && echo "✓ Macro data job (daily)"

# 3. Weekly newsletter — every Monday 06:00 UTC
az containerapp job create \
  --name gfm-newsletter \
  --resource-group $RG \
  --environment $ENV \
  --trigger-type Schedule \
  --cron-expression "0 6 * * 1" \
  --image "$REGISTRY/$IMAGE" \
  --cpu 1 --memory 2Gi \
  --replica-completion-count 1 --replica-retry-limit 1 \
  --env-vars "DATABASE_URL=$DB_URL" "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}" \
  --command "python" --args "-c" \
  --args "import asyncio; from super_agent import GFMSuperAgent; asyncio.run(GFMSuperAgent().run({'job':'newsletter'}))" \
  --output none && echo "✓ Newsletter job (weekly)"

# 4. GFR quarterly computation — 1st day of quarter 04:00 UTC
az containerapp job create \
  --name gfm-gfr-compute \
  --resource-group $RG \
  --environment $ENV \
  --trigger-type Schedule \
  --cron-expression "0 4 1 1,4,7,10 *" \
  --image "$REGISTRY/$IMAGE" \
  --cpu 1 --memory 2Gi \
  --replica-completion-count 1 --replica-retry-limit 1 \
  --env-vars "DATABASE_URL=$DB_URL" "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}" \
  --command "python" --args "-c" \
  --args "import asyncio; from super_agent import GFMSuperAgent; asyncio.run(GFMSuperAgent().run({'job':'gfr-compute'}))" \
  --output none && echo "✓ GFR compute job (quarterly)"

echo ""
echo "════════════════════════════════════════"
echo "✓ All pipeline jobs deployed"
echo "  Check: az containerapp job list -g $RG --output table"
echo "════════════════════════════════════════"
