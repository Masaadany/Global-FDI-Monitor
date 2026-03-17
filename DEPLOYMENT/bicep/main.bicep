/**
 * GFM Azure Infrastructure — Bicep IaC
 * Deploys: Container App Environment, API Container App,
 *          PostgreSQL Flexible Server, Redis Cache
 * 
 * Deploy: az deployment group create -g fdi-monitor-prod -f main.bicep -p @main.parameters.json
 */

@description('Environment name')
param envName string = 'prod'

@description('Location')
param location string = 'uaenorth'

@description('Docker Hub image tag')
param apiImage string = 'melsaadany/gfm-api:latest'

@secure()
param dbPassword string

@secure()
param jwtSecret string

@secure()
param stripeKey string = ''

// ── CONTAINER APP ENVIRONMENT ─────────────────────────────────────────────
resource caEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: 'fdi-environment'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
    }
  }
}

// ── API CONTAINER APP ─────────────────────────────────────────────────────
resource apiApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'fdi-backend-api'
  location: location
  properties: {
    managedEnvironmentId: caEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3001
        transport: 'auto'
        corsPolicy: {
          allowedOrigins: ['https://fdimonitor.org','http://localhost:3000']
          allowedMethods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
          allowedHeaders: ['Content-Type','Authorization','X-Stripe-Signature']
        }
      }
      secrets: [
        { name: 'db-password',  value: dbPassword  }
        { name: 'jwt-secret',   value: jwtSecret   }
        { name: 'stripe-key',   value: stripeKey   }
      ]
    }
    template: {
      scale: {
        minReplicas: 1
        maxReplicas: 5
        rules: [
          { name: 'http-scaling', http: { metadata: { concurrentRequests: '20' } } }
        ]
      }
      containers: [
        {
          name: 'api'
          image: apiImage
          resources: { cpu: json('0.25'), memory: '0.5Gi' }
          env: [
            { name: 'NODE_ENV',      value: 'production' }
            { name: 'PORT',          value: '3001' }
            { name: 'DATABASE_URL',  secretRef: 'db-password' }
            { name: 'JWT_SECRET',    secretRef: 'jwt-secret'  }
            { name: 'STRIPE_SECRET_KEY', secretRef: 'stripe-key' }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: { path: '/api/v1/health', port: 3001 }
              initialDelaySeconds: 10
              periodSeconds: 30
            }
          ]
        }
      ]
    }
  }
}

// ── POSTGRESQL FLEXIBLE SERVER ────────────────────────────────────────────
resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'fdi-db-${envName}'
  location: location
  sku: { name: 'Standard_B1ms', tier: 'Burstable' }
  properties: {
    administratorLogin: 'fdiuser'
    administratorLoginPassword: dbPassword
    version: '16'
    storage: { storageSizeGB: 32 }
    backup: { backupRetentionDays: 7, geoRedundantBackup: 'Disabled' }
    highAvailability: { mode: 'Disabled' }
  }
}

// ── AZURE CACHE FOR REDIS ─────────────────────────────────────────────────
resource redis 'Microsoft.Cache/redis@2023-08-01' = {
  name: 'fdi-cache-${envName}'
  location: location
  properties: {
    sku: { name: 'Basic', family: 'C', capacity: 0 }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisConfiguration: {
      'maxmemory-policy': 'allkeys-lru'
    }
  }
}

// ── OUTPUTS ───────────────────────────────────────────────────────────────
output apiUrl string = 'https://${apiApp.properties.configuration.ingress.fqdn}'
output dbHost string = postgres.properties.fullyQualifiedDomainName
output redisHost string = redis.properties.hostName
