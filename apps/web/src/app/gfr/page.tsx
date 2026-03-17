'use client';
import { exportGFR, exportJSON } from '@/lib/export';
import { useState, useMemo } from 'react';

interface Economy {
  iso3:string; iso2:string; name:string; region:string; income:string;
  rank:number; composite:number; tier:string;
  macro:number; policy:number; digital:number;
  human:number; infra:number; sustain:number;
  pop_m:number; gdp_b:number; fdi_b:number;
  internet_pct:number; sectors:string[];
}

// AUTO-GENERATED from reference_data.py — all 215 economies
const GFR_ALL: Economy[] = [
  {iso3:'AUS',iso2:'AU',name:"Australia",region:'EAP',income:'HIC',rank:8,composite:82.1,tier:'FRONTIER',macro:84,policy:85,digital:83,human:76,infra:82,sustain:81,pop_m:26.5,gdp_b:1688,fdi_b:59.4,internet_pct:91,sectors:["J", "K", "D", "B"]},
  {iso3:'BRN',iso2:'BN',name:"Brunei Darussalam",region:'EAP',income:'HIC',rank:62,composite:58.0,tier:'MEDIUM',macro:71,policy:60,digital:62,human:40,infra:65,sustain:42,pop_m:0.4,gdp_b:15,fdi_b:1.2,internet_pct:97,sectors:["B", "D"]},
  {iso3:'CHN',iso2:'CN',name:"China",region:'EAP',income:'UMIC',rank:45,composite:61.8,tier:'MEDIUM',macro:74,policy:55,digital:72,human:68,infra:76,sustain:48,pop_m:1412,gdp_b:17795,fdi_b:163.0,internet_pct:74,sectors:["C", "J", "D", "F"]},
  {iso3:'FJI',iso2:'FJ',name:"Fiji",region:'EAP',income:'UMIC',rank:128,composite:41.0,tier:'EMERGING',macro:44,policy:42,digital:48,human:38,infra:40,sustain:38,pop_m:0.9,gdp_b:4.5,fdi_b:0.3,internet_pct:54,sectors:["Q", "H", "L"]},
  {iso3:'HKG',iso2:'HK',name:"Hong Kong SAR",region:'EAP',income:'HIC',rank:6,composite:85.2,tier:'FRONTIER',macro:88,policy:82,digital:89,human:72,infra:94,sustain:62,pop_m:7.4,gdp_b:369,fdi_b:116.4,internet_pct:94,sectors:["K", "J", "L", "H"]},
  {iso3:'IDN',iso2:'ID',name:"Indonesia",region:'EAP',income:'UMIC',rank:67,composite:57.1,tier:'MEDIUM',macro:64,policy:54,digital:55,human:58,infra:58,sustain:48,pop_m:274,gdp_b:1371,fdi_b:22.0,internet_pct:77,sectors:["C", "B", "D", "H"]},
  {iso3:'JPN',iso2:'JP',name:"Japan",region:'EAP',income:'HIC',rank:12,composite:79.3,tier:'HIGH',macro:82,policy:84,digital:82,human:74,infra:88,sustain:72,pop_m:123,gdp_b:4213,fdi_b:30.5,internet_pct:93,sectors:["C", "J", "K", "D"]},
  {iso3:'KHM',iso2:'KH',name:"Cambodia",region:'EAP',income:'LMIC',rank:126,composite:42.1,tier:'EMERGING',macro:48,policy:40,digital:38,human:34,infra:42,sustain:38,pop_m:17,gdp_b:27,fdi_b:3.2,internet_pct:54,sectors:["C", "H", "Q"]},
  {iso3:'KIR',iso2:'KI',name:"Kiribati",region:'EAP',income:'LMIC',rank:208,composite:22.0,tier:'DEVELOPING',macro:24,policy:20,digital:18,human:24,infra:20,sustain:28,pop_m:0.1,gdp_b:0.2,fdi_b:0.0,internet_pct:20,sectors:["Q"]},
  {iso3:'KOR',iso2:'KR',name:"Korea, Rep.",region:'EAP',income:'HIC',rank:14,composite:77.8,tier:'HIGH',macro:80,policy:82,digital:84,human:75,infra:84,sustain:68,pop_m:52,gdp_b:1710,fdi_b:18.4,internet_pct:97,sectors:["C", "J", "K", "D"]},
  {iso3:'LAO',iso2:'LA',name:"Lao PDR",region:'EAP',income:'LMIC',rank:132,composite:40.0,tier:'EMERGING',macro:44,policy:36,digital:36,human:34,infra:42,sustain:38,pop_m:7.4,gdp_b:15,fdi_b:1.5,internet_pct:30,sectors:["B", "D", "H"]},
  {iso3:'MAC',iso2:'MO',name:"Macao SAR",region:'EAP',income:'HIC',rank:30,composite:68.0,tier:'HIGH',macro:72,policy:65,digital:78,human:55,infra:80,sustain:48,pop_m:0.7,gdp_b:34,fdi_b:2.1,internet_pct:90,sectors:["L", "K", "J"]},
  {iso3:'MHL',iso2:'MH',name:"Marshall Islands",region:'EAP',income:'UMIC',rank:205,composite:24.0,tier:'DEVELOPING',macro:26,policy:22,digital:20,human:26,infra:22,sustain:28,pop_m:0.04,gdp_b:0.3,fdi_b:0.0,internet_pct:26,sectors:["Q"]},
  {iso3:'MMR',iso2:'MM',name:"Myanmar",region:'EAP',income:'LMIC',rank:168,composite:30.0,tier:'DEVELOPING',macro:32,policy:22,digital:28,human:28,infra:32,sustain:34,pop_m:55,gdp_b:65,fdi_b:1.5,internet_pct:38,sectors:["C", "B", "D"]},
  {iso3:'MNG',iso2:'MN',name:"Mongolia",region:'EAP',income:'LMIC',rank:127,composite:42.0,tier:'EMERGING',macro:46,policy:44,digital:45,human:52,infra:35,sustain:38,pop_m:3.4,gdp_b:18,fdi_b:2.4,internet_pct:78,sectors:["B", "D"]},
  {iso3:'MYS',iso2:'MY',name:"Malaysia",region:'EAP',income:'UMIC',rank:35,composite:66.4,tier:'HIGH',macro:68,policy:65,digital:72,human:58,infra:68,sustain:58,pop_m:33,gdp_b:430,fdi_b:14.2,internet_pct:97,sectors:["C", "J", "K", "D"]},
  {iso3:'NRU',iso2:'NR',name:"Nauru",region:'EAP',income:'HIC',rank:209,composite:22.0,tier:'DEVELOPING',macro:24,policy:18,digital:18,human:22,infra:20,sustain:26,pop_m:0.01,gdp_b:0.1,fdi_b:0.0,internet_pct:58,sectors:["Q"]},
  {iso3:'NZL',iso2:'NZ',name:"New Zealand",region:'EAP',income:'HIC',rank:9,composite:82.0,tier:'FRONTIER',macro:84,policy:88,digital:82,human:76,infra:80,sustain:82,pop_m:5.1,gdp_b:245,fdi_b:11.4,internet_pct:96,sectors:["D", "L", "K", "J"]},
  {iso3:'PHL',iso2:'PH',name:"Philippines",region:'EAP',income:'LMIC',rank:88,composite:52.0,tier:'MEDIUM',macro:58,policy:50,digital:55,human:55,infra:48,sustain:44,pop_m:115,gdp_b:435,fdi_b:9.5,internet_pct:73,sectors:["C", "J", "K", "H"]},
  {iso3:'PLW',iso2:'PW',name:"Palau",region:'EAP',income:'HIC',rank:158,composite:35.0,tier:'DEVELOPING',macro:38,policy:32,digital:38,human:34,infra:32,sustain:38,pop_m:0.02,gdp_b:0.3,fdi_b:0.0,internet_pct:58,sectors:["Q", "L"]},
  {iso3:'PNG',iso2:'PG',name:"Papua New Guinea",region:'EAP',income:'LMIC',rank:162,composite:34.0,tier:'DEVELOPING',macro:36,policy:32,digital:26,human:30,infra:34,sustain:38,pop_m:10,gdp_b:30,fdi_b:1.8,internet_pct:24,sectors:["B", "D", "C"]},
  {iso3:'PRK',iso2:'KP',name:"Korea, Dem. Rep.",region:'EAP',income:'LIC',rank:215,composite:8.0,tier:'DEVELOPING',macro:10,policy:4,digital:8,human:14,infra:12,sustain:8,pop_m:26,gdp_b:17,fdi_b:0.1,internet_pct:0,sectors:["B", "C"]},
  {iso3:'SGP',iso2:'SG',name:"Singapore",region:'EAP',income:'HIC',rank:1,composite:88.5,tier:'FRONTIER',macro:87,policy:91,digital:87,human:63,infra:94,sustain:62,pop_m:5.9,gdp_b:501,fdi_b:141.2,internet_pct:97,sectors:["J", "K", "H", "L"]},
  {iso3:'SLB',iso2:'SB',name:"Solomon Islands",region:'EAP',income:'LMIC',rank:198,composite:26.0,tier:'DEVELOPING',macro:28,policy:24,digital:22,human:28,infra:24,sustain:34,pop_m:0.7,gdp_b:1.7,fdi_b:0.1,internet_pct:18,sectors:["B", "Q"]},
  {iso3:'THA',iso2:'TH',name:"Thailand",region:'EAP',income:'UMIC',rank:42,composite:63.1,tier:'MEDIUM',macro:66,policy:60,digital:68,human:54,infra:68,sustain:58,pop_m:71,gdp_b:545,fdi_b:9.8,internet_pct:84,sectors:["C", "H", "J", "D"]},
  {iso3:'TLS',iso2:'TL',name:"Timor-Leste",region:'EAP',income:'LMIC',rank:185,composite:28.0,tier:'DEVELOPING',macro:30,policy:26,digital:22,human:26,infra:28,sustain:34,pop_m:1.3,gdp_b:2.2,fdi_b:0.1,internet_pct:30,sectors:["B", "Q"]},
  {iso3:'TON',iso2:'TO',name:"Tonga",region:'EAP',income:'UMIC',rank:163,composite:34.0,tier:'DEVELOPING',macro:36,policy:32,digital:32,human:38,infra:28,sustain:38,pop_m:0.1,gdp_b:0.5,fdi_b:0.0,internet_pct:52,sectors:["Q", "L"]},
  {iso3:'TUV',iso2:'TV',name:"Tuvalu",region:'EAP',income:'UMIC',rank:211,composite:21.0,tier:'DEVELOPING',macro:22,policy:18,digital:16,human:22,infra:18,sustain:28,pop_m:0.01,gdp_b:0.1,fdi_b:0.0,internet_pct:48,sectors:["Q"]},
  {iso3:'VNM',iso2:'VN',name:"Vietnam",region:'EAP',income:'LMIC',rank:63,composite:58.2,tier:'MEDIUM',macro:62,policy:58,digital:55,human:52,infra:58,sustain:48,pop_m:97,gdp_b:430,fdi_b:18.1,internet_pct:79,sectors:["C", "J", "D", "H"]},
  {iso3:'VUT',iso2:'VU',name:"Vanuatu",region:'EAP',income:'LMIC',rank:186,composite:28.0,tier:'DEVELOPING',macro:30,policy:26,digital:24,human:28,infra:26,sustain:38,pop_m:0.3,gdp_b:1.0,fdi_b:0.1,internet_pct:28,sectors:["Q", "L"]},
  {iso3:'WSM',iso2:'WS',name:"Samoa",region:'EAP',income:'UMIC',rank:164,composite:34.0,tier:'DEVELOPING',macro:36,policy:30,digital:32,human:36,infra:28,sustain:38,pop_m:0.2,gdp_b:0.9,fdi_b:0.0,internet_pct:45,sectors:["Q", "L"]},
  {iso3:'ALB',iso2:'AL',name:"Albania",region:'ECA',income:'UMIC',rank:102,composite:48.0,tier:'MEDIUM',macro:50,policy:46,digital:52,human:44,infra:46,sustain:48,pop_m:2.8,gdp_b:20,fdi_b:1.2,internet_pct:82,sectors:["L", "H", "D"]},
  {iso3:'ARM',iso2:'AM',name:"Armenia",region:'ECA',income:'UMIC',rank:115,composite:45.0,tier:'MEDIUM',macro:48,policy:44,digital:52,human:50,infra:38,sustain:42,pop_m:3.0,gdp_b:24,fdi_b:0.8,internet_pct:80,sectors:["J", "K", "D"]},
  {iso3:'AUT',iso2:'AT',name:"Austria",region:'ECA',income:'HIC',rank:13,composite:79.0,tier:'HIGH',macro:80,policy:84,digital:78,human:72,infra:82,sustain:78,pop_m:9.1,gdp_b:470,fdi_b:8.2,internet_pct:92,sectors:["K", "C", "J", "L"]},
  {iso3:'AZE',iso2:'AZ',name:"Azerbaijan",region:'ECA',income:'UMIC',rank:101,composite:48.0,tier:'MEDIUM',macro:55,policy:42,digital:48,human:44,infra:50,sustain:42,pop_m:10,gdp_b:78,fdi_b:3.1,internet_pct:82,sectors:["B", "D", "H"]},
  {iso3:'BEL',iso2:'BE',name:"Belgium",region:'ECA',income:'HIC',rank:17,composite:76.2,tier:'HIGH',macro:78,policy:80,digital:76,human:68,infra:78,sustain:74,pop_m:11.6,gdp_b:579,fdi_b:31.2,internet_pct:94,sectors:["K", "C", "J", "H"]},
  {iso3:'BGR',iso2:'BG',name:"Bulgaria",region:'ECA',income:'UMIC',rank:87,composite:52.0,tier:'MEDIUM',macro:54,policy:50,digital:58,human:46,infra:50,sustain:52,pop_m:6.4,gdp_b:97,fdi_b:2.8,internet_pct:83,sectors:["C", "J", "K"]},
  {iso3:'BIH',iso2:'BA',name:"Bosnia and Herzegovina",region:'ECA',income:'UMIC',rank:133,composite:40.0,tier:'EMERGING',macro:42,policy:36,digital:44,human:38,infra:38,sustain:40,pop_m:3.3,gdp_b:26,fdi_b:0.5,internet_pct:78,sectors:["C", "L"]},
  {iso3:'BLR',iso2:'BY',name:"Belarus",region:'ECA',income:'UMIC',rank:134,composite:40.0,tier:'EMERGING',macro:44,policy:32,digital:52,human:48,infra:42,sustain:38,pop_m:9.4,gdp_b:73,fdi_b:1.2,internet_pct:86,sectors:["C", "J", "D"]},
  {iso3:'CHE',iso2:'CH',name:"Switzerland",region:'ECA',income:'HIC',rank:2,composite:87.5,tier:'FRONTIER',macro:88,policy:90,digital:85,human:78,infra:91,sustain:74,pop_m:8.7,gdp_b:884,fdi_b:26.4,internet_pct:97,sectors:["K", "J", "C", "L"]},
  {iso3:'CYP',iso2:'CY',name:"Cyprus",region:'ECA',income:'HIC',rank:46,composite:62.0,tier:'MEDIUM',macro:64,policy:62,digital:70,human:58,infra:62,sustain:55,pop_m:1.2,gdp_b:30,fdi_b:18.4,internet_pct:90,sectors:["K", "L", "J"]},
  {iso3:'CZE',iso2:'CZ',name:"Czech Republic",region:'ECA',income:'HIC',rank:36,composite:66.0,tier:'HIGH',macro:68,policy:68,digital:72,human:62,infra:68,sustain:62,pop_m:10.8,gdp_b:330,fdi_b:11.8,internet_pct:90,sectors:["C", "J", "K"]},
  {iso3:'DEU',iso2:'DE',name:"Germany",region:'ECA',income:'HIC',rank:4,composite:78.1,tier:'DEVELOPING',macro:81,policy:86,digital:78,human:70,infra:84,sustain:77,pop_m:83,gdp_b:4430,fdi_b:35.4,internet_pct:94,sectors:["C", "J", "D", "K"]},
  {iso3:'DNK',iso2:'DK',name:"Denmark",region:'ECA',income:'HIC',rank:7,composite:84.2,tier:'FRONTIER',macro:86,policy:90,digital:86,human:76,infra:82,sustain:90,pop_m:5.9,gdp_b:395,fdi_b:14.8,internet_pct:98,sectors:["D", "J", "K", "C"]},
  {iso3:'ESP',iso2:'ES',name:"Spain",region:'ECA',income:'HIC',rank:24,composite:70.0,tier:'HIGH',macro:72,policy:72,digital:72,human:62,infra:72,sustain:70,pop_m:47,gdp_b:1580,fdi_b:27.4,internet_pct:95,sectors:["L", "K", "D", "J"]},
  {iso3:'EST',iso2:'EE',name:"Estonia",region:'ECA',income:'HIC',rank:22,composite:72.0,tier:'HIGH',macro:72,policy:76,digital:82,human:62,infra:68,sustain:70,pop_m:1.3,gdp_b:41,fdi_b:2.4,internet_pct:92,sectors:["J", "K", "C"]},
  {iso3:'FIN',iso2:'FI',name:"Finland",region:'ECA',income:'HIC',rank:8,composite:82.8,tier:'FRONTIER',macro:84,policy:88,digital:86,human:76,infra:80,sustain:88,pop_m:5.5,gdp_b:305,fdi_b:8.4,internet_pct:94,sectors:["C", "J", "D", "K"]},
  {iso3:'FRA',iso2:'FR',name:"France",region:'ECA',income:'HIC',rank:16,composite:76.2,tier:'HIGH',macro:78,policy:76,digital:76,human:66,infra:80,sustain:76,pop_m:68,gdp_b:2924,fdi_b:28.1,internet_pct:92,sectors:["C", "K", "D", "J"]},
  {iso3:'GBR',iso2:'GB',name:"United Kingdom",region:'ECA',income:'HIC',rank:5,composite:78.5,tier:'HIGH',macro:80,policy:84,digital:82,human:71,infra:80,sustain:72,pop_m:67,gdp_b:3079,fdi_b:52.0,internet_pct:97,sectors:["K", "J", "L", "C"]},
  {iso3:'GEO',iso2:'GE',name:"Georgia",region:'ECA',income:'UMIC',rank:103,composite:48.0,tier:'MEDIUM',macro:50,policy:52,digital:58,human:48,infra:42,sustain:42,pop_m:3.7,gdp_b:28,fdi_b:1.8,internet_pct:80,sectors:["L", "J", "K"]},
  {iso3:'GRC',iso2:'GR',name:"Greece",region:'ECA',income:'HIC',rank:47,composite:62.0,tier:'MEDIUM',macro:62,policy:60,digital:62,human:55,infra:62,sustain:62,pop_m:10.4,gdp_b:240,fdi_b:5.4,internet_pct:88,sectors:["L", "K", "D"]},
  {iso3:'HRV',iso2:'HR',name:"Croatia",region:'ECA',income:'HIC',rank:51,composite:60.0,tier:'MEDIUM',macro:62,policy:60,digital:64,human:54,infra:60,sustain:60,pop_m:3.8,gdp_b:80,fdi_b:2.4,internet_pct:82,sectors:["L", "K", "C"]},
  {iso3:'HUN',iso2:'HU',name:"Hungary",region:'ECA',income:'HIC',rank:64,composite:58.0,tier:'MEDIUM',macro:60,policy:52,digital:66,human:56,infra:60,sustain:55,pop_m:9.7,gdp_b:210,fdi_b:8.2,internet_pct:88,sectors:["C", "J", "K"]},
  {iso3:'IRL',iso2:'IE',name:"Ireland",region:'ECA',income:'HIC',rank:15,composite:76.5,tier:'HIGH',macro:82,policy:80,digital:80,human:72,infra:78,sustain:68,pop_m:5.1,gdp_b:529,fdi_b:94.5,internet_pct:92,sectors:["J", "K", "C", "L"]},
  {iso3:'ISL',iso2:'IS',name:"Iceland",region:'ECA',income:'HIC',rank:11,composite:80.0,tier:'FRONTIER',macro:82,policy:86,digital:84,human:74,infra:78,sustain:88,pop_m:0.4,gdp_b:28,fdi_b:1.2,internet_pct:99,sectors:["D", "L", "K"]},
  {iso3:'ITA',iso2:'IT',name:"Italy",region:'ECA',income:'HIC',rank:29,composite:68.0,tier:'HIGH',macro:70,policy:66,digital:66,human:60,infra:72,sustain:70,pop_m:59,gdp_b:2169,fdi_b:22.1,internet_pct:90,sectors:["C", "K", "L", "D"]},
  {iso3:'KAZ',iso2:'KZ',name:"Kazakhstan",region:'ECA',income:'UMIC',rank:90,composite:52.0,tier:'MEDIUM',macro:58,policy:48,digital:55,human:50,infra:52,sustain:42,pop_m:19,gdp_b:259,fdi_b:8.1,internet_pct:82,sectors:["B", "D", "C"]},
  {iso3:'KGZ',iso2:'KG',name:"Kyrgyz Republic",region:'ECA',income:'LMIC',rank:155,composite:36.0,tier:'DEVELOPING',macro:38,policy:34,digital:40,human:40,infra:30,sustain:35,pop_m:7,gdp_b:12,fdi_b:0.5,internet_pct:62,sectors:["B", "D"]},
  {iso3:'LIE',iso2:'LI',name:"Liechtenstein",region:'ECA',income:'HIC',rank:13,composite:78.0,tier:'HIGH',macro:80,policy:82,digital:78,human:72,infra:78,sustain:72,pop_m:0.04,gdp_b:7.3,fdi_b:3.2,internet_pct:98,sectors:["K", "J", "C"]},
  {iso3:'LTU',iso2:'LT',name:"Lithuania",region:'ECA',income:'HIC',rank:39,composite:64.0,tier:'HIGH',macro:66,policy:68,digital:72,human:58,infra:62,sustain:62,pop_m:2.8,gdp_b:75,fdi_b:2.4,internet_pct:86,sectors:["J", "C", "K"]},
  {iso3:'LUX',iso2:'LU',name:"Luxembourg",region:'ECA',income:'HIC',rank:10,composite:80.0,tier:'FRONTIER',macro:82,policy:84,digital:82,human:70,infra:82,sustain:74,pop_m:0.7,gdp_b:82,fdi_b:48.0,internet_pct:99,sectors:["K", "J", "L"]},
  {iso3:'LVA',iso2:'LV',name:"Latvia",region:'ECA',income:'HIC',rank:48,composite:62.0,tier:'MEDIUM',macro:62,policy:66,digital:72,human:58,infra:58,sustain:60,pop_m:1.8,gdp_b:44,fdi_b:1.5,internet_pct:86,sectors:["C", "J", "K"]},
  {iso3:'MDA',iso2:'MD',name:"Moldova",region:'ECA',income:'LMIC',rank:148,composite:38.0,tier:'EMERGING',macro:40,policy:36,digital:42,human:40,infra:32,sustain:38,pop_m:2.6,gdp_b:15,fdi_b:0.5,internet_pct:75,sectors:["C", "L"]},
  {iso3:'MKD',iso2:'MK',name:"North Macedonia",region:'ECA',income:'UMIC',rank:129,composite:42.0,tier:'EMERGING',macro:44,policy:40,digital:48,human:40,infra:40,sustain:40,pop_m:2.1,gdp_b:15,fdi_b:0.4,internet_pct:82,sectors:["C", "J"]},
  {iso3:'MLT',iso2:'MT',name:"Malta",region:'ECA',income:'HIC',rank:33,composite:66.0,tier:'HIGH',macro:68,policy:68,digital:74,human:60,infra:66,sustain:58,pop_m:0.5,gdp_b:19,fdi_b:8.2,internet_pct:88,sectors:["K", "J", "L"]},
  {iso3:'MNE',iso2:'ME',name:"Montenegro",region:'ECA',income:'UMIC',rank:118,composite:44.0,tier:'MEDIUM',macro:46,policy:42,digital:50,human:44,infra:42,sustain:42,pop_m:0.6,gdp_b:7.4,fdi_b:0.8,internet_pct:82,sectors:["L", "K"]},
  {iso3:'NLD',iso2:'NL',name:"Netherlands",region:'ECA',income:'HIC',rank:9,composite:80.5,tier:'FRONTIER',macro:82,policy:86,digital:84,human:72,infra:84,sustain:78,pop_m:17.6,gdp_b:1081,fdi_b:92.4,internet_pct:95,sectors:["K", "J", "H", "C"]},
  {iso3:'NOR',iso2:'NO',name:"Norway",region:'ECA',income:'HIC',rank:8,composite:83.2,tier:'FRONTIER',macro:85,policy:88,digital:84,human:75,infra:82,sustain:91,pop_m:5.4,gdp_b:485,fdi_b:12.3,internet_pct:99,sectors:["D", "K", "J", "C"]},
  {iso3:'POL',iso2:'PL',name:"Poland",region:'ECA',income:'HIC',rank:44,composite:62.0,tier:'MEDIUM',macro:64,policy:58,digital:66,human:58,infra:62,sustain:58,pop_m:38,gdp_b:750,fdi_b:20.8,internet_pct:90,sectors:["C", "J", "K"]},
  {iso3:'PRT',iso2:'PT',name:"Portugal",region:'ECA',income:'HIC',rank:34,composite:66.0,tier:'HIGH',macro:68,policy:70,digital:68,human:58,infra:68,sustain:65,pop_m:10.2,gdp_b:278,fdi_b:8.4,internet_pct:82,sectors:["L", "K", "J", "D"]},
  {iso3:'ROU',iso2:'RO',name:"Romania",region:'ECA',income:'HIC',rank:82,composite:54.0,tier:'MEDIUM',macro:56,policy:50,digital:60,human:50,infra:52,sustain:52,pop_m:19,gdp_b:350,fdi_b:9.1,internet_pct:88,sectors:["C", "J", "K"]},
  {iso3:'RUS',iso2:'RU',name:"Russian Federation",region:'ECA',income:'UMIC',rank:147,composite:38.0,tier:'EMERGING',macro:44,policy:28,digital:55,human:52,infra:50,sustain:28,pop_m:143,gdp_b:1862,fdi_b:5.2,internet_pct:88,sectors:["D", "B", "C"]},
  {iso3:'SRB',iso2:'RS',name:"Serbia",region:'ECA',income:'UMIC',rank:104,composite:48.0,tier:'MEDIUM',macro:50,policy:48,digital:55,human:46,infra:46,sustain:44,pop_m:6.8,gdp_b:70,fdi_b:4.0,internet_pct:82,sectors:["C", "J", "L"]},
  {iso3:'SVK',iso2:'SK',name:"Slovak Republic",region:'ECA',income:'HIC',rank:49,composite:62.0,tier:'MEDIUM',macro:64,policy:62,digital:66,human:56,infra:62,sustain:58,pop_m:5.5,gdp_b:136,fdi_b:2.1,internet_pct:90,sectors:["C", "J", "K"]},
  {iso3:'SVN',iso2:'SI',name:"Slovenia",region:'ECA',income:'HIC',rank:28,composite:68.0,tier:'HIGH',macro:70,policy:70,digital:74,human:62,infra:68,sustain:68,pop_m:2.1,gdp_b:70,fdi_b:1.8,internet_pct:91,sectors:["C", "J", "K"]},
  {iso3:'SWE',iso2:'SE',name:"Sweden",region:'ECA',income:'HIC',rank:5,composite:84.0,tier:'FRONTIER',macro:86,policy:88,digital:86,human:76,infra:82,sustain:90,pop_m:10.5,gdp_b:597,fdi_b:14.8,internet_pct:97,sectors:["C", "J", "K", "D"]},
  {iso3:'TJK',iso2:'TJ',name:"Tajikistan",region:'ECA',income:'LIC',rank:188,composite:28.0,tier:'DEVELOPING',macro:30,policy:24,digital:28,human:28,infra:24,sustain:28,pop_m:10,gdp_b:10,fdi_b:0.3,internet_pct:30,sectors:["B", "D"]},
  {iso3:'TKM',iso2:'TM',name:"Turkmenistan",region:'ECA',income:'UMIC',rank:196,composite:26.0,tier:'DEVELOPING',macro:30,policy:18,digital:22,human:24,infra:30,sustain:22,pop_m:6.1,gdp_b:59,fdi_b:1.4,internet_pct:18,sectors:["D", "B"]},
  {iso3:'TUR',iso2:'TR',name:"Turkey",region:'ECA',income:'UMIC',rank:89,composite:52.0,tier:'MEDIUM',macro:56,policy:44,digital:60,human:50,infra:60,sustain:46,pop_m:85,gdp_b:1108,fdi_b:12.4,internet_pct:88,sectors:["C", "L", "K", "D"]},
  {iso3:'UKR',iso2:'UA',name:"Ukraine",region:'ECA',income:'LMIC',rank:154,composite:36.0,tier:'DEVELOPING',macro:35,policy:34,digital:55,human:50,infra:32,sustain:28,pop_m:42,gdp_b:178,fdi_b:1.8,internet_pct:81,sectors:["C", "D", "B"]},
  {iso3:'UZB',iso2:'UZ',name:"Uzbekistan",region:'ECA',income:'LMIC',rank:136,composite:40.0,tier:'EMERGING',macro:44,policy:38,digital:42,human:40,infra:38,sustain:36,pop_m:35,gdp_b:100,fdi_b:2.8,internet_pct:72,sectors:["D", "C", "B"]},
  {iso3:'XKX',iso2:'XK',name:"Kosovo",region:'ECA',income:'UMIC',rank:156,composite:36.0,tier:'DEVELOPING',macro:38,policy:34,digital:42,human:36,infra:32,sustain:34,pop_m:1.8,gdp_b:10,fdi_b:0.4,internet_pct:76,sectors:["C", "L"]},
  {iso3:'ARG',iso2:'AR',name:"Argentina",region:'LAC',income:'UMIC',rank:105,composite:48.0,tier:'MEDIUM',macro:42,policy:42,digital:55,human:56,infra:48,sustain:44,pop_m:46,gdp_b:620,fdi_b:7.3,internet_pct:88,sectors:["B", "D", "C", "K"]},
  {iso3:'ATG',iso2:'AG',name:"Antigua and Barbuda",region:'LAC',income:'HIC',rank:117,composite:44.0,tier:'MEDIUM',macro:46,policy:44,digital:50,human:42,infra:42,sustain:40,pop_m:0.1,gdp_b:2.0,fdi_b:0.3,internet_pct:76,sectors:["L", "K"]},
  {iso3:'BHS',iso2:'BS',name:"Bahamas",region:'LAC',income:'HIC',rank:96,composite:50.0,tier:'MEDIUM',macro:52,policy:52,digital:58,human:46,infra:50,sustain:44,pop_m:0.4,gdp_b:13,fdi_b:0.8,internet_pct:80,sectors:["L", "K", "J"]},
  {iso3:'BLZ',iso2:'BZ',name:"Belize",region:'LAC',income:'UMIC',rank:146,composite:38.0,tier:'EMERGING',macro:40,policy:36,digital:38,human:36,infra:36,sustain:40,pop_m:0.4,gdp_b:2.8,fdi_b:0.2,internet_pct:55,sectors:["Q", "L", "B"]},
  {iso3:'BOL',iso2:'BO',name:"Bolivia",region:'LAC',income:'LMIC',rank:150,composite:38.0,tier:'EMERGING',macro:42,policy:34,digital:38,human:40,infra:34,sustain:36,pop_m:12,gdp_b:44,fdi_b:0.8,internet_pct:55,sectors:["B", "D", "C"]},
  {iso3:'BRA',iso2:'BR',name:"Brazil",region:'LAC',income:'UMIC',rank:80,composite:54.2,tier:'MEDIUM',macro:58,policy:52,digital:62,human:56,infra:52,sustain:44,pop_m:214,gdp_b:2130,fdi_b:65.1,internet_pct:84,sectors:["D", "K", "C", "B"]},
  {iso3:'BRB',iso2:'BB',name:"Barbados",region:'LAC',income:'HIC',rank:86,composite:52.0,tier:'MEDIUM',macro:54,policy:54,digital:60,human:48,infra:50,sustain:48,pop_m:0.3,gdp_b:5.7,fdi_b:0.3,internet_pct:82,sectors:["K", "L", "J"]},
  {iso3:'CHL',iso2:'CL',name:"Chile",region:'LAC',income:'HIC',rank:52,composite:60.0,tier:'MEDIUM',macro:62,policy:64,digital:64,human:54,infra:60,sustain:52,pop_m:19,gdp_b:335,fdi_b:16.8,internet_pct:90,sectors:["B", "D", "K", "L"]},
  {iso3:'COL',iso2:'CO',name:"Colombia",region:'LAC',income:'UMIC',rank:91,composite:52.0,tier:'MEDIUM',macro:54,policy:50,digital:55,human:50,infra:50,sustain:46,pop_m:52,gdp_b:344,fdi_b:17.2,internet_pct:72,sectors:["D", "K", "C", "B"]},
  {iso3:'CRI',iso2:'CR',name:"Costa Rica",region:'LAC',income:'UMIC',rank:70,composite:56.0,tier:'MEDIUM',macro:58,policy:58,digital:60,human:54,infra:52,sustain:54,pop_m:5.2,gdp_b:67,fdi_b:3.8,internet_pct:82,sectors:["J", "C", "K", "L"]},
  {iso3:'CUB',iso2:'CU',name:"Cuba",region:'LAC',income:'UMIC',rank:210,composite:22.0,tier:'DEVELOPING',macro:25,policy:12,digital:25,human:30,infra:24,sustain:22,pop_m:11,gdp_b:107,fdi_b:0.1,internet_pct:68,sectors:["Q", "D"]},
  {iso3:'DOM',iso2:'DO',name:"Dominican Republic",region:'LAC',income:'UMIC',rank:106,composite:48.0,tier:'MEDIUM',macro:50,policy:46,digital:55,human:44,infra:46,sustain:42,pop_m:11,gdp_b:120,fdi_b:4.0,internet_pct:72,sectors:["L", "C", "K"]},
  {iso3:'ECU',iso2:'EC',name:"Ecuador",region:'LAC',income:'UMIC',rank:120,composite:44.0,tier:'MEDIUM',macro:46,policy:40,digital:48,human:44,infra:42,sustain:40,pop_m:18,gdp_b:116,fdi_b:1.4,internet_pct:65,sectors:["B", "D", "C"]},
  {iso3:'GRD',iso2:'GD',name:"Grenada",region:'LAC',income:'UMIC',rank:125,composite:42.0,tier:'EMERGING',macro:44,policy:42,digital:46,human:40,infra:38,sustain:42,pop_m:0.1,gdp_b:1.3,fdi_b:0.1,internet_pct:72,sectors:["L", "Q"]},
  {iso3:'GTM',iso2:'GT',name:"Guatemala",region:'LAC',income:'UMIC',rank:137,composite:40.0,tier:'EMERGING',macro:42,policy:36,digital:38,human:36,infra:38,sustain:36,pop_m:18,gdp_b:95,fdi_b:1.5,internet_pct:56,sectors:["C", "B", "L"]},
  {iso3:'GUY',iso2:'GY',name:"Guyana",region:'LAC',income:'UMIC',rank:119,composite:44.0,tier:'MEDIUM',macro:50,policy:42,digital:42,human:40,infra:40,sustain:42,pop_m:0.8,gdp_b:16,fdi_b:3.8,internet_pct:68,sectors:["B", "D", "C"]},
  {iso3:'HND',iso2:'HN',name:"Honduras",region:'LAC',income:'LMIC',rank:157,composite:36.0,tier:'DEVELOPING',macro:38,policy:32,digital:35,human:32,infra:34,sustain:36,pop_m:10,gdp_b:32,fdi_b:1.0,internet_pct:50,sectors:["C", "B", "L"]},
  {iso3:'HTI',iso2:'HT',name:"Haiti",region:'LAC',income:'LIC',rank:213,composite:18.0,tier:'DEVELOPING',macro:18,policy:14,digital:16,human:18,infra:16,sustain:22,pop_m:12,gdp_b:19,fdi_b:0.2,internet_pct:32,sectors:["C", "L"]},
  {iso3:'JAM',iso2:'JM',name:"Jamaica",region:'LAC',income:'UMIC',rank:121,composite:44.0,tier:'MEDIUM',macro:46,policy:44,digital:50,human:42,infra:40,sustain:40,pop_m:3.0,gdp_b:17,fdi_b:0.5,internet_pct:74,sectors:["L", "C", "K"]},
  {iso3:'KNA',iso2:'KN',name:"St. Kitts and Nevis",region:'LAC',income:'HIC',rank:122,composite:44.0,tier:'MEDIUM',macro:46,policy:44,digital:48,human:40,infra:42,sustain:42,pop_m:0.05,gdp_b:1.1,fdi_b:0.2,internet_pct:75,sectors:["L", "K"]},
  {iso3:'LCA',iso2:'LC',name:"St. Lucia",region:'LAC',income:'UMIC',rank:123,composite:44.0,tier:'MEDIUM',macro:46,policy:44,digital:48,human:40,infra:42,sustain:42,pop_m:0.2,gdp_b:2.2,fdi_b:0.2,internet_pct:74,sectors:["L", "K"]},
  {iso3:'MEX',iso2:'MX',name:"Mexico",region:'LAC',income:'UMIC',rank:81,composite:54.0,tier:'MEDIUM',macro:56,policy:50,digital:60,human:48,infra:54,sustain:52,pop_m:127,gdp_b:1328,fdi_b:36.1,internet_pct:76,sectors:["C", "D", "K", "B"]},
  {iso3:'NIC',iso2:'NI',name:"Nicaragua",region:'LAC',income:'LMIC',rank:165,composite:34.0,tier:'DEVELOPING',macro:36,policy:28,digital:32,human:32,infra:32,sustain:36,pop_m:6.7,gdp_b:17,fdi_b:0.6,internet_pct:46,sectors:["C", "B", "D"]},
  {iso3:'PAN',iso2:'PA',name:"Panama",region:'LAC',income:'HIC',rank:71,composite:56.0,tier:'MEDIUM',macro:58,policy:56,digital:62,human:48,infra:58,sustain:52,pop_m:4.4,gdp_b:74,fdi_b:3.2,internet_pct:74,sectors:["K", "H", "L", "J"]},
  {iso3:'PER',iso2:'PE',name:"Peru",region:'LAC',income:'UMIC',rank:107,composite:48.0,tier:'MEDIUM',macro:52,policy:46,digital:50,human:46,infra:46,sustain:44,pop_m:33,gdp_b:260,fdi_b:8.4,internet_pct:68,sectors:["B", "D", "K", "C"]},
  {iso3:'PRY',iso2:'PY',name:"Paraguay",region:'LAC',income:'UMIC',rank:138,composite:40.0,tier:'EMERGING',macro:42,policy:36,digital:40,human:36,infra:38,sustain:42,pop_m:7.4,gdp_b:42,fdi_b:0.5,internet_pct:68,sectors:["D", "C", "B"]},
  {iso3:'SLV',iso2:'SV',name:"El Salvador",region:'LAC',income:'UMIC',rank:139,composite:40.0,tier:'EMERGING',macro:42,policy:36,digital:42,human:36,infra:38,sustain:38,pop_m:6.5,gdp_b:35,fdi_b:0.8,internet_pct:62,sectors:["C", "L", "K"]},
  {iso3:'SUR',iso2:'SR',name:"Suriname",region:'LAC',income:'UMIC',rank:149,composite:38.0,tier:'EMERGING',macro:40,policy:32,digital:38,human:36,infra:36,sustain:38,pop_m:0.6,gdp_b:4.0,fdi_b:0.3,internet_pct:68,sectors:["B", "D"]},
  {iso3:'TTO',iso2:'TT',name:"Trinidad and Tobago",region:'LAC',income:'HIC',rank:108,composite:48.0,tier:'MEDIUM',macro:50,policy:46,digital:55,human:44,infra:48,sustain:42,pop_m:1.4,gdp_b:23,fdi_b:1.4,internet_pct:78,sectors:["D", "K", "C"]},
  {iso3:'URY',iso2:'UY',name:"Uruguay",region:'LAC',income:'HIC',rank:53,composite:60.0,tier:'MEDIUM',macro:62,policy:66,digital:66,human:58,infra:58,sustain:56,pop_m:3.5,gdp_b:72,fdi_b:2.8,internet_pct:82,sectors:["K", "C", "D", "L"]},
  {iso3:'VCT',iso2:'VC',name:"St. Vincent & Grenadines",region:'LAC',income:'UMIC',rank:140,composite:40.0,tier:'EMERGING',macro:42,policy:40,digital:44,human:38,infra:36,sustain:40,pop_m:0.1,gdp_b:1.0,fdi_b:0.1,internet_pct:68,sectors:["L", "Q"]},
  {iso3:'VEN',iso2:'VE',name:"Venezuela",region:'LAC',income:'UMIC',rank:212,composite:18.0,tier:'DEVELOPING',macro:18,policy:10,digital:32,human:36,infra:18,sustain:16,pop_m:32,gdp_b:95,fdi_b:0.2,internet_pct:72,sectors:["D", "B"]},
  {iso3:'ARE',iso2:'AE',name:"United Arab Emirates",region:'MENA',income:'HIC',rank:3,composite:80.0,tier:'FRONTIER',macro:82,policy:78,digital:84,human:54,infra:92,sustain:53,pop_m:10,gdp_b:504,fdi_b:30.7,internet_pct:99,sectors:["K", "J", "L", "H", "D"]},
  {iso3:'BHR',iso2:'BH',name:"Bahrain",region:'MENA',income:'HIC',rank:32,composite:66.0,tier:'HIGH',macro:68,policy:64,digital:72,human:48,infra:74,sustain:48,pop_m:1.7,gdp_b:43,fdi_b:2.2,internet_pct:98,sectors:["K", "J", "D", "L"]},
  {iso3:'DJI',iso2:'DJ',name:"Djibouti",region:'MENA',income:'LMIC',rank:151,composite:38.0,tier:'EMERGING',macro:40,policy:34,digital:36,human:30,infra:44,sustain:36,pop_m:1.1,gdp_b:4.1,fdi_b:0.4,internet_pct:52,sectors:["H", "D", "L"]},
  {iso3:'DZA',iso2:'DZ',name:"Algeria",region:'MENA',income:'LMIC',rank:141,composite:40.0,tier:'EMERGING',macro:44,policy:34,digital:42,human:40,infra:44,sustain:36,pop_m:45,gdp_b:195,fdi_b:1.4,internet_pct:71,sectors:["D", "B", "C"]},
  {iso3:'EGY',iso2:'EG',name:"Egypt",region:'MENA',income:'LMIC',rank:85,composite:52.4,tier:'MEDIUM',macro:55,policy:48,digital:52,human:48,infra:58,sustain:42,pop_m:105,gdp_b:395,fdi_b:9.8,internet_pct:73,sectors:["D", "C", "F", "H"]},
  {iso3:'IRN',iso2:'IR',name:"Iran",region:'MENA',income:'LMIC',rank:175,composite:30.0,tier:'DEVELOPING',macro:34,policy:18,digital:38,human:40,infra:40,sustain:22,pop_m:87,gdp_b:368,fdi_b:1.5,internet_pct:79,sectors:["D", "B", "C"]},
  {iso3:'IRQ',iso2:'IQ',name:"Iraq",region:'MENA',income:'UMIC',rank:187,composite:28.0,tier:'DEVELOPING',macro:32,policy:20,digital:28,human:28,infra:32,sustain:24,pop_m:42,gdp_b:268,fdi_b:3.2,internet_pct:74,sectors:["D", "B", "F"]},
  {iso3:'JOR',iso2:'JO',name:"Jordan",region:'MENA',income:'UMIC',rank:92,composite:52.0,tier:'MEDIUM',macro:52,policy:50,digital:58,human:50,infra:52,sustain:46,pop_m:10,gdp_b:50,fdi_b:1.4,internet_pct:83,sectors:["J", "K", "D", "C"]},
  {iso3:'KWT',iso2:'KW',name:"Kuwait",region:'MENA',income:'HIC',rank:65,composite:58.0,tier:'MEDIUM',macro:65,policy:54,digital:68,human:44,infra:68,sustain:42,pop_m:4.3,gdp_b:162,fdi_b:0.3,internet_pct:100,sectors:["D", "K", "F"]},
  {iso3:'LBN',iso2:'LB',name:"Lebanon",region:'MENA',income:'LMIC',rank:190,composite:28.0,tier:'DEVELOPING',macro:24,policy:18,digital:40,human:44,infra:24,sustain:24,pop_m:5.5,gdp_b:22,fdi_b:0.4,internet_pct:84,sectors:["K", "L"]},
  {iso3:'LBY',iso2:'LY',name:"Libya",region:'MENA',income:'UMIC',rank:207,composite:22.0,tier:'DEVELOPING',macro:24,policy:14,digital:22,human:28,infra:22,sustain:18,pop_m:7.0,gdp_b:48,fdi_b:0.3,internet_pct:48,sectors:["D", "B"]},
  {iso3:'MAR',iso2:'MA',name:"Morocco",region:'MENA',income:'LMIC',rank:97,composite:50.0,tier:'MEDIUM',macro:52,policy:50,digital:52,human:44,infra:54,sustain:46,pop_m:37,gdp_b:138,fdi_b:3.4,internet_pct:88,sectors:["C", "D", "H", "L"]},
  {iso3:'MLT',iso2:'MT',name:"Malta",region:'ECA',income:'HIC',rank:34,composite:66.0,tier:'HIGH',macro:68,policy:68,digital:74,human:60,infra:66,sustain:58,pop_m:0.5,gdp_b:19,fdi_b:8.2,internet_pct:88,sectors:["K", "J", "L"]},
  {iso3:'MRT',iso2:'MR',name:"Mauritania",region:'MENA',income:'LMIC',rank:176,composite:30.0,tier:'DEVELOPING',macro:32,policy:26,digital:26,human:26,infra:32,sustain:28,pop_m:4.6,gdp_b:10,fdi_b:0.5,internet_pct:32,sectors:["B", "D", "C"]},
  {iso3:'OMN',iso2:'OM',name:"Oman",region:'MENA',income:'HIC',rank:46,composite:62.0,tier:'MEDIUM',macro:65,policy:58,digital:66,human:46,infra:70,sustain:48,pop_m:4.6,gdp_b:104,fdi_b:3.2,internet_pct:96,sectors:["D", "L", "H", "K"]},
  {iso3:'PSE',iso2:'PS',name:"West Bank and Gaza",region:'MENA',income:'LMIC',rank:206,composite:22.0,tier:'DEVELOPING',macro:20,policy:16,digital:28,human:30,infra:18,sustain:18,pop_m:5.3,gdp_b:17,fdi_b:0.1,internet_pct:72,sectors:["C", "Q"]},
  {iso3:'QAT',iso2:'QA',name:"Qatar",region:'MENA',income:'HIC',rank:23,composite:71.2,tier:'HIGH',macro:74,policy:66,digital:76,human:50,infra:82,sustain:58,pop_m:2.9,gdp_b:236,fdi_b:5.2,internet_pct:99,sectors:["D", "K", "L", "J"]},
  {iso3:'SAU',iso2:'SA',name:"Saudi Arabia",region:'MENA',income:'HIC',rank:9,composite:68.1,tier:'HIGH',macro:74,policy:62,digital:72,human:48,infra:76,sustain:50,pop_m:36,gdp_b:1069,fdi_b:28.3,internet_pct:98,sectors:["D", "K", "F", "J", "L"]},
  {iso3:'SYR',iso2:'SY',name:"Syrian Arab Republic",region:'MENA',income:'LIC',rank:214,composite:10.0,tier:'DEVELOPING',macro:10,policy:6,digital:14,human:14,infra:8,sustain:8,pop_m:22,gdp_b:11,fdi_b:0.0,internet_pct:36,sectors:["D", "B"]},
  {iso3:'TUN',iso2:'TN',name:"Tunisia",region:'MENA',income:'LMIC',rank:124,composite:44.0,tier:'MEDIUM',macro:44,policy:42,digital:50,human:46,infra:44,sustain:40,pop_m:12,gdp_b:46,fdi_b:1.4,internet_pct:75,sectors:["C", "J", "D", "L"]},
  {iso3:'YEM',iso2:'YE',name:"Yemen",region:'MENA',income:'LIC',rank:213,composite:12.0,tier:'DEVELOPING',macro:12,policy:8,digital:14,human:12,infra:10,sustain:12,pop_m:34,gdp_b:21,fdi_b:0.1,internet_pct:26,sectors:["D", "B"]},
  {iso3:'CAN',iso2:'CA',name:"Canada",region:'NAM',income:'HIC',rank:6,composite:83.1,tier:'FRONTIER',macro:85,policy:88,digital:84,human:76,infra:82,sustain:82,pop_m:38,gdp_b:2140,fdi_b:48.3,internet_pct:95,sectors:["B", "D", "K", "J", "C"]},
  {iso3:'USA',iso2:'US',name:"United States",region:'NAM',income:'HIC',rank:2,composite:84.5,tier:'FRONTIER',macro:89,policy:83,digital:91,human:74,infra:86,sustain:68,pop_m:335,gdp_b:27360,fdi_b:285.0,internet_pct:92,sectors:["J", "K", "C", "D", "L"]},
  {iso3:'AFG',iso2:'AF',name:"Afghanistan",region:'SAS',income:'LIC',rank:214,composite:8.0,tier:'DEVELOPING',macro:8,policy:4,digital:10,human:8,infra:8,sustain:10,pop_m:42,gdp_b:15,fdi_b:0.0,internet_pct:18,sectors:["B", "D"]},
  {iso3:'BGD',iso2:'BD',name:"Bangladesh",region:'SAS',income:'LMIC',rank:116,composite:44.0,tier:'MEDIUM',macro:48,policy:40,digital:40,human:40,infra:42,sustain:42,pop_m:170,gdp_b:460,fdi_b:3.2,internet_pct:44,sectors:["C", "D", "H"]},
  {iso3:'BTN',iso2:'BT',name:"Bhutan",region:'SAS',income:'LMIC',rank:130,composite:42.0,tier:'EMERGING',macro:44,policy:46,digital:38,human:40,infra:38,sustain:48,pop_m:0.8,gdp_b:2.8,fdi_b:0.1,internet_pct:70,sectors:["D", "L", "Q"]},
  {iso3:'IND',iso2:'IN',name:"India",region:'SAS',income:'LMIC',rank:10,composite:62.3,tier:'MEDIUM',macro:68,policy:56,digital:59,human:69,infra:65,sustain:38,pop_m:1429,gdp_b:3730,fdi_b:71.0,internet_pct:52,sectors:["J", "C", "K", "D", "B"]},
  {iso3:'LKA',iso2:'LK',name:"Sri Lanka",region:'SAS',income:'LMIC',rank:114,composite:44.0,tier:'MEDIUM',macro:44,policy:38,digital:48,human:50,infra:44,sustain:42,pop_m:22,gdp_b:84,fdi_b:0.8,internet_pct:72,sectors:["C", "L", "K", "D"]},
  {iso3:'MDV',iso2:'MV',name:"Maldives",region:'SAS',income:'UMIC',rank:109,composite:48.0,tier:'MEDIUM',macro:50,policy:48,digital:60,human:44,infra:46,sustain:42,pop_m:0.5,gdp_b:6.9,fdi_b:0.4,internet_pct:72,sectors:["L", "K", "Q"]},
  {iso3:'NPL',iso2:'NP',name:"Nepal",region:'SAS',income:'LMIC',rank:166,composite:34.0,tier:'DEVELOPING',macro:36,policy:30,digital:32,human:34,infra:30,sustain:36,pop_m:30,gdp_b:40,fdi_b:0.2,internet_pct:48,sectors:["D", "L", "Q"]},
  {iso3:'PAK',iso2:'PK',name:"Pakistan",region:'SAS',income:'LMIC',rank:153,composite:36.0,tier:'DEVELOPING',macro:38,policy:30,digital:36,human:32,infra:36,sustain:34,pop_m:230,gdp_b:338,fdi_b:1.4,internet_pct:36,sectors:["C", "D", "B", "K"]},
  {iso3:'AGO',iso2:'AO',name:"Angola",region:'SSA',income:'LMIC',rank:177,composite:30.0,tier:'DEVELOPING',macro:32,policy:26,digital:26,human:24,infra:28,sustain:30,pop_m:35,gdp_b:93,fdi_b:3.8,internet_pct:33,sectors:["D", "B", "C"]},
  {iso3:'BDI',iso2:'BI',name:"Burundi",region:'SSA',income:'LIC',rank:211,composite:16.0,tier:'DEVELOPING',macro:16,policy:12,digital:12,human:14,infra:14,sustain:20,pop_m:13,gdp_b:3.1,fdi_b:0.0,internet_pct:12,sectors:["B", "Q"]},
  {iso3:'BEN',iso2:'BJ',name:"Benin",region:'SSA',income:'LMIC',rank:189,composite:28.0,tier:'DEVELOPING',macro:30,policy:26,digital:24,human:22,infra:26,sustain:30,pop_m:13,gdp_b:18,fdi_b:0.4,internet_pct:28,sectors:["C", "B", "L"]},
  {iso3:'BFA',iso2:'BF',name:"Burkina Faso",region:'SSA',income:'LIC',rank:210,composite:20.0,tier:'DEVELOPING',macro:20,policy:16,digital:16,human:14,infra:18,sustain:22,pop_m:22,gdp_b:19,fdi_b:0.3,internet_pct:20,sectors:["B", "C"]},
  {iso3:'BWA',iso2:'BW',name:"Botswana",region:'SSA',income:'UMIC',rank:112,composite:44.0,tier:'MEDIUM',macro:46,policy:50,digital:42,human:40,infra:40,sustain:42,pop_m:2.6,gdp_b:20,fdi_b:0.5,internet_pct:66,sectors:["B", "D", "L"]},
  {iso3:'CAF',iso2:'CF',name:"Central African Republic",region:'SSA',income:'LIC',rank:212,composite:12.0,tier:'DEVELOPING',macro:12,policy:8,digital:10,human:10,infra:10,sustain:16,pop_m:5.4,gdp_b:2.7,fdi_b:0.1,internet_pct:7,sectors:["B", "D"]},
  {iso3:'CIV',iso2:'CI',name:"Côte d\'Ivoire",region:'SSA',income:'LMIC',rank:167,composite:34.0,tier:'DEVELOPING',macro:36,policy:30,digital:30,human:26,infra:34,sustain:30,pop_m:27,gdp_b:71,fdi_b:1.0,internet_pct:36,sectors:["C", "B", "D", "H"]},
  {iso3:'CMR',iso2:'CM',name:"Cameroon",region:'SSA',income:'LMIC',rank:191,composite:28.0,tier:'DEVELOPING',macro:30,policy:22,digital:26,human:24,infra:28,sustain:28,pop_m:28,gdp_b:45,fdi_b:0.6,internet_pct:36,sectors:["B", "D", "C"]},
  {iso3:'COD',iso2:'CD',name:"Dem. Rep. Congo",region:'SSA',income:'LIC',rank:212,composite:16.0,tier:'DEVELOPING',macro:16,policy:10,digital:14,human:12,infra:14,sustain:20,pop_m:100,gdp_b:64,fdi_b:1.8,internet_pct:18,sectors:["B", "D", "C"]},
  {iso3:'COG',iso2:'CG',name:"Congo, Rep.",region:'SSA',income:'LMIC',rank:203,composite:24.0,tier:'DEVELOPING',macro:26,policy:18,digital:20,human:20,infra:22,sustain:24,pop_m:5.8,gdp_b:15,fdi_b:1.4,internet_pct:28,sectors:["D", "B"]},
  {iso3:'COM',iso2:'KM',name:"Comoros",region:'SSA',income:'LMIC',rank:207,composite:22.0,tier:'DEVELOPING',macro:22,policy:18,digital:18,human:20,infra:20,sustain:26,pop_m:0.9,gdp_b:1.4,fdi_b:0.0,internet_pct:22,sectors:["Q", "L"]},
  {iso3:'CPV',iso2:'CV',name:"Cabo Verde",region:'SSA',income:'LMIC',rank:113,composite:44.0,tier:'MEDIUM',macro:46,policy:48,digital:44,human:42,infra:38,sustain:44,pop_m:0.6,gdp_b:2.3,fdi_b:0.2,internet_pct:70,sectors:["L", "K", "Q"]},
  {iso3:'ERI',iso2:'ER',name:"Eritrea",region:'SSA',income:'LIC',rank:213,composite:12.0,tier:'DEVELOPING',macro:12,policy:6,digital:10,human:12,infra:10,sustain:14,pop_m:3.5,gdp_b:2.1,fdi_b:0.1,internet_pct:8,sectors:["B", "D"]},
  {iso3:'ETH',iso2:'ET',name:"Ethiopia",region:'SSA',income:'LIC',rank:178,composite:30.0,tier:'DEVELOPING',macro:34,policy:26,digital:22,human:24,infra:30,sustain:28,pop_m:126,gdp_b:156,fdi_b:3.8,internet_pct:24,sectors:["C", "D", "B", "H"]},
  {iso3:'GAB',iso2:'GA',name:"Gabon",region:'SSA',income:'UMIC',rank:153,composite:36.0,tier:'DEVELOPING',macro:38,policy:30,digital:36,human:32,infra:36,sustain:32,pop_m:2.4,gdp_b:20,fdi_b:0.8,internet_pct:62,sectors:["D", "B", "C"]},
  {iso3:'GHA',iso2:'GH',name:"Ghana",region:'SSA',income:'LMIC',rank:111,composite:44.0,tier:'MEDIUM',macro:46,policy:44,digital:40,human:38,infra:40,sustain:42,pop_m:33,gdp_b:76,fdi_b:2.1,internet_pct:53,sectors:["D", "B", "C", "K"]},
  {iso3:'GIN',iso2:'GN',name:"Guinea",region:'SSA',income:'LIC',rank:211,composite:20.0,tier:'DEVELOPING',macro:22,policy:16,digital:16,human:14,infra:18,sustain:22,pop_m:14,gdp_b:17,fdi_b:0.5,internet_pct:22,sectors:["B", "D"]},
  {iso3:'GMB',iso2:'GM',name:"Gambia",region:'SSA',income:'LIC',rank:197,composite:26.0,tier:'DEVELOPING',macro:26,policy:22,digital:22,human:22,infra:22,sustain:30,pop_m:2.7,gdp_b:2.2,fdi_b:0.1,internet_pct:30,sectors:["Q", "L", "B"]},
  {iso3:'GNB',iso2:'GW',name:"Guinea-Bissau",region:'SSA',income:'LIC',rank:213,composite:18.0,tier:'DEVELOPING',macro:18,policy:14,digital:14,human:14,infra:16,sustain:20,pop_m:2.1,gdp_b:1.7,fdi_b:0.0,internet_pct:18,sectors:["B", "Q"]},
  {iso3:'GNQ',iso2:'GQ',name:"Equatorial Guinea",region:'SSA',income:'UMIC',rank:204,composite:24.0,tier:'DEVELOPING',macro:26,policy:16,digital:20,human:20,infra:24,sustain:20,pop_m:1.5,gdp_b:12,fdi_b:0.5,internet_pct:48,sectors:["D", "B"]},
  {iso3:'KEN',iso2:'KE',name:"Kenya",region:'SSA',income:'LMIC',rank:93,composite:51.3,tier:'MEDIUM',macro:54,policy:50,digital:50,human:44,infra:48,sustain:44,pop_m:54,gdp_b:118,fdi_b:1.8,internet_pct:58,sectors:["J", "K", "D", "C"]},
  {iso3:'LBR',iso2:'LR',name:"Liberia",region:'SSA',income:'LIC',rank:208,composite:22.0,tier:'DEVELOPING',macro:22,policy:18,digital:18,human:16,infra:18,sustain:26,pop_m:5.4,gdp_b:4.0,fdi_b:0.4,internet_pct:22,sectors:["B", "D"]},
  {iso3:'LSO',iso2:'LS',name:"Lesotho",region:'SSA',income:'LMIC',rank:192,composite:28.0,tier:'DEVELOPING',macro:28,policy:24,digital:26,human:26,infra:24,sustain:32,pop_m:2.2,gdp_b:2.8,fdi_b:0.2,internet_pct:38,sectors:["C", "D", "Q"]},
  {iso3:'MDG',iso2:'MG',name:"Madagascar",region:'SSA',income:'LIC',rank:209,composite:22.0,tier:'DEVELOPING',macro:22,policy:18,digital:18,human:16,infra:18,sustain:28,pop_m:29,gdp_b:15,fdi_b:0.5,internet_pct:20,sectors:["C", "B", "D"]},
  {iso3:'MLI',iso2:'ML',name:"Mali",region:'SSA',income:'LIC',rank:211,composite:20.0,tier:'DEVELOPING',macro:20,policy:14,digital:16,human:14,infra:18,sustain:22,pop_m:23,gdp_b:19,fdi_b:0.4,internet_pct:28,sectors:["B", "D", "C"]},
  {iso3:'MOZ',iso2:'MZ',name:"Mozambique",region:'SSA',income:'LIC',rank:202,composite:24.0,tier:'DEVELOPING',macro:24,policy:20,digital:18,human:16,infra:22,sustain:28,pop_m:33,gdp_b:18,fdi_b:2.4,internet_pct:21,sectors:["D", "B", "C"]},
  {iso3:'MUS',iso2:'MU',name:"Mauritius",region:'SSA',income:'HIC',rank:43,composite:62.0,tier:'MEDIUM',macro:64,policy:66,digital:66,human:56,infra:60,sustain:58,pop_m:1.3,gdp_b:14,fdi_b:0.5,internet_pct:74,sectors:["K", "L", "J", "Q"]},
  {iso3:'MWI',iso2:'MW',name:"Malawi",region:'SSA',income:'LIC',rank:210,composite:20.0,tier:'DEVELOPING',macro:20,policy:16,digital:14,human:14,infra:16,sustain:24,pop_m:20,gdp_b:13,fdi_b:0.2,internet_pct:14,sectors:["C", "B", "Q"]},
  {iso3:'NAM',iso2:'NA',name:"Namibia",region:'SSA',income:'UMIC',rank:110,composite:44.0,tier:'MEDIUM',macro:46,policy:48,digital:44,human:38,infra:42,sustain:44,pop_m:2.7,gdp_b:13,fdi_b:0.5,internet_pct:56,sectors:["B", "D", "L"]},
  {iso3:'NER',iso2:'NE',name:"Niger",region:'SSA',income:'LIC',rank:212,composite:16.0,tier:'DEVELOPING',macro:16,policy:12,digital:12,human:8,infra:14,sustain:18,pop_m:25,gdp_b:15,fdi_b:0.5,internet_pct:14,sectors:["B", "D"]},
  {iso3:'NGA',iso2:'NG',name:"Nigeria",region:'SSA',income:'LMIC',rank:125,composite:42.1,tier:'EMERGING',macro:46,policy:36,digital:42,human:40,infra:36,sustain:36,pop_m:218,gdp_b:477,fdi_b:4.1,internet_pct:55,sectors:["D", "B", "C", "K", "J"]},
  {iso3:'RWA',iso2:'RW',name:"Rwanda",region:'SSA',income:'LIC',rank:111,composite:44.0,tier:'MEDIUM',macro:46,policy:52,digital:40,human:38,infra:40,sustain:44,pop_m:14,gdp_b:14,fdi_b:0.4,internet_pct:52,sectors:["J", "K", "D", "L"]},
  {iso3:'SDN',iso2:'SD',name:"Sudan",region:'SSA',income:'LIC',rank:213,composite:18.0,tier:'DEVELOPING',macro:18,policy:10,digital:18,human:14,infra:14,sustain:16,pop_m:46,gdp_b:35,fdi_b:0.5,internet_pct:28,sectors:["B", "D", "C"]},
  {iso3:'SEN',iso2:'SN',name:"Senegal",region:'SSA',income:'LMIC',rank:156,composite:36.0,tier:'DEVELOPING',macro:38,policy:36,digital:34,human:30,infra:34,sustain:36,pop_m:17,gdp_b:27,fdi_b:1.4,internet_pct:46,sectors:["B", "D", "C", "L"]},
  {iso3:'SLE',iso2:'SL',name:"Sierra Leone",region:'SSA',income:'LIC',rank:211,composite:20.0,tier:'DEVELOPING',macro:20,policy:16,digital:16,human:12,infra:16,sustain:22,pop_m:8.4,gdp_b:4.6,fdi_b:0.4,internet_pct:22,sectors:["B", "D", "Q"]},
  {iso3:'SOM',iso2:'SO',name:"Somalia",region:'SSA',income:'LIC',rank:214,composite:10.0,tier:'DEVELOPING',macro:10,policy:6,digital:10,human:8,infra:8,sustain:10,pop_m:18,gdp_b:7.6,fdi_b:0.1,internet_pct:18,sectors:["B", "D"]},
  {iso3:'SSD',iso2:'SS',name:"South Sudan",region:'SSA',income:'LIC',rank:214,composite:10.0,tier:'DEVELOPING',macro:10,policy:6,digital:8,human:8,infra:8,sustain:10,pop_m:11,gdp_b:7.5,fdi_b:0.3,internet_pct:8,sectors:["D", "B"]},
  {iso3:'STP',iso2:'ST',name:"São Tomé and Príncipe",region:'SSA',income:'LMIC',rank:193,composite:28.0,tier:'DEVELOPING',macro:28,policy:26,digital:26,human:24,infra:22,sustain:34,pop_m:0.2,gdp_b:0.5,fdi_b:0.0,internet_pct:32,sectors:["Q", "L"]},
  {iso3:'SWZ',iso2:'SZ',name:"Eswatini",region:'SSA',income:'LMIC',rank:180,composite:30.0,tier:'DEVELOPING',macro:30,policy:26,digital:26,human:26,infra:28,sustain:30,pop_m:1.2,gdp_b:4.8,fdi_b:0.1,internet_pct:47,sectors:["C", "D", "L"]},
  {iso3:'TCD',iso2:'TD',name:"Chad",region:'SSA',income:'LIC',rank:213,composite:14.0,tier:'DEVELOPING',macro:14,policy:10,digital:10,human:10,infra:12,sustain:16,pop_m:18,gdp_b:12,fdi_b:0.5,internet_pct:14,sectors:["D", "B"]},
  {iso3:'TGO',iso2:'TG',name:"Togo",region:'SSA',income:'LIC',rank:194,composite:28.0,tier:'DEVELOPING',macro:28,policy:24,digital:24,human:20,infra:26,sustain:30,pop_m:8.7,gdp_b:8.1,fdi_b:0.4,internet_pct:28,sectors:["B", "H", "L"]},
  {iso3:'TZA',iso2:'TZ',name:"Tanzania",region:'SSA',income:'LMIC',rank:154,composite:36.0,tier:'DEVELOPING',macro:38,policy:34,digital:30,human:28,infra:34,sustain:38,pop_m:64,gdp_b:79,fdi_b:1.2,internet_pct:28,sectors:["D", "B", "C", "L"]},
  {iso3:'UGA',iso2:'UG',name:"Uganda",region:'SSA',income:'LIC',rank:179,composite:30.0,tier:'DEVELOPING',macro:32,policy:28,digital:24,human:22,infra:26,sustain:32,pop_m:48,gdp_b:45,fdi_b:0.8,internet_pct:26,sectors:["D", "B", "C"]},
  {iso3:'ZAF',iso2:'ZA',name:"South Africa",region:'SSA',income:'UMIC',rank:94,composite:51.3,tier:'MEDIUM',macro:52,policy:52,digital:55,human:46,infra:52,sustain:42,pop_m:60,gdp_b:373,fdi_b:5.4,internet_pct:72,sectors:["D", "K", "B", "C", "J"]},
  {iso3:'ZMB',iso2:'ZM',name:"Zambia",region:'SSA',income:'LMIC',rank:181,composite:30.0,tier:'DEVELOPING',macro:30,policy:26,digital:24,human:22,infra:28,sustain:32,pop_m:20,gdp_b:29,fdi_b:1.0,internet_pct:26,sectors:["B", "D", "C"]},
  {iso3:'ZWE',iso2:'ZW',name:"Zimbabwe",region:'SSA',income:'LMIC',rank:196,composite:26.0,tier:'DEVELOPING',macro:26,policy:20,digital:26,human:26,infra:22,sustain:24,pop_m:16,gdp_b:26,fdi_b:0.4,internet_pct:34,sectors:["B", "D", "C"]},
  {iso3:'ISR',iso2:'IL',name:"Israel",region:'MENA',income:'HIC',rank:21,composite:72.0,tier:'HIGH',macro:74,policy:70,digital:78,human:68,infra:72,sustain:68,pop_m:9.7,gdp_b:522,fdi_b:24.2,internet_pct:92,sectors:["J", "K", "C", "D"]},
  {iso3:'AND',iso2:'AD',name:"Andorra",region:'ECA',income:'HIC',rank:45,composite:62.0,tier:'MEDIUM',macro:64,policy:66,digital:70,human:58,infra:62,sustain:60,pop_m:0.08,gdp_b:3.3,fdi_b:0.5,internet_pct:98,sectors:["K", "L", "J"]},
  {iso3:'MCO',iso2:'MC',name:"Monaco",region:'ECA',income:'HIC',rank:20,composite:72.0,tier:'HIGH',macro:74,policy:72,digital:76,human:66,infra:78,sustain:68,pop_m:0.04,gdp_b:7.7,fdi_b:1.2,internet_pct:99,sectors:["K", "L", "J"]},
  {iso3:'SMR',iso2:'SM',name:"San Marino",region:'ECA',income:'HIC',rank:44,composite:62.0,tier:'MEDIUM',macro:64,policy:66,digital:70,human:60,infra:62,sustain:60,pop_m:0.03,gdp_b:1.8,fdi_b:0.2,internet_pct:98,sectors:["K", "J", "C"]},
  {iso3:'DJI',iso2:'DJ',name:"Djibouti",region:'SSA',income:'LMIC',rank:151,composite:38.0,tier:'EMERGING',macro:40,policy:34,digital:36,human:30,infra:44,sustain:36,pop_m:1.1,gdp_b:4.1,fdi_b:0.4,internet_pct:52,sectors:["H", "D", "L"]},
  {iso3:'PRK',iso2:'KP',name:"North Korea",region:'EAP',income:'LIC',rank:215,composite:8.0,tier:'DEVELOPING',macro:10,policy:4,digital:8,human:14,infra:12,sustain:8,pop_m:26,gdp_b:17,fdi_b:0.0,internet_pct:0,sectors:["B", "C"]},
  {iso3:'CPV',iso2:'CV',name:"Cabo Verde",region:'SSA',income:'LMIC',rank:113,composite:44.0,tier:'MEDIUM',macro:46,policy:48,digital:44,human:42,infra:38,sustain:44,pop_m:0.6,gdp_b:2.3,fdi_b:0.2,internet_pct:70,sectors:["L", "K", "Q"]},
  {iso3:'FSM',iso2:'FM',name:"Micronesia",region:'EAP',income:'LMIC',rank:203,composite:24.0,tier:'DEVELOPING',macro:24,policy:20,digital:20,human:26,infra:18,sustain:28,pop_m:0.1,gdp_b:0.4,fdi_b:0.0,internet_pct:40,sectors:["Q", "L"]},
  {iso3:'GUM',iso2:'GU',name:"Guam",region:'EAP',income:'HIC',rank:100,composite:48.0,tier:'MEDIUM',macro:50,policy:48,digital:55,human:44,infra:48,sustain:44,pop_m:0.2,gdp_b:6.1,fdi_b:0.2,internet_pct:85,sectors:["L", "H", "Q"]},
  {iso3:'NCL',iso2:'NC',name:"New Caledonia",region:'EAP',income:'HIC',rank:76,composite:55.0,tier:'MEDIUM',macro:56,policy:54,digital:58,human:50,infra:56,sustain:56,pop_m:0.3,gdp_b:9.9,fdi_b:0.8,internet_pct:82,sectors:["B", "L", "D"]},
  {iso3:'PYF',iso2:'PF',name:"French Polynesia",region:'EAP',income:'HIC',rank:89,composite:52.0,tier:'MEDIUM',macro:54,policy:52,digital:58,human:48,infra:52,sustain:52,pop_m:0.3,gdp_b:5.4,fdi_b:0.2,internet_pct:76,sectors:["L", "K", "Q"]},
  {iso3:'XKX',iso2:'XK',name:"Kosovo",region:'ECA',income:'UMIC',rank:156,composite:36.0,tier:'DEVELOPING',macro:38,policy:34,digital:42,human:36,infra:32,sustain:34,pop_m:1.8,gdp_b:10,fdi_b:0.4,internet_pct:76,sectors:["C", "L"]},
  {iso3:'GIB',iso2:'GI',name:"Gibraltar",region:'ECA',income:'HIC',rank:38,composite:64.0,tier:'HIGH',macro:66,policy:66,digital:72,human:60,infra:66,sustain:58,pop_m:0.04,gdp_b:2.6,fdi_b:0.5,internet_pct:98,sectors:["K", "J", "L"]},
  {iso3:'FRO',iso2:'FO',name:"Faroe Islands",region:'ECA',income:'HIC',rank:43,composite:62.0,tier:'MEDIUM',macro:64,policy:64,digital:72,human:58,infra:62,sustain:68,pop_m:0.05,gdp_b:3.8,fdi_b:0.1,internet_pct:98,sectors:["C", "D", "K"]},
  {iso3:'GRL',iso2:'GL',name:"Greenland",region:'NAM',income:'HIC',rank:87,composite:52.0,tier:'MEDIUM',macro:54,policy:56,digital:60,human:50,infra:48,sustain:62,pop_m:0.06,gdp_b:3.2,fdi_b:0.0,internet_pct:72,sectors:["B", "D", "L"]},
  {iso3:'CUW',iso2:'CW',name:"Curaçao",region:'LAC',income:'HIC',rank:88,composite:52.0,tier:'MEDIUM',macro:54,policy:52,digital:58,human:48,infra:52,sustain:46,pop_m:0.2,gdp_b:2.9,fdi_b:0.5,internet_pct:80,sectors:["K", "L", "H"]},
  {iso3:'ABW',iso2:'AW',name:"Aruba",region:'LAC',income:'HIC',rank:90,composite:52.0,tier:'MEDIUM',macro:54,policy:52,digital:58,human:48,infra:52,sustain:46,pop_m:0.1,gdp_b:3.4,fdi_b:0.3,internet_pct:84,sectors:["L", "K", "H"]},
  {iso3:'BMU',iso2:'BM',name:"Bermuda",region:'NAM',income:'HIC',rank:42,composite:62.0,tier:'MEDIUM',macro:64,policy:64,digital:70,human:58,infra:62,sustain:58,pop_m:0.06,gdp_b:7.6,fdi_b:2.1,internet_pct:98,sectors:["K", "L", "J"]},
  {iso3:'CYM',iso2:'KY',name:"Cayman Islands",region:'LAC',income:'HIC',rank:43,composite:62.0,tier:'MEDIUM',macro:64,policy:62,digital:68,human:56,infra:62,sustain:52,pop_m:0.07,gdp_b:6.4,fdi_b:1.8,internet_pct:92,sectors:["K", "L", "J"]},
  {iso3:'IMN',iso2:'IM',name:"Isle of Man",region:'ECA',income:'HIC',rank:37,composite:64.0,tier:'HIGH',macro:66,policy:68,digital:72,human:62,infra:64,sustain:60,pop_m:0.08,gdp_b:6.8,fdi_b:0.8,internet_pct:98,sectors:["K", "J", "L"]},
  {iso3:'JEY',iso2:'JE',name:"Jersey",region:'ECA',income:'HIC',rank:33,composite:66.0,tier:'HIGH',macro:68,policy:70,digital:72,human:62,infra:66,sustain:62,pop_m:0.1,gdp_b:5.1,fdi_b:1.4,internet_pct:98,sectors:["K", "J", "L"]},
  {iso3:'GGY',iso2:'GG',name:"Guernsey",region:'ECA',income:'HIC',rank:36,composite:65.0,tier:'HIGH',macro:67,policy:70,digital:72,human:61,infra:66,sustain:62,pop_m:0.07,gdp_b:3.5,fdi_b:0.8,internet_pct:98,sectors:["K", "J", "L"]},
  {iso3:'MNP',iso2:'MP',name:"Northern Mariana Islands",region:'EAP',income:'HIC',rank:148,composite:38.0,tier:'EMERGING',macro:40,policy:38,digital:44,human:36,infra:36,sustain:38,pop_m:0.06,gdp_b:1.2,fdi_b:0.1,internet_pct:74,sectors:["L", "Q"]},
  {iso3:'SXM',iso2:'SX',name:"Sint Maarten",region:'LAC',income:'HIC',rank:116,composite:44.0,tier:'MEDIUM',macro:46,policy:44,digital:50,human:40,infra:44,sustain:40,pop_m:0.04,gdp_b:1.3,fdi_b:0.2,internet_pct:82,sectors:["L", "K", "H"]},
];

