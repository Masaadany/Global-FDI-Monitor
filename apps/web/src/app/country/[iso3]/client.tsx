'use client';
import { useState } from 'react';
import Link from 'next/link';

// Full economy database
const ECONOMY_DB: Record<string, any> = {
  ARE: { name:'United Arab Emirates', capital:'Abu Dhabi', region:'MENA', income:'High', pop_m:10, currency:'AED', lang:'Arabic', tz:'GMT+4', gfr:80.0, macro:82, policy:78, digital:84, human:54, infra:92, sustain:53, ires:84, ims:94, sci:92, fzii:90, pai:88, gci:87, fdi_inflows:30.7, fdi_stocks:198, greenfield:18.2, ma:7.1, avg_project_m:45, jobs_yr:125000, free_zones:46, gdp_b:504, pop_b:10, tier:'FRONTIER',
    top_sources:[{c:'USA',pct:35,b:8.9},{c:'India',pct:22,b:5.6},{c:'UK',pct:15,b:3.8},{c:'France',pct:12,b:3.0},{c:'Germany',pct:8,b:2.0}],
    top_sectors:[{s:'Technology',pct:45,b:11.4},{s:'Renewables',pct:23,b:5.8},{s:'Finance',pct:14,b:3.5},{s:'Healthcare',pct:10,b:2.5},{s:'Logistics',pct:8,b:2.0}],
    top_projects:[{co:'Microsoft',amt:'$850M',type:'Cloud Region',city:'Dubai',yr:2026},{co:'AWS',amt:'$5.3B',type:'Expansion',city:'UAE',yr:2026},{co:'Google',amt:'$1B',type:'Cloud',city:'Dubai',yr:2026},{co:'BlackRock',amt:'$500M',type:'Platform',city:'DIFC',yr:2026}] },
  SAU: { name:'Saudi Arabia', capital:'Riyadh', region:'MENA', income:'High', pop_m:36, currency:'SAR', lang:'Arabic', tz:'GMT+3', gfr:68.1, macro:74, policy:62, digital:72, human:48, infra:76, sustain:50, ires:79, ims:85, sci:80, fzii:72, pai:76, gci:78, fdi_inflows:28.3, fdi_stocks:284, greenfield:22.1, ma:6.2, avg_project_m:68, jobs_yr:180000, free_zones:36, gdp_b:1069, tier:'HIGH',
    top_sources:[{c:'USA',pct:28,b:7.9},{c:'China',pct:22,b:6.2},{c:'UK',pct:14,b:4.0},{c:'France',pct:10,b:2.8},{c:'Japan',pct:8,b:2.3}],
    top_sectors:[{s:'Renewables',pct:38,b:10.7},{s:'Technology',pct:28,b:7.9},{s:'Tourism',pct:16,b:4.5},{s:'Manufacturing',pct:12,b:3.4},{s:'Mining',pct:6,b:1.7}],
    top_projects:[{co:'AWS',amt:'$5.3B',type:'Cloud',city:'Riyadh',yr:2026},{co:'ACWA Power',amt:'$4.2B',type:'Solar',city:'NEOM',yr:2026},{co:'Google',amt:'$1B',type:'Cloud',city:'Riyadh',yr:2026},{co:'Lucid Motors',amt:'$3.8B',type:'EV Factory',city:'King Abdullah City',yr:2025}] },
  IND: { name:'India', capital:'New Delhi', region:'SAS', income:'LMI', pop_m:1430, currency:'INR', lang:'Hindi/English', tz:'GMT+5:30', gfr:62.3, macro:68, policy:56, digital:59, human:69, infra:65, sustain:38, ires:68, ims:74, sci:72, fzii:58, pai:64, gci:70, fdi_inflows:71.0, fdi_stocks:520, greenfield:48.2, ma:22.8, avg_project_m:32, jobs_yr:980000, free_zones:285, gdp_b:3730, tier:'MEDIUM',
    top_sources:[{c:'USA',pct:24,b:17.0},{c:'Singapore',pct:18,b:12.8},{c:'UK',pct:14,b:9.9},{c:'Netherlands',pct:10,b:7.1},{c:'Japan',pct:8,b:5.7}],
    top_sectors:[{s:'Technology',pct:42,b:29.8},{s:'Manufacturing',pct:22,b:15.6},{s:'Renewables',pct:18,b:12.8},{s:'Finance',pct:10,b:7.1},{s:'Retail',pct:8,b:5.7}],
    top_projects:[{co:'Apple',amt:'$1.5B',type:'Manufacturing',city:'Chennai',yr:2026},{co:'Samsung',amt:'$880M',type:'Expansion',city:'Noida',yr:2025},{co:'Vestas',amt:'$420M',type:'Wind Factory',city:'Rajasthan',yr:2026},{co:'Google',amt:'$2B',type:'Infrastructure',city:'Mumbai',yr:2025}] },
  SGP: { name:'Singapore', capital:'Singapore', region:'EAP', income:'High', pop_m:6, currency:'SGD', lang:'English', tz:'GMT+8', gfr:88.5, macro:87, policy:91, digital:87, human:63, infra:94, sustain:62, ires:89, ims:96, sci:94, fzii:92, pai:90, gci:88, fdi_inflows:141.2, fdi_stocks:1840, greenfield:88.4, ma:52.8, avg_project_m:82, jobs_yr:42000, free_zones:8, gdp_b:501, tier:'FRONTIER',
    top_sources:[{c:'USA',pct:32,b:45.2},{c:'Japan',pct:18,b:25.4},{c:'Netherlands',pct:14,b:19.8},{c:'UK',pct:10,b:14.1},{c:'China',pct:8,b:11.3}],
    top_sectors:[{s:'Finance',pct:38,b:53.7},{s:'Technology',pct:28,b:39.5},{s:'Manufacturing',pct:16,b:22.6},{s:'Logistics',pct:10,b:14.1},{s:'Biotech',pct:8,b:11.3}],
    top_projects:[{co:'NVIDIA',amt:'$4.4B',type:'AI Data Centre',city:'Singapore',yr:2026},{co:'Databricks',amt:'$150M',type:'APAC HQ',city:'Singapore',yr:2026},{co:'Pfizer',amt:'$900M',type:'Biotech',city:'Tuas',yr:2025},{co:'AWS',amt:'$2B',type:'Expansion',city:'Singapore',yr:2025}] },
  VNM: { name:'Vietnam', capital:'Hanoi', region:'EAP', income:'LMI', pop_m:98, currency:'VND', lang:'Vietnamese', tz:'GMT+7', gfr:58.2, macro:62, policy:58, digital:55, human:52, infra:58, sustain:48, ires:62, ims:66, sci:64, fzii:56, pai:60, gci:63, fdi_inflows:18.1, fdi_stocks:220, greenfield:14.8, ma:3.3, avg_project_m:18, jobs_yr:320000, free_zones:18, gdp_b:430, tier:'MEDIUM',
    top_sources:[{c:'Korea',pct:32,b:5.8},{c:'Japan',pct:24,b:4.3},{c:'China',pct:18,b:3.3},{c:'Singapore',pct:12,b:2.2},{c:'USA',pct:8,b:1.4}],
    top_sectors:[{s:'Manufacturing',pct:64,b:11.6},{s:'Technology',pct:16,b:2.9},{s:'Real Estate',pct:10,b:1.8},{s:'Wholesale',pct:6,b:1.1},{s:'Energy',pct:4,b:0.7}],
    top_projects:[{co:'Samsung',amt:'$2.8B',type:'Semiconductor',city:'Thai Nguyen',yr:2026},{co:'Toyota',amt:'$2.1B',type:'Assembly',city:'Vinh Phuc',yr:2025},{co:'LG',amt:'$1.4B',type:'Electronics',city:'Haiphong',yr:2025},{co:'Foxconn',amt:'$1.0B',type:'Assembly',city:'Bac Ninh',yr:2024}] },
  IDN: { name:'Indonesia', capital:'Jakarta', region:'EAP', income:'LMI', pop_m:277, currency:'IDR', lang:'Indonesian', tz:'GMT+7', gfr:57.1, macro:60, policy:56, digital:54, human:52, infra:58, sustain:52, ires:60, ims:62, sci:60, fzii:52, pai:58, gci:58, fdi_inflows:22.0, fdi_stocks:188, greenfield:16.4, ma:5.6, avg_project_m:24, jobs_yr:280000, free_zones:20, gdp_b:1371, tier:'MEDIUM',
    top_sources:[{c:'Singapore',pct:28,b:6.2},{c:'China',pct:22,b:4.8},{c:'Japan',pct:18,b:4.0},{c:'Netherlands',pct:10,b:2.2},{c:'USA',pct:8,b:1.8}],
    top_sectors:[{s:'Manufacturing',pct:38,b:8.4},{s:'Mining',pct:28,b:6.2},{s:'Finance',pct:14,b:3.1},{s:'Infrastructure',pct:12,b:2.6},{s:'Technology',pct:8,b:1.8}],
    top_projects:[{co:'CATL',amt:'$3.2B',type:'Battery Gigafactory',city:'Karawang',yr:2026},{co:'BYD',amt:'$1.8B',type:'EV Assembly',city:'Karawang',yr:2025},{co:'Hyundai',amt:'$1.5B',type:'EV Factory',city:'Bekasi',yr:2024},{co:'LG Energy',amt:'$4.1B',type:'Battery',city:'Karawang',yr:2024}] },
  DEU: { name:'Germany', capital:'Berlin', region:'ECA', income:'High', pop_m:84, currency:'EUR', lang:'German', tz:'GMT+1', gfr:78.1, macro:81, policy:86, digital:78, human:70, infra:84, sustain:77, ires:82, ims:88, sci:89, fzii:85, pai:84, gci:82, fdi_inflows:35.4, fdi_stocks:780, greenfield:22.8, ma:12.6, avg_project_m:48, jobs_yr:95000, free_zones:6, gdp_b:4430, tier:'HIGH',
    top_sources:[{c:'USA',pct:28,b:9.9},{c:'Netherlands',pct:18,b:6.4},{c:'France',pct:12,b:4.2},{c:'UK',pct:10,b:3.5},{c:'Japan',pct:8,b:2.8}],
    top_sectors:[{s:'Manufacturing',pct:32,b:11.3},{s:'Technology',pct:26,b:9.2},{s:'Finance',pct:18,b:6.4},{s:'Renewables',pct:14,b:4.9},{s:'Pharma',pct:10,b:3.5}],
    top_projects:[{co:'TSMC',amt:'$11B',type:'Semiconductor Fab',city:'Dresden',yr:2025},{co:'Intel',amt:'$17B',type:'Chip Factory',city:'Magdeburg',yr:2024},{co:'Amazon',amt:'$9B',type:'Cloud',city:'Frankfurt',yr:2024},{co:'CATL',amt:'$2B',type:'Battery Plant',city:'Erfurt',yr:2024}] },
  EGY: { name:'Egypt', capital:'Cairo', region:'MENA', income:'LMI', pop_m:105, currency:'EGP', lang:'Arabic', tz:'GMT+2', gfr:52.4, macro:55, policy:48, digital:52, human:48, infra:58, sustain:42, ires:56, ims:58, sci:56, fzii:48, pai:52, gci:54, fdi_inflows:9.8, fdi_stocks:124, greenfield:7.4, ma:2.4, avg_project_m:22, jobs_yr:120000, free_zones:9, gdp_b:395, tier:'MEDIUM',
    top_sources:[{c:'UAE',pct:28,b:2.7},{c:'Saudi Arabia',pct:22,b:2.2},{c:'UK',pct:14,b:1.4},{c:'Netherlands',pct:10,b:1.0},{c:'USA',pct:8,b:0.8}],
    top_sectors:[{s:'Renewables',pct:32,b:3.1},{s:'Real Estate',pct:24,b:2.4},{s:'Manufacturing',pct:18,b:1.8},{s:'Finance',pct:14,b:1.4},{s:'Pharma',pct:12,b:1.2}],
    top_projects:[{co:'Siemens Energy',amt:'$340M',type:'Wind JV',city:'Gulf of Suez',yr:2026},{co:'ACWA Power',amt:'$2.8B',type:'Wind+Solar',city:'NEOM link',yr:2025},{co:'Amazon',amt:'$150M',type:'Cloud',city:'Cairo',yr:2025},{co:'TotalEnergies',amt:'$500M',type:'Solar',city:'Aswan',yr:2024}] },
  NGA: { name:'Nigeria', capital:'Abuja', region:'SSA', income:'LMI', pop_m:218, currency:'NGN', lang:'English', tz:'GMT+1', gfr:42.1, macro:46, policy:36, digital:42, human:40, infra:36, sustain:36, ires:44, ims:48, sci:44, fzii:38, pai:40, gci:42, fdi_inflows:4.1, fdi_stocks:98, greenfield:2.8, ma:1.3, avg_project_m:14, jobs_yr:48000, free_zones:38, gdp_b:477, tier:'EMERGING',
    top_sources:[{c:'UK',pct:28,b:1.1},{c:'Netherlands',pct:22,b:0.9},{c:'USA',pct:18,b:0.7},{c:'France',pct:12,b:0.5},{c:'China',pct:8,b:0.3}],
    top_sectors:[{s:'Oil & Gas',pct:42,b:1.7},{s:'Finance',pct:22,b:0.9},{s:'Manufacturing',pct:14,b:0.6},{s:'Telecoms',pct:12,b:0.5},{s:'Agriculture',pct:10,b:0.4}],
    top_projects:[{co:'TotalEnergies',amt:'$2.8B',type:'Offshore',city:'Deepwater',yr:2026},{co:'Dangote',amt:'$19B',type:'Refinery',city:'Lagos',yr:2023},{co:'MTN',amt:'$800M',type:'Telecoms',city:'Lagos',yr:2025},{co:'Microsoft',amt:'$100M',type:'Digital Hub',city:'Lagos',yr:2024}] },
  CHN: { name:'China', capital:'Beijing', region:'EAP', income:'UMI', pop_m:1410, currency:'CNY', lang:'Mandarin', tz:'GMT+8', gfr:64.2, macro:68, policy:55, digital:72, human:62, infra:78, sustain:44, ires:66, ims:72, sci:68, fzii:62, pai:58, gci:65, fdi_inflows:163.0, fdi_stocks:1840, greenfield:118.4, ma:44.6, avg_project_m:38, jobs_yr:1200000, free_zones:21, gdp_b:17795, tier:'MEDIUM',
    top_sources:[{c:'HK',pct:64,b:104.3},{c:'Singapore',pct:8,b:13.0},{c:'Japan',pct:6,b:9.8},{c:'Korea',pct:5,b:8.2},{c:'Germany',pct:4,b:6.5}],
    top_sectors:[{s:'Manufacturing',pct:44,b:71.7},{s:'Technology',pct:22,b:35.9},{s:'Finance',pct:14,b:22.8},{s:'Real Estate',pct:10,b:16.3},{s:'Wholesale',pct:10,b:16.3}],
    top_projects:[{co:'BASF',amt:'$10B',type:'Petrochemical Complex',city:'Zhanjiang',yr:2024},{co:'Tesla',amt:'$5B',type:'Gigafactory',city:'Shanghai',yr:2024},{co:'BMW',amt:'$2.8B',type:'EV Plant',city:'Shenyang',yr:2025},{co:'Volkswagen',amt:'$1.5B',type:'EV R&D',city:'Hefei',yr:2025}] },
  GBR: { name:'United Kingdom', capital:'London', region:'ECA', income:'High', pop_m:67, currency:'GBP', lang:'English', tz:'GMT+0', gfr:78.5, macro:80, policy:84, digital:82, human:71, infra:80, sustain:72, ires:79, ims:83, sci:88, fzii:82, pai:81, gci:79, fdi_inflows:52.0, fdi_stocks:840, greenfield:34.0, ma:18.0, avg_project_m:42, jobs_yr:88000, free_zones:40, gdp_b:3079, tier:'HIGH',
    top_sources:[{c:'USA',pct:32,b:16.6},{c:'Netherlands',pct:14,b:7.3},{c:'France',pct:12,b:6.2},{c:'Japan',pct:10,b:5.2},{c:'Germany',pct:8,b:4.2}],
    top_sectors:[{s:'Finance',pct:38,b:19.8},{s:'Technology',pct:24,b:12.5},{s:'Manufacturing',pct:16,b:8.3},{s:'Real Estate',pct:12,b:6.2},{s:'Pharma',pct:10,b:5.2}],
    top_projects:[{co:'Microsoft',amt:'$2.5B',type:'AI Infrastructure',city:'London',yr:2024},{co:'Google',amt:'$1.4B',type:'Data Centre',city:'London',yr:2024},{co:'Amazon',amt:'$8B',type:'Cloud',city:'UK (multiple)',yr:2024},{co:'Palantir',amt:'$200M',type:'Expansion',city:'London',yr:2026}] },
  JPN: { name:'Japan', capital:'Tokyo', region:'EAP', income:'High', pop_m:124, currency:'JPY', lang:'Japanese', tz:'GMT+9', gfr:77.4, macro:79, policy:83, digital:80, human:68, infra:86, sustain:70, ires:75, ims:79, sci:84, fzii:75, pai:74, gci:76, fdi_inflows:30.1, fdi_stocks:280, greenfield:18.4, ma:11.7, avg_project_m:44, jobs_yr:38000, free_zones:8, gdp_b:4213, tier:'HIGH',
    top_sources:[{c:'USA',pct:28,b:8.4},{c:'Netherlands',pct:18,b:5.4},{c:'UK',pct:14,b:4.2},{c:'France',pct:10,b:3.0},{c:'Germany',pct:8,b:2.4}],
    top_sectors:[{s:'Finance',pct:32,b:9.6},{s:'Manufacturing',pct:24,b:7.2},{s:'Wholesale',pct:18,b:5.4},{s:'Technology',pct:16,b:4.8},{s:'Real Estate',pct:10,b:3.0}],
    top_projects:[{co:'TSMC',amt:'$8.6B',type:'Chip Plant',city:'Kumamoto',yr:2024},{co:'Samsung',amt:'$3.0B',type:'R&D Centre',city:'Yokohama',yr:2025},{co:'IBM',amt:'$4.0B',type:'AI Research',city:'Tokyo',yr:2024},{co:'Micron',amt:'$3.6B',type:'DRAM',city:'Hiroshima',yr:2024}] },
  KOR: { name:'South Korea', capital:'Seoul', region:'EAP', income:'High', pop_m:52, currency:'KRW', lang:'Korean', tz:'GMT+9', gfr:75.8, macro:78, policy:80, digital:84, human:70, infra:82, sustain:60, ires:76, ims:80, sci:84, fzii:74, pai:72, gci:74, fdi_inflows:18.0, fdi_stocks:244, greenfield:10.8, ma:7.2, avg_project_m:36, jobs_yr:28000, free_zones:8, gdp_b:1710, tier:'HIGH',
    top_sources:[{c:'USA',pct:26,b:4.7},{c:'Japan',pct:16,b:2.9},{c:'Netherlands',pct:14,b:2.5},{c:'UK',pct:10,b:1.8},{c:'China',pct:8,b:1.4}],
    top_sectors:[{s:'Manufacturing',pct:38,b:6.8},{s:'Finance',pct:24,b:4.3},{s:'Technology',pct:22,b:4.0},{s:'Wholesale',pct:10,b:1.8},{s:'Real Estate',pct:6,b:1.1}],
    top_projects:[{co:'TSMC',amt:'$3B',type:'Advanced Packaging',city:'Cheongju',yr:2025},{co:'Microsoft',amt:'$3.3B',type:'Cloud+AI',city:'Seoul',yr:2024},{co:'Google',amt:'$770M',type:'Data Centre',city:'Seoul',yr:2024},{co:'Amazon',amt:'$5.7B',type:'Cloud',city:'Seoul',yr:2024}] },
  AUS: { name:'Australia', capital:'Canberra', region:'EAP', income:'High', pop_m:26, currency:'AUD', lang:'English', tz:'GMT+10', gfr:82.1, macro:83, policy:85, digital:82, human:69, infra:84, sustain:76, ires:80, ims:84, sci:86, fzii:78, pai:80, gci:82, fdi_inflows:59.0, fdi_stocks:780, greenfield:38.4, ma:20.6, avg_project_m:58, jobs_yr:72000, free_zones:3, gdp_b:1688, tier:'FRONTIER',
    top_sources:[{c:'USA',pct:28,b:16.5},{c:'UK',pct:16,b:9.4},{c:'Japan',pct:14,b:8.3},{c:'Netherlands',pct:10,b:5.9},{c:'Singapore',pct:8,b:4.7}],
    top_sectors:[{s:'Mining',pct:32,b:18.9},{s:'Finance',pct:24,b:14.2},{s:'Real Estate',pct:18,b:10.6},{s:'Renewables',pct:16,b:9.4},{s:'Technology',pct:10,b:5.9}],
    top_projects:[{co:'BHP',amt:'$1.5B',type:'Copper Mine',city:'Olympic Dam',yr:2026},{co:'Rio Tinto',amt:'$2.6B',type:'Iron Ore',city:'Pilbara',yr:2025},{co:'Amazon',amt:'$4.3B',type:'Cloud',city:'Sydney',yr:2024},{co:'Google',amt:'$1B',type:'Data Centre',city:'Melbourne',yr:2025}] },
  ZAF: { name:'South Africa', capital:'Pretoria', region:'SSA', income:'UMI', pop_m:60, currency:'ZAR', lang:'English/Zulu', tz:'GMT+2', gfr:51.3, macro:52, policy:54, digital:52, human:46, infra:50, sustain:52, ires:52, ims:56, sci:54, fzii:48, pai:52, gci:50, fdi_inflows:5.2, fdi_stocks:124, greenfield:3.8, ma:1.4, avg_project_m:18, jobs_yr:32000, free_zones:12, gdp_b:373, tier:'MEDIUM',
    top_sources:[{c:'UK',pct:32,b:1.7},{c:'USA',pct:22,b:1.1},{c:'Netherlands',pct:16,b:0.8},{c:'Germany',pct:12,b:0.6},{c:'China',pct:8,b:0.4}],
    top_sectors:[{s:'Mining',pct:38,b:2.0},{s:'Finance',pct:24,b:1.2},{s:'Manufacturing',pct:18,b:0.9},{s:'Retail',pct:12,b:0.6},{s:'Technology',pct:8,b:0.4}],
    top_projects:[{co:'ACWA Power',amt:'$930M',type:'CSP',city:'Northern Cape',yr:2024},{co:'Amazon',amt:'$400M',type:'Cloud',city:'Cape Town',yr:2024},{co:'Microsoft',amt:'$2.1B',type:'Data Centres',city:'Johannesburg',yr:2024},{co:'Google',amt:'$140M',type:'Office',city:'Johannesburg',yr:2024}] },
  QAT: { name:'Qatar', capital:'Doha', region:'MENA', income:'High', pop_m:3, currency:'QAR', lang:'Arabic', tz:'GMT+3', gfr:72.4, macro:78, policy:72, digital:76, human:52, infra:84, sustain:56, ires:74, ims:78, sci:78, fzii:70, pai:72, gci:72, fdi_inflows:5.8, fdi_stocks:78, greenfield:4.2, ma:1.6, avg_project_m:52, jobs_yr:18000, free_zones:5, gdp_b:236, tier:'HIGH',
    top_sources:[{c:'UK',pct:28,b:1.6},{c:'USA',pct:22,b:1.3},{c:'France',pct:14,b:0.8},{c:'Japan',pct:12,b:0.7},{c:'Germany',pct:8,b:0.5}],
    top_sectors:[{s:'Finance',pct:38,b:2.2},{s:'Real Estate',pct:24,b:1.4},{s:'Technology',pct:18,b:1.0},{s:'Sport & Tourism',pct:12,b:0.7},{s:'Renewables',pct:8,b:0.5}],
    top_projects:[{co:'Microsoft',amt:'$1.5B',type:'Cloud',city:'Doha',yr:2024},{co:'Amazon',amt:'$500M',type:'Cloud',city:'Doha',yr:2024},{co:'TotalEnergies',amt:'$29B',type:'LNG Expansion',city:'Ras Laffan',yr:2023},{co:'Siemens',amt:'$4B',type:'Energy',city:'Qatar',yr:2024}] },
  MAR: { name:'Morocco', capital:'Rabat', region:'MENA', income:'LMI', pop_m:37, currency:'MAD', lang:'Arabic/French', tz:'GMT+1', gfr:54.8, macro:56, policy:54, digital:52, human:46, infra:60, sustain:50, ires:56, ims:60, sci:58, fzii:52, pai:56, gci:55, fdi_inflows:3.2, fdi_stocks:64, greenfield:2.4, ma:0.8, avg_project_m:14, jobs_yr:42000, free_zones:6, gdp_b:146, tier:'MEDIUM',
    top_sources:[{c:'France',pct:28,b:0.9},{c:'Spain',pct:18,b:0.6},{c:'UAE',pct:14,b:0.4},{c:'Germany',pct:12,b:0.4},{c:'USA',pct:10,b:0.3}],
    top_sectors:[{s:'Renewables',pct:34,b:1.1},{s:'Manufacturing',pct:26,b:0.8},{s:'Real Estate',pct:18,b:0.6},{s:'Tourism',pct:12,b:0.4},{s:'Finance',pct:10,b:0.3}],
    top_projects:[{co:'ACWA Power',amt:'$1.1B',type:'Atlantic Wind',city:'Dakhla',yr:2026},{co:'Stellantis',amt:'$380M',type:'EV Plant',city:'Kenitra',yr:2024},{co:'Renault',amt:'$500M',type:'EV Factory',city:'Casablanca',yr:2025},{co:'BMW',amt:'$200M',type:'Component Plant',city:'Tangier',yr:2024}] },
  POL: { name:'Poland', capital:'Warsaw', region:'ECA', income:'High', pop_m:38, currency:'PLN', lang:'Polish', tz:'GMT+1', gfr:62.0, macro:64, policy:64, digital:64, human:62, infra:64, sustain:52, ires:62, ims:66, sci:64, fzii:58, pai:62, gci:62, fdi_inflows:20.0, fdi_stocks:280, greenfield:14.8, ma:5.2, avg_project_m:28, jobs_yr:68000, free_zones:14, gdp_b:750, tier:'MEDIUM',
    top_sources:[{c:'Germany',pct:24,b:4.8},{c:'Netherlands',pct:18,b:3.6},{c:'France',pct:12,b:2.4},{c:'USA',pct:10,b:2.0},{c:'UK',pct:8,b:1.6}],
    top_sectors:[{s:'Manufacturing',pct:38,b:7.6},{s:'Technology',pct:24,b:4.8},{s:'Finance',pct:18,b:3.6},{s:'Logistics',pct:12,b:2.4},{s:'Renewables',pct:8,b:1.6}],
    top_projects:[{co:'Intel',amt:'$4.6B',type:'Assembly/Test Plant',city:'Wroclaw',yr:2024},{co:'Google',amt:'$2B',type:'Data Centre',city:'Warsaw',yr:2024},{co:'Amazon',amt:'$2.3B',type:'Cloud',city:'Warsaw',yr:2024},{co:'LG Energy',amt:'$660M',type:'Battery',city:'Wroclaw',yr:2024}] },
  TUR: { name:'Turkey', capital:'Ankara', region:'ECA', income:'UMI', pop_m:85, currency:'TRY', lang:'Turkish', tz:'GMT+3', gfr:51.8, macro:54, policy:46, digital:56, human:54, infra:58, sustain:44, ires:52, ims:56, sci:54, fzii:48, pai:48, gci:52, fdi_inflows:12.0, fdi_stocks:168, greenfield:8.4, ma:3.6, avg_project_m:22, jobs_yr:64000, free_zones:19, gdp_b:1108, tier:'MEDIUM',
    top_sources:[{c:'Netherlands',pct:24,b:2.9},{c:'UK',pct:18,b:2.2},{c:'Germany',pct:14,b:1.7},{c:'USA',pct:12,b:1.4},{c:'Azerbaijan',pct:8,b:1.0}],
    top_sectors:[{s:'Finance',pct:32,b:3.8},{s:'Manufacturing',pct:26,b:3.1},{s:'Real Estate',pct:18,b:2.2},{s:'Energy',pct:14,b:1.7},{s:'Technology',pct:10,b:1.2}],
    top_projects:[{co:'Google',amt:'$520M',type:'Data Centre',city:'Istanbul',yr:2024},{co:'Amazon',amt:'$1.5B',type:'Cloud',city:'Istanbul',yr:2024},{co:'Ford',amt:'$2B',type:'EV Plant',city:'Kocaeli',yr:2023},{co:'Siemens',amt:'$400M',type:'Energy',city:'Turkey',yr:2024}] },
  BRA: { name:'Brazil', capital:'Brasília', region:'LAC', income:'UMI', pop_m:215, currency:'BRL', lang:'Portuguese', tz:'GMT-3', gfr:54.2, macro:56, policy:52, digital:56, human:55, infra:54, sustain:46, ires:54, ims:58, sci:56, fzii:50, pai:52, gci:54, fdi_inflows:65.0, fdi_stocks:780, greenfield:42.4, ma:22.6, avg_project_m:32, jobs_yr:280000, free_zones:28, gdp_b:2130, tier:'MEDIUM',
    top_sources:[{c:'Netherlands',pct:22,b:14.3},{c:'USA',pct:18,b:11.7},{c:'Spain',pct:14,b:9.1},{c:'Luxembourg',pct:10,b:6.5},{c:'Germany',pct:8,b:5.2}],
    top_sectors:[{s:'Finance',pct:34,b:22.1},{s:'Manufacturing',pct:22,b:14.3},{s:'Mining',pct:18,b:11.7},{s:'Renewables',pct:14,b:9.1},{s:'Agriculture',pct:12,b:7.8}],
    top_projects:[{co:'Volkswagen',amt:'$1.8B',type:'EV Plant',city:'São Paulo',yr:2024},{co:'Apple',amt:'$1B',type:'Manufacturing',city:'São Paulo',yr:2024},{co:'Vale',amt:'$8B',type:'Mining',city:'Para',yr:2025},{co:'Microsoft',amt:'$2.1B',type:'Cloud',city:'São Paulo',yr:2024}] },
};

