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
  /** Main H2 above the map (default: « Nous intervenons dans votre secteur ») */
  sectionTitle?: string;
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
  sectionTitle = "Nous intervenons dans votre secteur",
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
            {sectionTitle}
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
      sectionBadge="Paris"
      sectionTitle="Nous intervenons dans tout Paris et ses arrondissements"
      mapLabel="Paris"
      mapLat={48.8566}
      mapLng={2.3522}
      mapZoom={11}
      regionTitle="Paris"
      regionSubtitle="Tous les arrondissements"
      headerDescription="Guivarche Déménagement organise votre déménagement à Paris : trajet maîtrisé, équipes expérimentées et intervention dans tous les arrondissements de la capitale."
      regionParagraphs={[
        "Paris offre des configurations variées : immeubles haussmanniens, cours intérieures, rues étroites, accès sans ascenseur et contraintes de stationnement — nous les anticipons pour chaque arrondissement.",
        "Du 1er au 20e arrondissement, nous adaptons le matériel, la logistique et les protections pour gérer les accès, les étages et les livraisons en centre-ville.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Versailles (78) — page locale Paris → Versailles */
export function InterventionMapVersaille() {
  return (
    <InterventionMapRegion
      sectionBadge="Paris → Versailles (78)"
      mapLabel="Versailles"
      mapLat={48.8014}
      mapLng={2.1301}
      mapZoom={13}
      regionTitle="Versailles"
      regionSubtitle="Déménagement Paris Versailles"
      headerDescription="Guivarche Déménagement organise votre déménagement entre Paris et Versailles : trajet maîtrisé, équipes expérimentées et intervention dans tous les quartiers de la ville."
      regionParagraphs={[
        "Versailles présente des configurations variées : centre historique, quartiers résidentiels comme Notre-Dame, Saint-Louis, Montreuil, Clagny-Glatigny ou Porchefontaine, avec des accès parfois étroits et un stationnement limité — nous les anticipons.",
        "Depuis Paris, nous gérons le chargement, le transport sur environ 20 km et la livraison à Versailles en adaptant le matériel, la logistique et les protections à votre logement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Seine-Saint-Denis (93) — page SEO locale */
export function InterventionMapSeineSaintDenis93() {
  return (
    <InterventionMapRegion
      sectionBadge="Seine-Saint-Denis (93)"
      sectionTitle="Nous intervenons dans tout le Seine-Saint-Denis et ses communes"
      mapLabel="Seine-Saint-Denis (93)"
      mapLat={48.9362}
      mapLng={2.3574}
      mapZoom={12}
      regionTitle="Seine-Saint-Denis (93)"
      regionSubtitle="Toutes les communes du département"
      headerDescription="Guivarche Déménagement organise votre déménagement en Seine-Saint-Denis : trajet maîtrisé, équipes expérimentées et intervention dans l'ensemble des communes du département."
      regionParagraphs={[
        "La Seine-Saint-Denis présente des configurations urbaines exigeantes : densité élevée, immeubles collectifs, accès restreints et trafic intense — nous les anticipons pour chaque commune.",
        "De Saint-Denis à Montreuil, Aubervilliers, Bobigny ou Noisy-le-Grand, nous adaptons le matériel, la logistique et les protections selon les contraintes d'accès et de stationnement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Seine-et-Marne (77) — page SEO locale */
export function InterventionMapSeineEtMarne77() {
  return (
    <InterventionMapRegion
      sectionBadge="Seine-et-Marne (77)"
      sectionTitle="Nous intervenons dans toute la Seine-et-Marne et ses communes"
      mapLabel="Seine-et-Marne (77)"
      mapLat={48.5393}
      mapLng={2.6599}
      mapZoom={10}
      regionTitle="Seine-et-Marne (77)"
      regionSubtitle="Toutes les communes du département"
      headerDescription="Guivarche intervient dans l'ensemble des communes de Seine-et-Marne pour assurer des déménagements rapides, sécurisés et parfaitement organisés."
      regionParagraphs={[
        "La Seine-et-Marne, plus grand département d'Île-de-France, présente des contraintes variées : longues distances, routes départementales étroites, communes rurales et zones forestières enclavées — nous les anticipons pour chaque chantier.",
        "De Melun à Meaux, Chelles, Torcy ou Lagny-sur-Marne, nous adaptons le matériel, la logistique et les protections selon les contraintes d'accès et de stationnement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Essonne (91) — page SEO locale */
export function InterventionMapEssonne91() {
  return (
    <InterventionMapRegion
      sectionBadge="Essonne (91)"
      sectionTitle="Nous intervenons dans toute l'Essonne et ses communes"
      mapLabel="Essonne (91)"
      mapLat={48.6333}
      mapLng={2.45}
      mapZoom={11}
      regionTitle="Essonne (91)"
      regionSubtitle="Toutes les communes du département"
      headerDescription="Confiez votre déménagement en Essonne à Guivarche : accompagnement personnalisé, équipes professionnelles et couverture complète de l'ensemble des communes du département pour un déménagement sans stress."
      regionParagraphs={[
        "L'Essonne présente des configurations variées : vastes zones pavillonnaires, grands ensembles en banlieue sud, secteurs ruraux et zones d'activités périurbaines — nous les anticipons pour chaque commune.",
        "De Massy à Palaiseau, Évry-Courcouronnes, Orsay ou Longjumeau, nous adaptons le matériel, la logistique et les protections selon les contraintes d'accès et de stationnement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Yvelines (78) — page SEO locale */
export function InterventionMapYvelines78() {
  return (
    <InterventionMapRegion
      sectionBadge="Yvelines (78)"
      sectionTitle="Nous intervenons dans tout le département des Yvelines et ses communes"
      mapLabel="Yvelines (78)"
      mapLat={48.8014}
      mapLng={2.1301}
      mapZoom={11}
      regionTitle="Yvelines (78)"
      regionSubtitle="Toutes les communes du département"
      headerDescription="Guivarche Déménagement organise votre déménagement dans les Yvelines : trajet maîtrisé, équipes expérimentées et intervention dans l'ensemble des communes du département."
      regionParagraphs={[
        "Les Yvelines présentent des configurations variées : centres-villes historiques, quartiers résidentiels, zones pavillonnaires et accès parfois complexes — nous les anticipons pour chaque commune.",
        "De Versailles à Saint-Germain-en-Laye, Sartrouville, Poissy ou Rambouillet, nous adaptons le matériel, la logistique et les protections selon les contraintes d'accès et de stationnement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Val-d'Oise (95) — page SEO locale */
export function InterventionMapValDoise95() {
  return (
    <InterventionMapRegion
      sectionBadge="Val-d'Oise (95)"
      sectionTitle="Nous intervenons dans tout le Val-d'Oise et ses communes"
      mapLabel="Val-d'Oise (95)"
      mapLat={49.0506}
      mapLng={2.1003}
      mapZoom={11}
      regionTitle="Val-d'Oise (95)"
      regionSubtitle="Toutes les communes du département"
      headerDescription="Guivarche Déménagement organise votre déménagement dans le Val-d'Oise : trajet maîtrisé, équipes expérimentées et intervention dans l'ensemble des communes du département."
      regionParagraphs={[
        "Le Val-d'Oise présente des configurations variées : zones urbaines denses, quartiers résidentiels en plein essor, secteurs ruraux plus isolés et accès parfois complexes — nous les anticipons pour chaque commune.",
        "De Cergy à Argenteuil, Pontoise, Sarcelles ou Enghien-les-Bains, nous adaptons le matériel, la logistique et les protections selon les contraintes d'accès et de stationnement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Val-de-Marne (94) — page SEO locale */
export function InterventionMapValDeMarne94() {
  return (
    <InterventionMapRegion
      sectionBadge="Val-de-Marne (94)"
      sectionTitle="Nous intervenons dans tout le Val-de-Marne et ses communes"
      mapLabel="Val-de-Marne (94)"
      mapLat={48.7904}
      mapLng={2.4556}
      mapZoom={12}
      regionTitle="Val-de-Marne (94)"
      regionSubtitle="Toutes les communes du département"
      headerDescription="Guivarche Déménagement organise votre déménagement dans le Val-de-Marne : trajet maîtrisé, équipes expérimentées et intervention dans l'ensemble des communes du département."
      regionParagraphs={[
        "Le Val-de-Marne présente des configurations variées : zones urbaines denses, quartiers résidentiels, immeubles anciens et accès parfois complexes — nous les anticipons pour chaque commune.",
        "De Créteil à Vitry-sur-Seine, Champigny-sur-Marne, Vincennes ou Maisons-Alfort, nous adaptons le matériel, la logistique et les protections selon les contraintes d'accès et de stationnement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Hauts-de-Seine (92) — page SEO locale */
export function InterventionMapHautsDeSeine92() {
  return (
    <InterventionMapRegion
      sectionBadge="Hauts-de-Seine (92)"
      sectionTitle="Nous intervenons dans tout le Hauts-de-Seine et ses communes"
      mapLabel="Hauts-de-Seine (92)"
      mapLat={48.8924}
      mapLng={2.2069}
      mapZoom={12}
      regionTitle="Hauts-de-Seine (92)"
      regionSubtitle="Toutes les communes du département"
      headerDescription="Guivarche Déménagement organise votre déménagement dans les Hauts-de-Seine : trajet maîtrisé, équipes expérimentées et intervention dans l'ensemble des communes du département."
      regionParagraphs={[
        "Les Hauts-de-Seine présentent des configurations variées : zones urbaines denses, résidences sécurisées, quartiers résidentiels et accès parfois complexes — nous les anticipons pour chaque commune.",
        "De Boulogne-Billancourt à Nanterre, Courbevoie, Neuilly-sur-Seine ou Rueil-Malmaison, nous adaptons le matériel, la logistique et les protections selon les contraintes d'accès et de stationnement.",
        "Avec Guivarche Déménagement, vous bénéficiez d'un interlocuteur unique, d'une organisation maîtrisée du début à la fin et d'un service transparent, ponctuel et orienté qualité.",
      ]}
    />
  );
}

/** Carte & textes Hauts-de-Seine (92) — landing Ads */
export function InterventionMapVersailles92() {
  return (
    <InterventionMapRegion
      sectionBadge="Hauts-de-Seine (92)"
      mapLabel="Hauts-de-Seine (92)"
      // Point central approximatif du département (Nanterre)
      mapLat={48.8924}
      mapLng={2.2069}
      mapZoom={12}
      regionTitle="Hauts-de-Seine (92)"
      regionSubtitle="Déménagement local"
      headerDescription="Guivarche Déménagement intervient dans les Hauts-de-Seine (92) pour des déménagements organisés, soignés et parfaitement cadrés."
      regionParagraphs={[
        "Les Hauts-de-Seine présentent des configurations variées : centres-villes denses, quartiers résidentiels, accès étroits et contraintes de stationnement — nous les anticipons.",
        "Nous adaptons le matériel, la logistique et les protections pour des interventions en immeuble comme en maison, partout dans le 92.",
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

