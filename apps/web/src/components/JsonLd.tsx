export default function JsonLd({ type = 'Organization' }: { type?: string }) {
  const BASE = 'https://fdimonitor.org';

  const schemas: Record<string, object> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'FDI Monitor',
      alternateName: 'Global FDI Monitor',
      url: BASE,
      logo: `${BASE}/logo.svg`,
      description: 'Global FDI intelligence platform: 215 economies, real-time signals, GFR assessments, AI reports.',
      foundingDate: '2018',
      address: { '@type':'PostalAddress', addressLocality:'Dubai', addressCountry:'AE', addressRegion:'DIFC' },
      contactPoint: { '@type':'ContactPoint', email:'info@fdimonitor.org', contactType:'customer support' },
      sameAs: ['https://twitter.com/fdimonitor','https://linkedin.com/company/fdi-monitor'],
    },
    WebSite: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'FDI Monitor',
      url: BASE,
      description: 'From data to investment decisions. Global FDI intelligence for investment professionals.',
      potentialAction: { '@type':'SearchAction', target:`${BASE}/signals?q={search_term_string}`, 'query-input':'required name=search_term_string' },
    },
    SoftwareApplication: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'FDI Monitor',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: BASE,
      offers: {
        '@type': 'Offer',
        price: '799',
        priceCurrency: 'USD',
        priceSpecification: { '@type':'UnitPriceSpecification', price:799, priceCurrency:'USD', unitText:'MONTH' },
      },
      featureList: ['Real-time FDI signals','GFR assessments for 215 economies','AI-generated intelligence reports','Foresight & scenario planning to 2050','Investment mission planning'],
    },
  };

  const schema = schemas[type] || schemas.Organization;

  return (  // structured data — no visible aria needed
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
