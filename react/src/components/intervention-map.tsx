import { Clock, MapPin } from "lucide-react";

type InterventionMapRegionProps = Readonly<{
  mapLabel: string;
  mapLat: number;
  mapLng: number;
  mapZoom: number;
  regionTitle: string;
  regionSubtitle: string;
  regionParagraphs: string[];
  headerDescription: string;
  /** Pill above the section title (default: « Zones d'intervention ») */
  sectionBadge?: string;
}>;

function GoogleMap({
  mapLat,
  mapLng,
  mapZoom,
  mapLabel,
}: Readonly<{
  mapLat: number;
  mapLng: number;
  mapZoom: number;
  mapLabel: string;
}>) {
  // Google Maps embed URL without API key requirement
  const mapUrl = `https://www.google.com/maps?q=${mapLat},${mapLng}&hl=fr&z=${mapZoom}&output=embed`;

  return (
    <div className="relative flex h-full overflow-hidden rounded-3xl border border-[#1C2E42]/10 bg-white shadow-[0_20px_60px_rgba(28,46,66,0.14)]">
      <iframe
        key={`${mapLat}-${mapLng}-${mapZoom}`}
        title="Carte des zones d'intervention"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#1C2E42]/70">
            <Clock size={16} />
            <span>Intervention sous 24h</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#CC922F]">
            <MapPin size={16} />
            <span>{mapLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InterventionMapRegion({
  mapLabel,
  mapLat,
  mapLng,
  mapZoom,
  regionTitle,
  regionSubtitle,
  regionParagraphs,
  headerDescription,
  sectionBadge = "Zones d'intervention",
}: InterventionMapRegionProps) {
  return (
    <section
      id="zones"
      className="relative overflow-hidden bg-gradient py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Decorative background elements */}
      <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 rounded-full" />
      <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 rounded-full" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#CC922F]/30 bg-[#CC922F]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#CC922F]">
            <MapPin size={14} />
            {sectionBadge}
          </div>
          <h2 className="mb-4 text-4xl font-bold text-[#1C2E42] md:text-5xl">
            Nous intervenons dans votre secteur
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#1C2E42]/70">{headerDescription}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Map Container */}
          <div className="relative order-2 h-full lg:order-1">
            <GoogleMap mapLat={mapLat} mapLng={mapLng} mapZoom={mapZoom} mapLabel={mapLabel} />
          </div>

          {/* Region Definition */}
          <div className="order-1 space-y-6 lg:order-2 lg:flex lg:h-full lg:flex-col">
            <div className="flex flex-1 flex-col rounded-3xl border border-[#1C2E42]/10 bg-white/80 p-8 shadow-[0_10px_40px_rgba(28,46,66,0.10)] backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#CC922F] to-[#1C2E42]">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1C2E42]">{regionTitle}</h3>
                  <p className="text-sm text-[#1C2E42]/70">{regionSubtitle}</p>
                </div>
              </div>

              <div className="space-y-4 text-[#1C2E42]/70 leading-relaxed">
                {regionParagraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export function InterventionMapIleDeFrance() {
  return (
    <InterventionMapRegion
      mapLabel="Île-de-France"
      mapLat={48.8566}
      mapLng={2.3522}
      mapZoom={7}
      regionTitle="Île-de-France"
      regionSubtitle="Déménagement local & régional"
      headerDescription="Guivarche Déménagement intervient en Île-de-France pour des déménagements organisés, soignés et parfaitement cadrés."
      regionParagraphs={[
        "L’Île-de-France regroupe des zones très diversifiées, entre Paris, les départements limitrophes et les communes de la grande couronne.",
        "Nous adaptons le matériel, la logistique et les protections pour gérer les accès, les étages et les contraintes de stationnement.",
        "Avec Guivarche Déménagement, vous obtenez un service transparent, ponctuel et orienté qualité, du devis à l’intervention.",
      ]}
    />
  );
}

/** Carte & textes ciblés Paris (75) — landing Ads / SEO local */
export function InterventionMapParis75() {
  return (
    <InterventionMapRegion
      sectionBadge="Paris 75"
      mapLabel="Paris 75"
      mapLat={48.8566}
      mapLng={2.3522}
      mapZoom={11}
      regionTitle="Paris 75"
      regionSubtitle="Déménagement dans la capitale"
      headerDescription="Guivarche Déménagement intervient à Paris (75) pour des déménagements organisés, soignés et parfaitement cadrés."
      regionParagraphs={[
        "Paris offre des configurations variées : immeubles haussmanniens, cours, accès étroits et contraintes de stationnement — nous les anticipons.",
        "Nous adaptons le matériel, la logistique et les protections pour gérer les accès, les étages et les livraisons en centre-ville.",
        "Avec Guivarche Déménagement, vous obtenez un service transparent, ponctuel et orienté qualité, du devis à l’intervention.",
      ]}
    />
  );
}

/** Carte & textes Versailles 92 — landing Ads (libellé demandé) */
export function InterventionMapVersailles92() {
  return (
    <InterventionMapRegion
      sectionBadge="Versailles 92"
      mapLabel="Versailles 92"
      mapLat={48.8049}
      mapLng={2.1204}
      mapZoom={12}
      regionTitle="Versailles 92"
      regionSubtitle="Déménagement local"
      headerDescription="Guivarche Déménagement intervient à Versailles (92) pour des déménagements organisés, soignés et parfaitement cadrés."
      regionParagraphs={[
        "Versailles et son environnement demandent une bonne lecture des accès, des volumes et du stationnement — nous les anticipons.",
        "Nous adaptons le matériel, la logistique et les protections pour les livraisons en quartiers résidentiels comme en zones plus denses.",
        "Avec Guivarche Déménagement, vous obtenez un service transparent, ponctuel et orienté qualité, du devis à l’intervention.",
      ]}
    />
  );
}

export function InterventionMapNational() {
  return (
    <InterventionMapRegion
      mapLabel="France"
      mapLat={46.2321}
      mapLng={2.2096}
      mapZoom={4
      }
      regionTitle="France"
      regionSubtitle="Déménagement national"
      headerDescription="Pour les longues distances, Guivarche Déménagement structure chaque étape afin de sécuriser vos biens et votre planning."
      regionParagraphs={[
        "Un déménagement national demande une planification précise : protection, transport, timing et coordination.",
        "Nous préparons l’intervention avec des étapes claires et un contrôle continu pour éviter toute improvisation.",
        "Que vous déménagiez vers le Nord, le Sud, l’Est ou l’Ouest, nous ajustons les options selon votre accès et vos contraintes.",
      ]}
    />
  );
}

export function InterventionMapInternational() {
  return (
    <InterventionMapRegion
      mapLabel="Europe & monde"
      mapLat={53.0000}
      mapLng={9.0000}
      mapZoom={1}
      regionTitle="Europe & monde"
      regionSubtitle="Déménagement international"
      headerDescription="Guivarche Déménagement vous accompagne à l’international : organisation, protections et coordination des étapes."
      regionParagraphs={[
        "À l’international, tout se joue sur l’anticipation : inventaire, protections et coordination transport.",
        "Nous vous guidons pour préparer les informations utiles et structurer le déroulé, étape par étape.",
        "Objectif : un déménagement international cadré, avec une exécution fiable et une communication claire.",
      ]}
    />
  );
}