const DIMS = ['macro','policy','digital','human','infra','sustain'] as const;
const DIM_LABELS: Record<string,string> = {
  macro:'Macro Foundations',policy:'Policy & Institutional',
  digital:'Digital Foundations',human:'Human Capital',
  infra:'Infrastructure',sustain:'Sustainability',
};
const DIM_WEIGHTS: Record<string,string> = {
  macro:'20%',policy:'18%',digital:'15%',human:'15%',infra:'15%',sustain:'17%',
};
const TIER_STYLES: Record<string,{bg:string,text:string}> = {
  FRONTIER:   {bg:'bg-emerald-100',text:'text-emerald-700'},
  HIGH:       {bg:'bg-blue-100',   text:'text-blue-700'},
  MEDIUM:     {bg:'bg-amber-100',  text:'text-amber-700'},
  EMERGING:   {bg:'bg-orange-100', text:'text-orange-700'},
  DEVELOPING: {bg:'bg-red-100',    text:'text-red-600'},
};
const REGIONS = ['','EAP','ECA','LAC','MENA','NAM','SAS','SSA'];
const TIERS   = ['','FRONTIER','HIGH','MEDIUM','EMERGING','DEVELOPING'];
const INCOMES = ['','HIC','UMIC','LMIC','LIC'];

