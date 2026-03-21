import React from 'react';

const CODE_MAP: Record<string,string> = {
  'Singapore':'SG','Malaysia':'MY','Thailand':'TH','Vietnam':'VN','UAE':'AE','Saudi Arabia':'SA',
  'India':'IN','Indonesia':'ID','South Korea':'KR','Japan':'JP','United Kingdom':'GB','Germany':'DE',
  'United States':'US','Brazil':'BR','Morocco':'MA','Denmark':'DK','Switzerland':'CH','Netherlands':'NL',
  'Canada':'CA','New Zealand':'NZ','Australia':'AU','France':'FR','China':'CN','SGP':'SG','MYS':'MY',
  'THA':'TH','VNM':'VN','ARE':'AE','SAU':'SA','IND':'IN','IDN':'ID','KOR':'KR','JPN':'JP',
  'GBR':'GB','DEU':'DE','USA':'US','BRA':'BR','MAR':'MA','DNK':'DK','CHE':'CH','NLD':'NL',
  'CAN':'CA','NZL':'NZ','AUS':'AU','FRA':'FR','CHN':'CN','MEX':'MX','TUR':'TR','EGY':'EG','NGA':'NG',
  'Mexico':'MX','Turkey':'TR','Egypt':'EG','Nigeria':'NG','Sweden':'SE','SWE':'SE',
};

export default function Flag({ country, size = 'md' }: { country: string; size?: 'sm'|'md'|'lg'|'xl' }) {
  const code = CODE_MAP[country] || country;
  const dims = { sm:{w:18,h:13}, md:{w:24,h:17}, lg:{w:32,h:22}, xl:{w:44,h:30} };
  const {w,h} = dims[size];
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/country-flag-icons@1.5.0/3x2/${code.toUpperCase()}.svg`}
      alt={country}
      width={w} height={h}
      style={{ borderRadius:3, objectFit:'cover', display:'inline-block', flexShrink:0, boxShadow:'0 1px 3px rgba(0,0,0,0.12)' }}
      onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }}
    />
  );
}
