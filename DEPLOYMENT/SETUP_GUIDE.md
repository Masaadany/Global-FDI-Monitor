# GFM DEPLOYMENT SETUP GUIDE

## 1. GitHub Secrets Required

Go to: https://github.com/Masaadany/Global-FDI-Monitor/settings/secrets/actions

Add these secrets:

| Secret Name | Value | Where to Get |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://fdi-backend-api.gentleglacier-ae9701ca.uaenorth.azurecontainerapps.io` | Azure Container Apps → Application URL |
| `DOCKERHUB_TOKEN` | Your Docker Hub access token | hub.docker.com → Account Settings → Security |
| `AZURE_CREDENTIALS` | JSON from `az ad sp create-for-rbac` | Run command below |

### Get Azure Credentials:
```bash
az ad sp create-for-rbac \
  --name "gfm-github-actions" \
  --role contributor \
  --scopes /subscriptions/115b83f4-ca12-4944-9d88-dc888767a894/resourceGroups/fdi-monitor-prod \
  --json-auth
```
Copy the entire JSON output as the value of `AZURE_CREDENTIALS`.

---

## 2. Stripe Setup

### Create Products in Stripe Dashboard (dashboard.stripe.com):

**Product 1: Professional Monthly**
- Name: `Global FDI Monitor — Professional`
- Price: `$899.00` · Recurring · Monthly
- Copy Price ID → GitHub Secret: `STRIPE_PRO_MONTHLY_PRICE`

**Product 2: Professional Annual**
- Name: `Global FDI Monitor — Professional Annual`
- Price: `$9,588.00` · Recurring · Yearly
- Copy Price ID → GitHub Secret: `STRIPE_PRO_ANNUAL_PRICE`

**Product 3: Enterprise**
- Name: `Global FDI Monitor — Enterprise`
- Price: `$29,500.00` · Recurring · Yearly
- Copy Price ID → GitHub Secret: `STRIPE_ENT_ANNUAL_PRICE`

**Product 4: FIC Top-up**
- Name: `GFM FIC Credits — 50 pack`
- Price: `$79.00` · One-time
- Copy Price ID → GitHub Secret: `STRIPE_FIC_TOPUP_PRICE`

### Set Stripe keys as Azure Container App env vars:
```bash
az containerapp update \
  --name fdi-backend-api \
  --resource-group fdi-monitor-prod \
  --set-env-vars \
    "STRIPE_SECRET_KEY=sk_live_YOUR_KEY" \
    "STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET"
```

### Add Stripe webhook:
- URL: `https://fdi-backend-api.gentleglacier-ae9701ca.uaenorth.azurecontainerapps.io/api/v1/billing/webhook`
- Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

---

## 3. Database Migration

Run once after API is live:
```bash
cd DEPLOYMENT
DATABASE_URL="postgresql://fdiuser:Ash@#2020@fdi-db-prod-fdimahmoud.postgres.database.azure.com:5432/gfm" \
  node migrate.js
```

---

## 4. Deploy Pipeline Jobs

After API is stable:
```bash
export DATABASE_URL="postgresql://fdiuser:Ash@#2020@fdi-db-prod-fdimahmoud.postgres.database.azure.com:5432/gfm"
export REDIS_URL="rediss://:zsAQ2PmnVMirDuHLUsy84Nl9MsrGwsCDVAzCaGFF2ks=@fdi-cache-prod.redis.cache.windows.net:6380"
export ANTHROPIC_API_KEY="sk-ant-YOUR_KEY"
bash DEPLOYMENT/azure_pipeline_jobs.sh
```

---

## 5. Remove Password Gate (when ready to launch publicly)

Edit `apps/web/src/app/layout.tsx`:
- Remove the `<PreviewGate>` wrapper
- Push to deploy

---

## 6. Add Custom Domain api.fdimonitor.org

In GoDaddy DNS:
| Type | Name | Value |
|---|---|---|
| CNAME | api | fdi-backend-api.gentleglacier-ae9701ca.uaenorth.azurecontainerapps.io |

Then in Azure Container Apps → Custom domains → Add `api.fdimonitor.org`.

---

## 7. Environment Variables Summary

### Azure Container App (API):
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://fdiuser:PASSWORD@fdi-db-prod-fdimahmoud.postgres.database.azure.com:5432/gfm
REDIS_URL=rediss://:PASSWORD@fdi-cache-prod.redis.cache.windows.net:6380
JWT_SECRET=<64-char random string>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ANTHROPIC_API_KEY=sk-ant-...
```

### GitHub Secrets (Frontend):
```
NEXT_PUBLIC_API_URL=https://fdi-backend-api.gentleglacier-ae9701ca.uaenorth.azurecontainerapps.io
AZURE_CREDENTIALS=<JSON from az ad sp create-for-rbac>
DOCKERHUB_TOKEN=<Docker Hub access token>
STRIPE_PRO_MONTHLY_PRICE=price_...
STRIPE_PRO_ANNUAL_PRICE=price_...
STRIPE_ENT_ANNUAL_PRICE=price_...
```