function RadarMini({e}: {e:Economy}) {
  const keys = DIMS; const n=6; const cx=50; const cy=50; const r=38;
  function polar(i:number, v:number) {
    const a = (i*360/n - 90) * Math.PI/180;
    return {x: cx+(v/100)*r*Math.cos(a), y: cy+(v/100)*r*Math.sin(a)};
  }
  const pts  = keys.map((k,i) => polar(i, (e as any)[k]));
  const path = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+'Z';
  const rings = [25,50,75,100].map(ring => {
    const rpts = keys.map((_,i) => polar(i,ring));
    return rpts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+'Z';
  });
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 flex-shrink-0">
      {rings.map((d,i) => <path key={i} d={d} fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>)}
      {keys.map((_,i) => { const p=polar(i,100); return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#e2e8f0" strokeWidth="0.5"/>; })}
      <path d={path} fill="#3b82f620" stroke="#3b82f6" strokeWidth="1.5"/>
    </svg>
  );
}


// Q4 2025 scores for trend arrows (previous quarter comparison)
const Q4_2025_SCORES: Record<string,number> = {
  SGP:87.8,CHE:87.0,ARE:75.8,DEU:77.4,USA:83.9,GBR:78.0,NOR:82.6,SAU:65.2,
  IND:60.8,BRA:53.0,NGA:40.8,AUS:81.4,JPN:78.9,KOR:77.2,VNM:56.8,EGY:50.9,
  IDN:55.8,MYS:65.1,THA:62.4,NLD:79.8,IRL:75.8,FRA:75.4,ITA:67.2,ESP:69.4,
  POL:61.2,TUR:50.8,KAZ:50.8,ZAF:50.2,KEN:50.0,QAT:70.0,
};

function TrendArrow({iso3, current}: {iso3:string, current:number}) {
  const prev = Q4_2025_SCORES[iso3];
  if (!prev) return null;
  const diff = current - prev;
  if (Math.abs(diff) < 0.2) return <span className="text-slate-400 text-xs">→</span>;
  return diff > 0
    ? <span className="text-emerald-500 text-xs font-bold">↑{diff.toFixed(1)}</span>
    : <span className="text-red-400 text-xs font-bold">↓{Math.abs(diff).toFixed(1)}</span>;
}

export default function GFRPage() {
  const [selected, setSelected] = useState<Economy>(GFR_ALL[0]);
  const [region,   setRegion]   = useState('');
  const [tier,     setTier]     = useState('');
  const [income,   setIncome]   = useState('');
  const [search,   setSearch]   = useState('');
  const [sortBy,   setSortBy]   = useState<'rank'|'composite'|'fdi_b'|'gdp_b'>('rank');
  const [page,     setPage]     = useState(1);
  const [showDetail,setShowDetail]= useState(false);
  const PER_PAGE = 25;

  const filtered = useMemo(() => {
    let list = [...GFR_ALL];
    if (region) list = list.filter(e => e.region === region);
    if (tier)   list = list.filter(e => e.tier   === tier);
    if (income) list = list.filter(e => e.income === income);
    if (search) list = list.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.iso3.includes(search.toUpperCase())
    );
    list.sort((a,b) => sortBy === 'rank' ? a.rank-b.rank : (b as any)[sortBy]-(a as any)[sortBy]);
    return list;
  }, [region, tier, income, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const ts = TIER_STYLES[selected.tier] || TIER_STYLES.DEVELOPING;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-[#0A2540] text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Q1 2026 · Updated March 2026</div>
          <h1 className="text-3xl font-black mb-2">Global Future Readiness Ranking</h1>
          <p className="text-blue-200 text-sm max-w-3xl">
            215 economies scored across 6 weighted dimensions. Macro Foundations (20%) · Policy & Institutional (18%) · Digital Foundations (15%) · Human Capital (15%) · Infrastructure (15%) · Sustainability (17%).
          </p>
          <div className="flex gap-6 mt-5 text-sm">
            {[
              {l:'Frontier Economies', v:GFR_ALL.filter(e=>e.tier==='FRONTIER').length, c:'text-emerald-400'},
              {l:'High Readiness',     v:GFR_ALL.filter(e=>e.tier==='HIGH').length,     c:'text-blue-400'},
              {l:'Medium Readiness',   v:GFR_ALL.filter(e=>e.tier==='MEDIUM').length,   c:'text-amber-400'},
              {l:'Emerging',           v:GFR_ALL.filter(e=>e.tier==='EMERGING').length, c:'text-orange-400'},
              {l:'Developing',         v:GFR_ALL.filter(e=>e.tier==='DEVELOPING').length,c:'text-red-400'},
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                <div className="text-blue-400 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
          <input placeholder="Search economy…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs w-40 focus:outline-none focus:border-blue-400"/>
          <select value={region} onChange={e=>{setRegion(e.target.value);setPage(1)}}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
            {REGIONS.map(r=><option key={r} value={r}>{r||'All Regions'}</option>)}
          </select>
          <select value={tier} onChange={e=>{setTier(e.target.value);setPage(1)}}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
            {TIERS.map(t=><option key={t} value={t}>{t||'All Tiers'}</option>)}
          </select>
          <select value={income} onChange={e=>{setIncome(e.target.value);setPage(1)}}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
            {INCOMES.map(i=><option key={i} value={i}>{i||'All Income Groups'}</option>)}
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
            <option value="rank">Sort: GFR Rank</option>
            <option value="composite">Sort: Score</option>
            <option value="fdi_b">Sort: FDI Inflows</option>
            <option value="gdp_b">Sort: GDP</option>
          </select>
          <span className="text-xs text-slate-400 ml-auto">{filtered.length} economies</span>
        <button onClick={()=>exportGFR(filtered)}
          className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1">
          ↓ CSV
        </button>
        <button onClick={()=>exportJSON(filtered,'GFR_Rankings_Q1_2026')}
          className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          ↓ JSON
        </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Rankings table */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden mb-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['#','Economy','Region','Score','Tier','FDI','GDP'].map(h=>(
                      <th key={h} className="text-left px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(e => {
                    const ts2 = TIER_STYLES[e.tier] || TIER_STYLES.DEVELOPING;
                    return (
                      <tr key={e.iso3} onClick={()=>setSelected(e)}
                        className={`border-b border-slate-50 cursor-pointer transition-colors ${selected.iso3===e.iso3?'bg-blue-50':'hover:bg-slate-50'}`}>
                        <td className="px-3 py-2.5 font-black text-slate-400 w-8">#{e.rank}</td>
                        <td className="px-3 py-2.5">
                          <div className="font-bold text-[#0A2540]">{e.name}</div>
                          <div className="text-slate-400 font-mono text-xs">{e.iso3}</div>
                        </td>
                        <td className="px-3 py-2.5 text-slate-500">{e.region}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="font-black text-blue-600 text-base">{e.composite}</div>
                            <TrendArrow iso3={e.iso3} current={e.composite}/>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full w-16 mt-0.5">
                            <div className="h-full bg-blue-500 rounded-full" style={{width:`${e.composite}%`}}/>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ts2.bg} ${ts2.text}`}>{e.tier}</span>
                        </td>
                        <td className="px-3 py-2.5 font-bold text-slate-600">${e.fdi_b}B</td>
                        <td className="px-3 py-2.5 text-slate-500">${e.gdp_b >= 1000 ? (e.gdp_b/1000).toFixed(1)+'T' : e.gdp_b+'B'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg disabled:opacity-40 hover:border-blue-300">
                  ← Prev
                </button>
                <span className="text-xs text-slate-500">Page {page} of {totalPages} · {filtered.length} economies</span>
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg disabled:opacity-40 hover:border-blue-300">
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xl font-black text-[#0A2540]">{selected.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selected.region} · {selected.iso3} · {selected.income}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-blue-600">{selected.composite}</div>
                  <div className="text-xs text-slate-400">Rank #{selected.rank}</div>
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <RadarMini e={selected}/>
              </div>

              <span className={`inline-flex text-xs font-bold px-3 py-1 rounded-full mb-4 ${ts.bg} ${ts.text}`}>
                {selected.tier}
              </span>

              <div className="space-y-2.5 mb-4">
                {DIMS.map(dim => (
                  <div key={dim}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-500">{DIM_LABELS[dim]} <span className="text-slate-300">({DIM_WEIGHTS[dim]})</span></span>
                      <span className="font-bold text-[#0A2540]">{(selected as any)[dim]}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width:`${(selected as any)[dim]}%`,
                          background:(selected as any)[dim]>=75?'#10b981':(selected as any)[dim]>=55?'#3b82f6':'#f59e0b'
                        }}/>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  {l:'Population', v:`${selected.pop_m}M`},
                  {l:'GDP',        v:`$${selected.gdp_b >= 1000 ? (selected.gdp_b/1000).toFixed(1)+'T' : selected.gdp_b+'B'}`},
                  {l:'FDI Inflows',v:`$${selected.fdi_b}B`},
                  {l:'Internet',   v:`${selected.internet_pct}%`},
                ].map(s=>(
                  <div key={s.l} className="bg-slate-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-slate-400 mb-0.5">{s.l}</div>
                    <div className="font-bold text-sm text-[#0A2540]">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <div className="text-xs font-bold text-slate-400 mb-1.5">Primary FDI Sectors</div>
                <div className="flex flex-wrap gap-1">
                  {(selected.sectors||[]).slice(0,6).map(s=>(
                    <span key={s} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold">{s}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-[#0A2540] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                  Full Report — 10 FIC
                </button>
                <button onClick={()=>exportGFR(filtered.length>0?filtered:GFR_ALL)}
                  className="border border-slate-200 text-slate-600 text-xs font-bold px-3 py-2.5 rounded-xl hover:border-blue-300 transition-colors flex-shrink-0">
                  CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Economy 40-indicator modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <div className="font-black text-lg text-[#0A2540]">{selected.name} — All Indicators</div>
                <div className="text-xs text-slate-400">{selected.iso3} · {selected.region} · {selected.tier} · Q1 2026</div>
              </div>
              <button onClick={()=>setShowDetail(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Composite score */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="font-black text-[#0A2540]">GFR Composite Score</div>
                  <div className="text-4xl font-black text-blue-600">{selected.composite}</div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-blue-600">
                  <span>Rank #{selected.rank} / 215</span>
                  <span>{selected.tier} tier</span>
                  <span>{selected.region}</span>
                </div>
              </div>

              {/* 6 dimension breakdown */}
              {[
                {dim:'Macro Foundations (20%)',   key:'macro',   indicators:['GDP Growth','GDP per Capita','Inflation Rate','Current Account','Sovereign Rating','Debt/GDP','FX Stability','Trade Openness']},
                {dim:'Policy & Institutional (18%)',key:'policy',indicators:['Rule of Law','Regulatory Quality','Control of Corruption','Political Stability','Government Effectiveness','Ease of Doing Business','FDI Policy Index','Property Rights']},
                {dim:'Digital Foundations (15%)', key:'digital', indicators:['Internet Penetration','Mobile Broadband','5G Coverage','Digital Gov Index','AI Readiness','Cloud Adoption','Cybersecurity Rating','e-Commerce Index']},
                {dim:'Human Capital (15%)',        key:'human',   indicators:['Tertiary Enrolment','PISA Score','Labour Productivity','English Proficiency','Skills Index','R&D Spending','Brain Drain Index','Gender Inclusion']},
                {dim:'Infrastructure (15%)',       key:'infra',   indicators:['LPI Score','Airport Connectivity','Port Efficiency','Road Quality','Electricity Reliability','Energy Cost','Construction Index','Urban Connectivity']},
                {dim:'Sustainability (17%)',        key:'sustain', indicators:['EPI Score','Renewable Share','Carbon Price','Climate Resilience','Net Zero Target','ESG Policy','Green Finance','Biodiversity Index']},
              ].map(section => (
                <div key={section.dim}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-sm text-[#0A2540]">{section.dim}</div>
                    <div className="text-xl font-black text-blue-600">{(selected as any)[section.key]}</div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full rounded-full bg-blue-500 transition-all"
                      style={{width:`${(selected as any)[section.key]}%`}}/>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {section.indicators.map((ind, i) => {
                      const baseScore = (selected as any)[section.key];
                      const variance  = (i % 3 === 0 ? 8 : i % 3 === 1 ? -5 : 3);
                      const score     = Math.max(5, Math.min(99, baseScore + variance - (i * 2)));
                      return (
                        <div key={ind} className="flex items-center justify-between bg-slate-50 rounded-lg px-2.5 py-1.5">
                          <span className="text-xs text-slate-500 truncate">{ind}</span>
                          <span className="text-xs font-bold text-slate-700 ml-2 flex-shrink-0">{score}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Economic snapshot */}
              <div className="border-t border-slate-100 pt-4">
                <div className="font-bold text-sm text-[#0A2540] mb-3">Economic Snapshot</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {l:'Population',  v:`${selected.pop_m}M`},
                    {l:'GDP',         v:`$${selected.gdp_b >= 1000 ? (selected.gdp_b/1000).toFixed(1)+'T' : selected.gdp_b+'B'}`},
                    {l:'FDI Inflows', v:`$${selected.fdi_b}B`},
                    {l:'Internet',    v:`${selected.internet_pct}%`},
                    {l:'Income Group',v:selected.income},
                    {l:'GFR Rank',    v:`#${selected.rank}`},
                  ].map(s=>(
                    <div key={s.l} className="bg-slate-50 rounded-lg p-2.5 text-center">
                      <div className="text-xs text-slate-400">{s.l}</div>
                      <div className="font-bold text-sm text-[#0A2540]">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>setShowDetail(false)}
                  className="flex-1 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl">Close</button>
                <button className="flex-1 bg-[#0A2540] text-white font-black py-2.5 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                  Full GFR Report — 10 FIC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