// Fallback data for unlisted economies  
function getEco(iso3: string) {
  return ECONOMY_DB[iso3.toUpperCase()] || {
    name: iso3.toUpperCase(), capital:'—', region:'—', income:'—', pop_m:0, currency:'—', lang:'—', tz:'—',
    gfr:55, macro:55, policy:55, digital:55, human:55, infra:55, sustain:55,
    ires:55, ims:58, sci:56, fzii:50, pai:54, gci:55,
    fdi_inflows:5, fdi_stocks:40, greenfield:3, ma:2, avg_project_m:20, jobs_yr:20000, free_zones:5, gdp_b:100,
    top_sources:[], top_sectors:[], top_projects:[], tier:'DEVELOPING'
  };
}

const TIER_COLORS: Record<string,string> = {FRONTIER:'#7C3AED',HIGH:'#0A66C2',MEDIUM:'#D97706',EMERGING:'#EA580C',DEVELOPING:'#6B7280'};
const DIMS = [['Economic Resilience','macro'],['Policy & Governance','policy'],['Digital Foundations','digital'],['Human Capital','human'],['Infrastructure','infra'],['Sustainability','sustain']] as const;
const PROP = [['IRES','Investment Resilience'],['IMS','Investment Momentum'],['SCI','Signal Confidence'],['FZII','Free Zone Intensity'],['PAI','Policy Attractiveness'],['GCI','Greenfield Confidence']] as const;

