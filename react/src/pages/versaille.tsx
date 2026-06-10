import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpFromLine,
  Building2,
  Check,
  CheckCircle2,
  CuboidIcon as Cube,
  MapPin,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import {
  gradientCtaActionsClass,
  gradientCtaOutlineClass,
  gradientCtaPrimaryClass,
} from "../components/gradientCtaStyles";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { DestinationFaqSection } from "../components/destination/DestinationFaqSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

const VERSAILLE_PRICING_ROWS = [
  { type: "Studio", volume: "10 – 15 m³", budget: "450 € – 850 €" },
  { type: "T2", volume: "18 – 22 m³", budget: "700 € – 1 200 €" },
  { type: "T3", volume: "25 – 30 m³", budget: "900 € – 1 600 €" },
  { type: "T4 et +", volume: "35 m³ et +", budget: "1 400 € – 2 400 €" },
] as const;

const VERSAILLE_PRICING_FACTORS = [
  {
    icon: Building2,
    label: "Étage & accès",
    value: "Sans ascenseur",
    desc: "Étages, cour intérieure et portage influencent le temps de manutention.",
  },
  {
    icon: ArrowUpFromLine,
    label: "Monte-meuble",
    value: "Si nécessaire",
    desc: "Option selon hauteur, accès et volume à monter ou descendre.",
  },
  {
    icon: MapPin,
    label: "Distance",
    value: "Paris → Versailles",
    desc: "Trajet d'environ 20 km : frais kilométriques modérés sur ce corridor.",
  },
  {
    icon: Cube,
    label: "Volume",
    value: "Au m³",
    desc: "Le nombre de m³ à déménager reste le principal levier du devis.",
  },
] as const;

const VERSAILLE_PRESTATIONS_INCLUDED = [
  "Chargement, transport et mise en place du mobilier",
  "Protection du mobilier sous couvertures",
  "Protection de la literie sous housses",
  "Protection de la HI-FI et de l'électronique",
  "Emballage des vêtements sur cintres en penderie",
  "Transport des vêtements sur cintres (penderie)",
  "Débranchement et branchement de l'électroménager",
  "Emballage professionnel et protection des éléments fragiles",
  "Démontage et remontage des meubles",
  "Monte-meuble pour accès difficiles ou étages sans ascenseur",
  "Pack cartons, bulle et adhésif (expédié sous 48 h)",
  "Stockage temporaire entre Paris et Versailles",
  "Assurance tous risques (option sur devis)",
  "Prix flexible (ajustable sur 5 jours)",
  "Démarches d'autorisation de stationnement à Paris (sous conditions)",
] as const;

/** Placeholder villes — liens à brancher quand les pages satellites seront créées. */
const VERSAILLE_OTHER_CITIES = [
  "Marseille",
  "Bordeaux",
  "Strasbourg",
  "Toulouse",
  "Lille",
  "Rennes",
  "Grenoble",
  "Rouen",
  "Nancy",
  "Montpellier",
  "Lyon",
  "Dijon",
  "Le Havre",
  "Caen",
  "Metz",
  "Orléans",
  "Brest",
  "Reims",
  "Angers",
  "Tours",
  "Clermont-Ferrand",
  "Amiens",
  "Limoges",
  "Perpignan",
  "Besançon",
] as const;

