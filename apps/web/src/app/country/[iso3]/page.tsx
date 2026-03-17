import CountryProfileClient from './client';
export function generateStaticParams() {
  return ['ARE','SAU','IND','SGP','VNM','IDN','DEU','EGY','NGA','CHN',
          'GBR','USA','FRA','JPN','KOR','TUR','BRA','ZAF','MAR','KEN',
          'QAT','KWT','OMN','BHR','ISR','HKG','TWN','NOR','DNK','SWE'].map(iso3=>({iso3}));
}
export default function CountryProfilePage({ params }: { params: { iso3: string } }) {
  return <CountryProfileClient iso3={params.iso3}/>;
}
