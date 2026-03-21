import CountryClient from './CountryClient';

export default function CountryPage({ params }: { params: { id: string } }) {
  return <CountryClient id={params.id} />;
}

export function generateStaticParams() {
  return ['SGP','MYS','THA','VNM','ARE','SAU','IND','IDN','BRA','MAR','DNK','CHE','NLD','KOR','NZL','GBR','DEU','USA','JPN','CAN','AUS','FRA','CHN'].map(id=>({id}));
}