const VERSAILLE_DESTINATION_FAQ = [
  {
    question:
      "Combien coûte un déménagement entre Paris et Versailles, et quels facteurs influencent le prix final d'un studio, d'un appartement ou d'une maison ?",
    answer:
      "Pour un déménagement Paris → Versailles, comptez en moyenne entre 450 € et 2 400 € selon le volume (studio à maison), la formule choisie (Éco, Standard ou Luxe) et les contraintes d'accès. Le trajet étant court (environ 20 km), les frais kilométriques restent modérés : le prix dépend surtout du m³ à transporter et du temps de manutention. Guivarche établit un devis ferme et gratuit sous 24 h, sans frais cachés.",
  },
  {
    question:
      "Combien de temps dure réellement le trajet Paris–Versailles en camion de déménagement, selon l'arrondissement de départ, l'heure de la journée et le quartier d'arrivée ?",
    answer:
      "Le trajet entre Paris et Versailles dure en général 30 à 50 minutes en camion, selon l'arrondissement de départ, l'heure de la journée et le quartier d'arrivée (centre historique, Porchefontaine, Montreuil, etc.). Nous planifions le créneau de chargement à Paris en tenant compte des restrictions de circulation et du stationnement pour respecter votre planning.",
  },
  {
    question:
      "Avez-vous un dépôt de stockage ou une solution de garde-meubles à Versailles pour entreposer mes biens entre deux dates de déménagement ?",
    answer:
      "Oui, Guivarche propose des solutions de garde-meubles et de stockage temporaire pour vos biens entre Paris et Versailles : box sécurisés, accès sur rendez-vous et durée flexible (quelques jours à plusieurs mois). Idéal si vos dates de sortie et d'entrée ne coïncident pas, ou si vous souhaitez déstocker progressivement dans votre nouveau logement.",
  },
  {
    question:
      "Quels quartiers de Versailles et quelles communes voisines desservez-vous pour un déménagement depuis Paris ou depuis un autre point d'Île-de-France ?",
    answer:
      "Nous intervenons dans tous les quartiers de Versailles : centre-ville et Château, Notre-Dame, Saint-Louis, Montreuil, Porchefontaine, Chantiers, Clagny, Satory, ainsi que les communes limitrophes (Viroflay, Le Chesnay-Rocquencourt, Saint-Cyr-l'École, Buc, Guyancourt). Que vous partiez de Paris intra-muros ou d'une autre ville d'Île-de-France, nos équipes connaissent les accès et contraintes locales.",
  },
  {
    question:
      "Comment se passe concrètement le stationnement du camion et l'autorisation de chargement à Paris le jour du déménagement vers Versailles ?",
    answer:
      "À Paris, nous anticipons le stationnement du camion avant le jour J : repérage des accès, demande d'autorisation de stationnement si nécessaire, et choix du créneau le plus favorable (tôt le matin ou en semaine). Nos déménageurs gèrent le portage depuis l'immeuble jusqu'au camion, y compris en cas d'accès étroit, de cour intérieure ou d'absence d'ascenseur.",
  },
  {
    question:
      "Est-il possible de réaliser un déménagement complet de Paris à Versailles en une seule journée, y compris pour un appartement familial ou une maison ?",
    answer:
      "Oui, dans la majorité des cas un déménagement Paris → Versailles se réalise en une journée : chargement le matin à Paris, trajet court, puis livraison et installation à Versailles l'après-midi. Pour les volumes importants (maison 50 m³ et plus) ou les accès complexes, nous pouvons prévoir deux équipes ou étaler sur deux jours — tout est précisé dans votre devis.",
  },
  {
    question:
      "Quelle formule de déménagement — Économique, Standard ou Luxe — est la plus adaptée pour un trajet local Paris → Versailles selon mon budget et mon niveau de service ?",
    answer:
      "Pour un trajet local comme Paris–Versailles, la formule Standard convient à la plupart des ménages : emballage des objets fragiles, démontage-remontage des meubles et transport sécurisé. La formule Économique est adaptée si vous préparez vos cartons vous-même. La formule Luxe inclut l'emballage intégral et une prise en charge clé en main — idéale si vous manquez de temps ou déménagez avec des objets de valeur.",
  },
] as const;

