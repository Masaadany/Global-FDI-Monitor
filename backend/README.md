# Global FDI Monitor — AI Agent Pipeline

## Complete 6-Stage AI Agent System

### Quick Start
```bash
pip install aiohttp beautifulsoup4 psycopg2-binary redis openai
python fdi_agents.py
```

### Pipeline Stages
- **AGT-01** — Data Collection (1000+ official sources, 195+ countries)
- **AGT-02** — Signal Detection & SCI Scoring (PLATINUM/GOLD/SILVER/BRONZE)
- **AGT-03** — SHA-256 Verification & Provenance
- **AGT-04** — GOSA Scoring Engine (4-layer formula)
- **AGT-05** — GFR Ranking & PDF Report Generation
- **AGT-06** — Weekly Newsletter Generation

### SCI Formula
`SCI = Source Authority (30%) + Signal Type Impact (25%) + Recency (20%) + Geographic Breadth (15%) + Content Confidence (10%)`

### GOSA Formula
`GOSA = (0.30×L1) + (0.20×L2) + (0.25×L3) + (0.25×L4)`

### GFR Formula
`GFR = (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)`

### Azure Deployment
```bash
docker build -t gfm-agents .
az containerapp create --name fdi-agents-api --resource-group fdi-monitor-prod --image gfm-agents
```
