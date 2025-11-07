import Script from "next/script";

interface AnalyticsProps {
  gaId?: string;
  gtmId?: string;
}

export function Analytics({ gaId, gtmId }: AnalyticsProps) {
  const GA_ID = gaId || process.env.NEXT_PUBLIC_GA_ID;
  const GTM_ID = gtmId || process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* Google Analytics */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                  send_page_view: true,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });
              `,
            }}
          />
        </>
      )}

      {/* Google Tag Manager */}
      {GTM_ID && (
        <>
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* Événements personnalisés pour l'analytics */}
      <Script
        id="custom-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Fonction pour tracker les recherches de prénoms
            window.trackSearch = function(prenom) {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'search', {
                  search_term: prenom,
                  event_category: 'prenom_search',
                  event_label: prenom
                });
              }
            };

            // Fonction pour tracker les clics sur les graphiques
            window.trackChartClick = function(prenom, mention) {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                  event_category: 'chart_interaction',
                  event_label: prenom,
                  custom_parameter: mention
                });
              }
            };

            // Fonction pour tracker les changements de mention
            window.trackMentionChange = function(mention) {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'mention_change', {
                  event_category: 'filter_usage',
                  event_label: mention
                });
              }
            };

            // Tracker le temps passé sur la page
            window.addEventListener('beforeunload', function() {
              if (typeof gtag !== 'undefined') {
                const timeSpent = Math.round((Date.now() - performance.timing.navigationStart) / 1000);
                gtag('event', 'time_on_site', {
                  event_category: 'engagement',
                  event_label: 'seconds',
                  value: timeSpent
                });
              }
            });
          `,
        }}
      />
    </>
  );
}

// Hook pour faciliter l'utilisation des événements
export const useAnalytics = () => {
  const trackSearch = (prenom: string) => {
    if (typeof window !== "undefined" && window.trackSearch) {
      window.trackSearch(prenom);
    }
  };

  const trackChartClick = (prenom: string, mention: string) => {
    if (typeof window !== "undefined" && window.trackChartClick) {
      window.trackChartClick(prenom, mention);
    }
  };

  const trackMentionChange = (mention: string) => {
    if (typeof window !== "undefined" && window.trackMentionChange) {
      window.trackMentionChange(mention);
    }
  };

  return {
    trackSearch,
    trackChartClick,
    trackMentionChange,
  };
};

declare global {
  interface Window {
    trackSearch: (prenom: string) => void;
    trackChartClick: (prenom: string, mention: string) => void;
    trackMentionChange: (mention: string) => void;
    gtag: (...args: unknown[]) => void;
  }
}