export default function CountryProfileClient({ iso3 }: { iso3: string }) {
  const eco = getEco(iso3);
  const [tab, setTab] = useState<'overview'|'gfr'|'projects'|'reports'>('overview');
  const tc = TIER_COLORS[eco.tier] || '#6B7280';

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="gfm-hero text-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">{eco.region} · Country Investment Profile</div>
              <h1 className="text-4xl font-extrabold mb-2">{eco.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                {[['Capital',eco.capital],['Population',`${eco.pop_m >= 100 ? (eco.pop_m/1000).toFixed(1)+'B' : eco.pop_m+'M'}`],['Currency',eco.currency],['Language',eco.lang],['Timezone',eco.tz]].map(([l,v])=>
                  <span key={String(l)}><span className="text-white/30">{l}:</span> <strong className="text-white/80">{v}</strong></span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-6">
              <div className="text-6xl font-extrabold font-mono text-white leading-none">{eco.gfr}</div>
              <div className="text-sm font-bold text-blue-200 mt-1">GFR Score</div>
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white mt-2 inline-block" style={{background:tc}}>{eco.tier}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 py-0">
        <div className="max-w-screen-xl mx-auto flex gap-0">
          {[['overview','📊 Overview'],['gfr','🏆 GFR Scores'],['projects','🏗 Top Projects'],['reports','📋 Intelligence']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t as any)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${tab===t?'border-primary text-primary':'border-transparent text-slate-500 hover:text-deep'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {tab==='overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="font-extrabold text-deep text-sm uppercase tracking-wide mb-1">Key FDI Indicators</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['FDI Inflows 2025',`$${eco.fdi_inflows}B`,'↑'],['FDI Stocks',`$${eco.fdi_stocks}B`,''],
                  ['Greenfield',`$${eco.greenfield}B`,''],['M&A',`$${eco.ma}B`,''],
                  ['Avg Project',`$${eco.avg_project_m}M`,''],['Jobs/Year',eco.jobs_yr.toLocaleString(),''],
                  ['GDP',eco.gdp_b>=1000?`$${(eco.gdp_b/1000).toFixed(1)}T`:`$${eco.gdp_b}B`,''],['Free Zones',String(eco.free_zones),''],
                ].map(([l,v,t])=>(
                  <div key={String(l)} className="gfm-card p-3.5 text-center">
                    <div className="text-xs text-slate-400 mb-0.5">{l}</div>
                    <div className="font-extrabold text-lg text-primary font-mono">{v}{t&&<span className="text-xs text-emerald-500 ml-1">{t}</span>}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {eco.top_sources.length>0 && (
                <div className="gfm-card p-5">
                  <div className="font-extrabold text-deep text-sm mb-3">Top Investor Countries</div>
                  {eco.top_sources.map((s:any,i:number)=>(
                    <div key={i} className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-slate-400 w-4">{i+1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5"><span className="font-semibold text-deep">{s.c}</span><span className="font-mono text-primary">${s.b}B</span></div>
                        <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${s.pct}%`}}/></div>
                      </div>
                      <span className="text-xs text-slate-300 w-8 text-right">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              )}
              {eco.top_sectors.length>0 && (
                <div className="gfm-card p-5">
                  <div className="font-extrabold text-deep text-sm mb-3">Top Investment Sectors</div>
                  {eco.top_sectors.map((s:any,i:number)=>(
                    <div key={i} className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-slate-400 w-4">{i+1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-0.5"><span className="font-semibold text-deep">{s.s}</span><span className="font-mono text-primary">${s.b}B</span></div>
                        <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${s.pct}%`}}/></div>
                      </div>
                      <span className="text-xs text-slate-300 w-8 text-right">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab==='gfr' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="gfm-card p-6">
              <div className="font-extrabold text-deep text-sm mb-4">Core GFR Dimensions</div>
              {DIMS.map(([label,key])=>(
                <div key={key} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-bold font-mono text-primary">{eco[key]}</span>
                  </div>
                  <div className="gfm-progress"><div className="gfm-progress-fill" style={{width:`${eco[key]}%`}}/></div>
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-deep">GFR Composite</span>
                <span className="text-2xl font-extrabold font-mono text-primary">{eco.gfr}</span>
              </div>
            </div>
            <div className="gfm-card p-6">
              <div className="font-extrabold text-deep text-sm mb-1">Proprietary Factors</div>
              <div className="text-xs text-slate-400 mb-4">GFM intelligence framework — see methodology for full details</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {PROP.map(([k,desc])=>(
                  <div key={k} className="bg-primary-light rounded-xl p-3 border border-blue-200">
                    <div className="font-extrabold text-primary font-mono text-xl">{eco[k.toLowerCase() as keyof typeof eco] as number}</div>
                    <div className="text-xs font-extrabold text-blue-600">{k}</div>
                    <div className="text-xs text-slate-400 leading-tight mt-0.5">{desc}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-deep">GFR Formula:</strong> Macro×0.20 + Policy×0.18 + Digital×0.15 + Human×0.15 + Infra×0.15 + Sustain×0.17
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='projects' && (
          <div className="max-w-3xl space-y-3">
            <div className="font-extrabold text-deep text-sm mb-1">Top Investment Projects 2024–2026</div>
            <p className="text-xs text-slate-400 mb-4">Source: GFM Intelligence · SHA-256 verified</p>
            {eco.top_projects.length > 0 ? eco.top_projects.map((p:any,i:number)=>(
              <div key={i} className="gfm-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary font-extrabold text-sm flex-shrink-0">{p.co.slice(0,2)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-deep">{p.co}</div>
                  <div className="text-xs text-slate-500">{p.type} · {p.city} · {p.yr}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-extrabold text-primary font-mono">{p.amt}</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400">
                <div className="text-4xl mb-2">📡</div>
                <p className="text-sm">Monitoring signals for {eco.name}…</p>
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-primary px-6 py-2.5 text-sm">Generate Country Report — 20 FIC</button>
              <Link href="/signals" className="gfm-btn-outline px-6 py-2.5 text-sm">View All Signals</Link>
            </div>
          </div>
        )}

        {tab==='reports' && (
          <div className="max-w-2xl space-y-4">
            <div className="font-extrabold text-deep text-sm mb-3">Available Intelligence for {eco.name}</div>
            {[
              {code:'CEGP',name:'Country Economic Profile',pages:'24-32',fic:20,icon:'🌍',desc:'Full economic analysis, FDI breakdown, regulatory environment, sector opportunities.'},
              {code:'MIB', name:'Market Intelligence Brief',pages:'8-12', fic:5, icon:'⚡',desc:'Executive summary, key signals, top sectors, immediate opportunities.'},
              {code:'ICR', name:'Investment Climate Report',pages:'20-28',fic:18,icon:'📜',desc:'Policy environment, ease of doing business, regulatory risks and opportunities.'},
              {code:'FCGR',name:'Flagship GFR Country Report',pages:'40-56',fic:25,icon:'🏆',desc:'Full GFR deep-dive with all 40 indicators, 5-year trend, peer benchmarking.'},
            ].map(r=>(
              <div key={r.code} className="gfm-card p-5 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-deep text-sm">{r.name}</div>
                  <div className="text-xs text-slate-400">{r.pages} pages · ~{r.fic*6}s generation</div>
                  <p className="text-xs text-slate-400 leading-tight mt-0.5">{r.desc}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <button onClick={()=>window.location.href='/subscription'} className="gfm-btn-primary text-xs py-1.5 px-4 block whitespace-nowrap">
                    Generate — {r.fic} FIC
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
