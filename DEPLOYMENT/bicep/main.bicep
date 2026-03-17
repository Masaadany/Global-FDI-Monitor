// GFM Azure Infrastructure — UAE North
// Container Apps + PostgreSQL + Redis
targetScope = 'resourceGroup'

@description('Azure region')
param location string = 'uaenorth'

@description('Environment name (used as prefix)')
param environmentName string = 'fdi-monitor-prod'

param apiImageName     string = 'melsaadany/gfm-api:latest'
param agentsImageName  string = 'melsaadany/gfm-agents:latest'
param databaseName     string = 'gfm'
param databaseUser     string = 'fdiuser'

@secure()
param databasePassword  string
@secure()
param jwtSecret         string
@secure()
param stripeSecretKey   string = ''
@secure()
param stripeWebhookSecret string = ''
@secure()
param anthropicApiKey   string = ''
@secure()
param resendApiKey      string = ''

param previewPassword   string = 'GFM2026PREVIEW'
param apiMinReplicas    int    = 1
param apiMaxReplicas    int    = 5
param agentsMinReplicas int    = 0
param agentsMaxReplicas int    = 3

// ── CONTAINER APPS ENVIRONMENT ─────────────────────────────────────────────
resource caEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${environmentName}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'azure-monitor'
    }
  }
}

// ── API CONTAINER APP ──────────────────────────────────────────────────────
resource apiApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'fdi-backend-api'
  location: location
  properties: {
    managedEnvironmentId: caEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3001
        transport: 'http'
        corsPolicy: {
          allowedOrigins: ['https://fdimonitor.org', 'https://www.fdimonitor.org']
          allowedMethods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
          allowedHeaders: ['*']
        }
      }
      secrets: [
        { name: 'jwt-secret',          value: jwtSecret }
        { name: 'stripe-key',          value: stripeSecretKey }
        { name: 'stripe-webhook',      value: stripeWebhookSecret }
        { name: 'anthropic-key',       value: anthropicApiKey }
        { name: 'resend-key',          value: resendApiKey }
        { name: 'db-password',         value: databasePassword }
        { name: 'preview-password',    value: previewPassword }
      ]
    }
    template: {
      containers: [{
        name: 'gfm-api'
        image: apiImageName
        resources: { cpu: json('0.5'), memory: '1Gi' }
        env: [
          { name: 'NODE_ENV',                    value: 'production' }
          { name: 'PORT',                        value: '3001' }
          { name: 'JWT_SECRET',                  secretRef: 'jwt-secret' }
          { name: 'STRIPE_SECRET_KEY',           secretRef: 'stripe-key' }
          { name: 'STRIPE_WEBHOOK_SECRET',       secretRef: 'stripe-webhook' }
          { name: 'ANTHROPIC_API_KEY',           secretRef: 'anthropic-key' }
          { name: 'RESEND_API_KEY',              secretRef: 'resend-key' }
          { name: 'NEXT_PUBLIC_PREVIEW_PASSWORD',secretRef: 'preview-password' }
        ]
      }]
      scale: {
        minReplicas: apiMinReplicas
        maxReplicas: apiMaxReplicas
        rules: [{
          name: 'http-scaling'
          http: { metadata: { concurrentRequests: '50' } }
        }]
      }
    }
  }
}

// ── AGENTS CONTAINER APP ───────────────────────────────────────────────────
resource agentsApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'fdi-agents'
  location: location
  properties: {
    managedEnvironmentId: caEnv.id
    configuration: {
      ingress: {
        external: false
        targetPort: 8080
      }
      secrets: [
        { name: 'anthropic-key', value: anthropicApiKey }
      ]
    }
    template: {
      containers: [{
        name: 'gfm-agents'
        image: agentsImageName
        resources: { cpu: json('0.5'), memory: '1Gi' }
        env: [
          { name: 'AGENT_SERVER_MODE', value: 'true' }
          { name: 'AGENT_PORT',        value: '8080' }
          { name: 'ANTHROPIC_API_KEY', secretRef: 'anthropic-key' }
        ]
      }]
      scale: {
        minReplicas: agentsMinReplicas
        maxReplicas: agentsMaxReplicas
      }
    }
  }
}

// ── OUTPUTS ────────────────────────────────────────────────────────────────
output apiUrl    string = 'https://${apiApp.properties.configuration.ingress.fqdn}'
output agentsUrl string = agentsApp.name
