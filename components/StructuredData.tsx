import Script from "next/script";

interface StructuredDataProps {
  data?: {
    totalNames?: number;
    year?: string;
  };
}

export function StructuredData({ data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://mentionbrevet.com/#website",
        url: "https://mentionbrevet.com/",
        name: "MentionBrevet.com",
        description:
          "Statistiques officielles du brevet des collèges 2025 par prénom",
        publisher: {
          "@id": "https://mentionbrevet.com/#organization",
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://mentionbrevet.com/?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: "fr-FR",
      },
      {
        "@type": "Organization",
        "@id": "https://mentionbrevet.com/#organization",
        name: "MentionBrevet.com",
        url: "https://mentionbrevet.com/",
        description:
          "Plateforme d'analyse des statistiques du brevet des collèges par prénom",
        foundingDate: "2025",
        areaServed: "France",
        serviceType: "Analyse statistique éducative",
      },
      {
        "@type": "Dataset",
        "@id": "https://mentionbrevet.com/#dataset",
        name: "Statistiques du Brevet des Collèges 2025 par Prénom",
        description:
          "Dataset complet des résultats du brevet des collèges 2025 analysés par prénom avec les taux de mentions",
        keywords: [
          "brevet",
          "mentions",
          "prénoms",
          "éducation",
          "statistiques",
        ],
        creator: {
          "@id": "https://mentionbrevet.com/#organization",
        },
        datePublished: "2025",
        license: "https://www.etalab.gouv.fr/licence-ouverte-open-licence",
        spatialCoverage: "France",
        temporalCoverage: "2025",
        ...(data?.totalNames && {
          distribution: {
            "@type": "DataDownload",
            contentSize: `${data.totalNames} prénoms analysés`,
            encodingFormat: "application/json",
          },
        }),
      },
      {
        "@type": "WebApplication",
        "@id": "https://mentionbrevet.com/#webapp",
        name: "Analyseur de Mentions du Brevet",
        description:
          "Application web interactive pour explorer les statistiques du brevet des collèges par prénom",
        url: "https://mentionbrevet.com/",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        permissions: "no special permissions required",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
        featureList: [
          "Recherche par prénom",
          "Visualisation graphique interactive",
          "Analyse comparative des mentions",
          "Suggestions de prénoms similaires",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://mentionbrevet.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Qu'est-ce que MentionBrevet.com ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "MentionBrevet.com est une plateforme qui analyse les statistiques officielles du brevet des collèges 2025 par prénom, permettant de visualiser les corrélations entre prénoms et taux de mentions.",
            },
          },
          {
            "@type": "Question",
            name: "D'où viennent les données ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Les données proviennent des résultats officiels du brevet des collèges 2025, analysées pour plus de 26 000 prénoms avec un minimum de 200 candidats par prénom.",
            },
          },
          {
            "@type": "Question",
            name: "Comment utiliser l'outil de recherche ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Tapez un prénom dans la barre de recherche pour voir ses statistiques détaillées : nombre de candidats, taux de mentions (TB, B, AB, SM) et prénoms similaires.",
            },
          },
        ],
      },
    ],
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