export default function Versaille() {
  usePageMeta(PAGE_META.versaille);

  const navigate = useNavigate();

  const primaryCta = () => navigate("/tunnel/mes-coordonnees");

  const renderCtaBand = (
    title: string,
    subtitle: string,
  ) => (
    <section className="w-full bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]">
            {title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
            {subtitle}
          </p>
          <div className={gradientCtaActionsClass}>
            <button type="button" onClick={primaryCta} className={gradientCtaPrimaryClass}>
              Demander un devis gratuit
            </button>
            <a href="/contact/" className={gradientCtaOutlineClass}>
              Nous contacter
            </a>
            <ContactPhoneLink variant="cta" />
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={primaryCta} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[560px] lg:min-h-[620px]">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/ville/versaille.jpg"
              alt="Vue de Versailles — destination d'un déménagement depuis Paris"
              className="absolute inset-0 h-full w-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/65 via-[#1C3957]/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/75 via-[#0f172a]/20 to-[#0f172a]/30" />
            <div className="absolute inset-y-0 left-0 w-full max-w-[62%] bg-gradient-to-r from-black/55 via-black/25 to-transparent lg:max-w-[58%]" />
          </div>

          <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-14 sm:py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="relative lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-lg">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  Paris → Versailles (78) • 20 km
                </div>
                <h1 className="mt-5 font-['Poppins',sans-serif] font-extrabold tracking-tight text-white text-3xl sm:text-4xl lg:text-5xl leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
                  Déménagement Paris Versailles
                </h1>
                <p className="mt-4 text-[#f1f5f9] text-base sm:text-lg leading-relaxed max-w-2xl font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.65)]">
                  Devis sous 24 h, assurance incluse et tarifs transparents : un rapport qualité-prix maîtrisé pour
                  votre déménagement entre Paris et Versailles, sans stress et sans mauvaise surprise.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Devis gratuit sous 24 h, sans engagement",
                    "Assurance contractuelle incluse",
                    "Équipes salariées Guivarche, zéro sous-traitance",
                    "Tarifs clairs et excellent rapport qualité-prix",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#F5C76E] mt-0.5 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" />
                      <span className="text-sm sm:text-[15px] text-[#f8fafc] font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_10px_rgba(0,0,0,0.6)]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={primaryCta}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3.5 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.35)] hover:brightness-110 transition"
                  >
                    Demander un devis gratuit
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <ContactPhoneLink
                    variant="cta"
                    className="justify-center w-full sm:w-auto min-h-[3.25rem] py-3.5 text-base"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
               
                <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-[0px_20px_50px_rgba(15,23,42,0.25)] border border-white/40 p-6 sm:p-7">
                  <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg">
                    Ce que vous obtenez
                  </p>
                  <div className="mt-4 grid gap-3">
                    {[
                      { icon: <Truck className="h-5 w-5" />, title: "Transport sécurisé", desc: "Camions adaptés, arrimage et protections." },
                      { icon: <ShieldCheck className="h-5 w-5" />, title: "Assurance & sérénité", desc: "Options claires selon la valeur de vos biens." },
                      { icon: <Timer className="h-5 w-5" />, title: "Créneaux flexibles", desc: "Interventions tôt, tard ou week-end selon dispo." },
                    ].map((x) => (
                      <div key={x.title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CC922F]/10 text-[#CC922F]">
                          {x.icon}
                        </div>
                        <div>
                          <div className="font-['Poppins',sans-serif] font-semibold text-[#191919] text-sm">
                            {x.title}
                          </div>
                          <div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                            {x.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#191919] text-white p-5">
                    <p className="font-['Poppins',sans-serif] font-semibold text-sm">
                      Astuce Versailles
                    </p>
                    <p className="mt-1 text-xs sm:text-[13px] text-white/80 leading-relaxed">
                      Centre historique, quartiers résidentiels, stationnement limité… Donnez-nous les détails et on
                      prévoit le bon matériel (sangles, protections, monte-meubles si besoin).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction SEO */}
        <section className="bg-white border-b border-slate-100">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-['Poppins',sans-serif] text-slate-700 text-base sm:text-lg leading-relaxed">
                Guivarche accompagne chaque semaine des familles et des professionnels sur la route{" "}
                <strong className="font-semibold text-[#1C3957]">Paris → Versailles</strong>, l'un des trajets les plus
                demandés en Île-de-France. À environ vingt kilomètres de la capitale, Versailles reste rapidement
                accessible via l'A13, le boulevard périphérique ou la ligne N du RER — un atout décisif pour organiser un
                déménagement fluide entre deux adresses exigeantes.
              </p>
              <p className="mt-4 font-['Poppins',sans-serif] text-slate-700 text-base sm:text-lg leading-relaxed">
                En tant que <strong className="font-semibold text-[#1C3957]">déménageur Paris Versailles</strong>, nous
                maîtrisons les contraintes des deux extrémités : stationnement réglementé et portage en immeuble parisien
                d'un côté, livraison dans les quartiers historiques ou résidentiels de Versailles de l'autre (Montreuil,
                Porchefontaine, centre-ville, Chantiers…). Votre{" "}
                <strong className="font-semibold text-[#1C3957]">déménagement entre Paris et Versailles</strong> est
                confié à des équipes 100 % salariées, sans sous-traitance.
              </p>
              <p className="mt-4 font-['Poppins',sans-serif] text-slate-700 text-base sm:text-lg leading-relaxed">
                Notre <strong className="font-semibold text-[#1C3957]">entreprise de déménagement Paris Versailles</strong>{" "}
                vous propose un devis ferme sous 24 h, une assurance incluse et des tarifs transparents. Du studio à la
                maison familiale, nous anticipons les accès, planifions le jour J et sécurisons chaque étape jusqu'à
                l'installation dans votre nouveau logement aux Yvelines (78).
              </p>
            </div>
          </div>
        </section>

        {/* Nos prestations incluses */}
        <section className="bg-gradient-to-b from-white via-slate-50/40 to-white py-14 sm:py-16 lg:py-20">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl leading-tight">
                Nos prestations incluses pour votre déménagement Paris Versailles
              </h2>
              <p className="mt-4 font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg leading-relaxed">
                Une formule complète pour un trajet local maîtrisé, de Paris jusqu'à votre nouveau logement à Versailles.
              </p>
            </div>

            <div className="mt-10 sm:mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {VERSAILLE_PRESTATIONS_INCLUDED.map((item) => (
                <div
                  key={item}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-[#CC922F]/35 hover:shadow-[0_8px_30px_rgba(204,146,47,0.12)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CC922F]/10 text-[#CC922F] transition-colors group-hover:bg-[#CC922F] group-hover:text-white">
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <p className="font-['Poppins',sans-serif] text-sm sm:text-[15px] font-medium text-[#1C3957] leading-snug pt-1.5">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 max-w-6xl mx-auto grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl border border-[#1C3957]/10 bg-[#1C3957] p-5 sm:p-6 text-white">
                <p className="font-['Poppins',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#CC922F]">
                  Paris
                </p>
                <p className="mt-2 font-['Poppins',sans-serif] text-sm sm:text-[15px] text-white/90 leading-relaxed">
                  Zones de stationnement, créneaux de chargement et autorisations mairie anticipées pour un départ
                  serein depuis la capitale.
                </p>
              </div>
              <div className="rounded-2xl border border-[#CC922F]/20 bg-[#CC922F]/5 p-5 sm:p-6">
                <p className="font-['Poppins',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#CC922F]">
                  Versailles
                </p>
                <p className="mt-2 font-['Poppins',sans-serif] text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                  Centre historique, rues étroites et contraintes ZFE : livraison organisée dans les Yvelines (78) avec le
                  matériel adapté.
                </p>
              </div>
            </div>
          </div>
        </section>

        {renderCtaBand(
          "Prêt à déménager de Paris à Versailles ?",
          "Obtenez votre devis gratuit sous 24 h. Équipes salariées, assurance incluse et tarifs transparents.",
        )}

        {/* Comment ça se passe */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
          <div className="flex flex-col gap-2">
            <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500">
              Comment ça se passe
            </p>
            <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
              Un déroulé simple, maîtrisé, pro.
            </h2>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "Étape 1",
                title: "Devis en ligne ou par téléphone",
                desc: "Gratuit, sans engagement.",
              },
              {
                step: "Étape 2",
                title: "Visite technique à domicile",
                desc: "Obligatoire au-dessus d'un certain volume.",
              },
              {
                step: "Étape 3",
                title: "Jour J — chargement à Paris",
                desc: "Avec l'équipe Guivarche.",
              },
              {
                step: "Étape 4",
                title: "Livraison et installation à Versailles",
                desc: "Vos meubles sont placés selon vos instructions.",
              },
            ].map((x) => (
              <div key={x.step} className="rounded-3xl border border-slate-100 bg-white shadow-[0px_10px_30px_rgba(15,23,42,0.06)] p-6">
                <div className="flex items-center justify-between">
                  <span className="font-['Poppins',sans-serif] font-extrabold text-[#CC922F] text-sm sm:text-base">
                    {x.step}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#CC922F]" aria-hidden="true" />
                </div>
                <div className="mt-3 font-['Poppins',sans-serif] font-bold text-[#191919]">
                  {x.title}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {x.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Fourchette tarifaire */}
        <section className="bg-white pt-14 sm:pt-16 lg:pt-20 px-4 sm:px-6 pb-14 sm:pb-16 lg:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl">
                Prix déménagement Paris Versailles
              </h2>
              <p className="mt-3 font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
                Fourchette indicative pour un déménagement entre Paris et Versailles — devis personnalisé sous 24 h.
              </p>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h3 className="font-['Poppins',sans-serif] font-semibold text-[#1C3957] text-lg sm:text-xl">
                Facteurs influençant le prix
              </h3>
              <p className="mt-2 font-['Poppins',sans-serif] text-slate-500 text-sm sm:text-base">
                Étage, monte-meuble, distance et volume
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-14 sm:mb-16">
              {VERSAILLE_PRICING_FACTORS.map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#CC922F]/10 flex items-center justify-center mx-auto mb-4">
                    <card.icon className="w-7 h-7 text-[#CC922F]" />
                  </div>
                  <p className="font-['Poppins',sans-serif] font-semibold text-[#1C3957] text-sm uppercase tracking-wider mb-2">
                    {card.label}
                  </p>
                  <p className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-lg sm:text-xl mb-2">
                    {card.value}
                  </p>
                  <p className="font-['Poppins',sans-serif] text-slate-500 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-10 sm:mb-14">
              <h3 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl mb-3">
                Indication de prix par type de logement
              </h3>
              <p className="font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
                Studio, T2, T3, T4 et +
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left">
                  <thead>
                    <tr className="bg-[#1C3957] text-white">
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Type de logement
                      </th>
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Volume estimé
                      </th>
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Budget moyen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {VERSAILLE_PRICING_ROWS.map((row, i) => (
                      <tr
                        key={row.type}
                        className={`border-b border-slate-100 ${
                          i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                        } hover:bg-[#CC922F]/5 transition-colors`}
                      >
                        <td className="font-['Poppins',sans-serif] font-medium text-[#1C3957] text-sm sm:text-base px-5 sm:px-8 py-4">
                          {row.type}
                        </td>
                        <td className="font-['Poppins',sans-serif] text-slate-600 text-sm sm:text-base px-5 sm:px-8 py-4">
                          {row.volume}
                        </td>
                        <td className="font-['Poppins',sans-serif] font-semibold text-[#CC922F] text-sm sm:text-base px-5 sm:px-8 py-4">
                          {row.budget}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-8 text-center font-['Poppins',sans-serif] text-sm sm:text-base text-slate-500 italic max-w-2xl mx-auto">
              Ces prix sont indicatifs — devis personnalisé sur demande.
            </p>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={primaryCta}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#CC922F] hover:bg-[#b5821f] text-white font-['Poppins',sans-serif] font-semibold px-8 py-3 text-base transition-colors"
              >
                Demander un devis personnalisé
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <GoogleReviewsSection />

        <DestinationFaqSection
          title="FAQ spécifique à la destination"
          subtitle="Réponses ciblées sur la route Paris → Versailles : tarifs, délais, quartiers et logistique."
          items={VERSAILLE_DESTINATION_FAQ}
        />

        {/* Autres villes */}
        <section className="bg-white border-t border-slate-100 py-14 sm:py-16 lg:py-20">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-base sm:text-lg lg:text-xl text-center uppercase tracking-[0.14em] sm:tracking-[0.18em]">
              Livraisons dans les autres villes de France
            </h2>
            <div className="mt-10 sm:mt-12 max-w-5xl mx-auto text-center">
              <p className="font-['Poppins',sans-serif] text-slate-600 text-sm sm:text-base leading-[2.2] sm:leading-[2.4]">
                {VERSAILLE_OTHER_CITIES.map((city, index) => (
                  <span key={city}>
                    <Sparkles
                      className="inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#CC922F] align-middle mx-0.5 sm:mx-1"
                      aria-hidden="true"
                    />
                    <span className="inline text-slate-700 hover:text-[#1C3957] transition-colors mx-0.5 sm:mx-1">
                      Déménagement Paris {city}
                    </span>
                    {index < VERSAILLE_OTHER_CITIES.length - 1 ? (
                      <span className="text-slate-300 mx-0.5 sm:mx-1" aria-hidden="true">
                        {" "}
                      </span>
                    ) : null}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        {renderCtaBand(
          "Prêt à déménager en toute sérénité ?",
          "Rejoignez des milliers de clients qui ont déjà fait confiance à Guivarche. Obtenez votre devis gratuit maintenant !",
        )}
      </main>

      <Footer />
    </div>
  );
}
