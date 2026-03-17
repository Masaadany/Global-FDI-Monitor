/**
 * JSON-LD Structured Data for GFM pages
 * Improves search engine understanding of the platform.
 */

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Global FDI Monitor",
    "alternateName": "GFM",
    "url": "https://fdimonitor.org",
    "logo": "https://fdimonitor.org/favicon.svg",
    "description": "World's first fully integrated FDI intelligence platform. 215 economies, real-time signals, GFR rankings.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@fdimonitor.org",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://twitter.com/fdimonitor",
      "https://linkedin.com/company/fdimonitor"
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}/>;
}

export function SoftwareAppJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Global FDI Monitor",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://fdimonitor.org",
    "description": "FDI intelligence platform — live signals, GFR rankings, AI reports across 215 economies",
    "offers": {
      "@type": "Offer",
      "price": "899",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "RecurringCharges",
        "billingDuration": "P1M"
      }
    },
    "featureList": [
      "Real-time FDI signals",
      "GFR Rankings 215 economies",
      "AI-powered custom reports",
      "Mission planning",
      "FDI forecasts 2025-2030",
      "Investment pipeline management"
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}/>;
}

export function FAQJsonLd({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}/>;
}
