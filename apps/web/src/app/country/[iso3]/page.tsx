// lucide-react icons used in CountryClient.tsx
import CountryClient from './CountryClient';

export function generateStaticParams() {
  return ['ARE','SAU','SGP','IND','DEU','USA','GBR','FRA','JPN','CHN','BRA','AUS',
          'ZAF','EGY','NGA','VNM','KOR','CAN','NLD','POL','QAT','KWT','BHR','OMN',
          'JOR','KEN','MAR','TZA','ETH','GHA','CIV'].map(iso3=>({iso3}));
}

export default function CountryPage({ params }: { params: { iso3: string } }) {
  return <CountryClient iso3={params.iso3.toUpperCase()} />;
}
