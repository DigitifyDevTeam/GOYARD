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
} from "lucide-react";
import { HeroTrustCard, HeroTrustCardMobile } from "../components/HeroTrustCard";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import {
  gradientCtaActionsClass,
  gradientCtaOutlineClass,
  gradientCtaPrimaryClass,
} from "../components/gradientCtaStyles";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { InterventionMapVersaille } from "../components/intervention-map";
import { DestinationFaqSection } from "../components/destination/DestinationFaqSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

const VERSAILLE_PRICING_ROWS = [
  { type: "Studio", volume: "10–15 m³", budget: "450 à 800 €" },
  { type: "T2", volume: "15–25 m³", budget: "700 à 1 200 €" },
  { type: "T3", volume: "25–40 m³", budget: "1 100 à 1 800 €" },
  { type: "T4+", volume: "40 m³ +", budget: "Sur devis" },
] as const;

const VERSAILLE_PRICING_FACTORS = [
  {
    icon: Cube,
    label: "Volume",
    value: "À transporter",
    desc: "Le volume à déménager reste le principal levier du devis.",
  },
  {
    icon: Building2,
    label: "Étage & accès",
    value: "Accessibilité",
    desc: "Étage, ascenseur et conditions d'accès influencent la manutention.",
  },
  {
    icon: MapPin,
    label: "Distance",
    value: "Paris → Versailles",
    desc: "Distance et conditions de stationnement à Paris et à Versailles.",
  },
  {
    icon: ArrowUpFromLine,
    label: "Monte-meuble",
    value: "Si nécessaire",
    desc: "Besoin de monte-meuble et prestations choisies selon votre projet.",
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

const VERSAILLE_INTRO_TRUCK_IMAGE = "/gallery/Déménagement international.jpeg";

function VersailleIntroImage() {
  return (
    <div className="relative h-full w-full">
      {/* Ambient glow blobs */}
      <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-[#CC922F]/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[#1C3957]/15 blur-3xl" aria-hidden />

      {/* Dotted texture accent */}
      <div
        className="absolute -bottom-2 -right-2 z-0 hidden sm:block"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, rgba(204,146,47,0.35) 2px, transparent 2px)",
          backgroundSize: "14px 14px",
          width: 100,
          height: 100,
        }}
      />

      {/* Main framed image with gradient ring */}
      <div className="relative z-10 h-full rounded-[24px] bg-gradient-to-br from-[#CC922F] via-[#e0b15f] to-[#1C3957] p-[3px] shadow-[0_30px_70px_-15px_rgba(28,57,87,0.45)]">
        <div className="h-full overflow-hidden rounded-[22px] bg-white">
          <div className="relative h-full">
            <img
              src={VERSAILLE_INTRO_TRUCK_IMAGE}
              alt="Camion Guivarche Déménagement — Paris Versailles"
              className="block h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/75 via-[#0f172a]/10 to-transparent" />

            {/* Top-left location pill */}
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-lg backdrop-blur-sm">
              <MapPin className="h-3 w-3 text-[#CC922F]" />
              <span className="font-['Poppins',sans-serif] text-[10px] font-bold uppercase tracking-wider text-[#1C3957]">
                Versailles 78
              </span>
            </div>

            {/* Bottom caption */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-['Poppins',sans-serif] text-base font-extrabold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Paris → Versailles
              </p>
              <p className="mt-0.5 font-['Poppins',sans-serif] text-[11px] font-medium text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                Équipes salariées Guivarche
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating glass stat — top right */}
      <div className="absolute -right-3 top-1 z-20 hidden items-center gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.18)] backdrop-blur-md sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#CC922F]/12 text-[#CC922F]">
          <Timer className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="font-['Poppins',sans-serif] text-sm font-extrabold text-[#1C3957]">24 h</p>
          <p className="font-['Poppins',sans-serif] text-[10px] font-medium text-slate-500">Devis gratuit</p>
        </div>
      </div>

      {/* Floating glass stat — bottom left */}
      <div className="absolute -bottom-2 -left-3 z-20 hidden items-center gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.18)] backdrop-blur-md sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C3957]/10 text-[#1C3957]">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="font-['Poppins',sans-serif] text-sm font-extrabold text-[#1C3957]">100 %</p>
          <p className="font-['Poppins',sans-serif] text-[10px] font-medium text-slate-500">Assuré &amp; sécurisé</p>
        </div>
      </div>
    </div>
  );
}

function VersaillePrestationCard({ item }: Readonly<{ item: string }>) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-[#CC922F]/35 hover:shadow-[0_8px_30px_rgba(204,146,47,0.12)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CC922F]/10 text-[#CC922F] transition-colors group-hover:bg-[#CC922F] group-hover:text-white">
        <Check className="h-5 w-5" strokeWidth={2.5} />
      </div>
      <p className="font-['Poppins',sans-serif] text-sm sm:text-[15px] font-medium text-[#1C3957] leading-snug pt-1.5">
        {item}
      </p>
    </div>
  );
}

const VERSAILLE_DESTINATION_FAQ = [
  {
    question: "Combien coûte un déménagement Paris Versailles ?",
    answer:
      "Un déménagement Paris Versailles coûte en moyenne entre 450 € et 2 400 €. Le prix dépend du volume (m³), des accès (étage, ascenseur, stationnement) et des services (emballage, monte-meuble, stockage). Le trajet court réduit les frais kilométriques. Un devis personnalisé est indispensable pour obtenir un prix exact.",
  },
  {
    question: "Combien de temps dure un déménagement entre Paris et Versailles ?",
    answer:
      "La durée moyenne d'un déménagement Paris Versailles est de 3 à 6 heures pour un logement standard. Elle varie selon le volume à transporter, la circulation à Paris et les conditions d'accès aux logements.",
  },
  {
    question: "Quels quartiers de Versailles sont desservis par Guivarche ?",
    answer:
      "Guivarche intervient dans tous les quartiers de Versailles : Notre-Dame, Saint-Louis, Montreuil, Clagny-Glatigny, Porchefontaine, ainsi que les communes voisines des Yvelines.",
  },
  {
    question: "Faut-il une autorisation de stationnement pour un déménagement à Paris ?",
    answer:
      "Oui. À Paris, une autorisation de stationnement est souvent obligatoire pour réserver un emplacement de camion. Elle doit être demandée à la mairie de l'arrondissement. Cette étape évite les amendes et facilite le chargement le jour du déménagement.",
  },
  {
    question: "Le déménagement Paris Versailles inclut-il un service de garde-meubles ?",
    answer:
      "Oui. Il est possible de stocker temporairement vos biens dans un garde-meubles sécurisé si votre logement à Versailles n'est pas encore disponible ou en cas de décalage de dates.",
  },
  {
    question: "Les biens sont-ils assurés pendant le déménagement ?",
    answer:
      "Oui. Tous les biens transportés par Guivarche sont couverts par une assurance pendant le chargement, le transport et la livraison, selon les conditions définies dans le devis.",
  },
  {
    question: "Quand réserver un déménagement Paris Versailles ?",
    answer:
      "Il est conseillé de réserver 3 à 6 semaines à l'avance, et jusqu'à 8 semaines en haute saison (été, fins de mois), afin de garantir disponibilité et organisation optimale.",
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
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
              <div className="relative lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-lg">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  Paris → Versailles (78) • 20 km
                </div>
                <h1 className="mt-5 font-['Poppins',sans-serif] font-extrabold tracking-tight text-white text-3xl sm:text-4xl lg:text-5xl leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
                  Déménagement Paris Versailles
                </h1>
                <p className="mt-4 text-[#f1f5f9] text-base sm:text-lg leading-relaxed max-w-2xl font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.65)]">
                  Un déménagement simple, rapide et sécurisé entre Paris et Versailles avec Guivarche
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Devis gratuit et rapide",
                    "Protection optimale de vos biens",
                    "Équipe expérimentée et organisée",
                    "Intervention sur Paris et Versailles",
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

              <div className="lg:col-span-5 flex w-full justify-center lg:self-end">
                <div className="hidden lg:block w-full">
                  <HeroTrustCard />
                </div>
                <div className="lg:hidden w-full">
                  <HeroTrustCardMobile />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction SEO */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16 bg-white border-b border-slate-100">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px] lg:gap-10 xl:gap-14 lg:items-stretch">
            <div>
              <div className="flex flex-col gap-2">
                <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500">
                  Paris → Versailles
                </p>
                <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
                  Guivarche, votre déménageur spécialisé Paris Versailles
                </h2>
              </div>
              <div className="mt-4 sm:mt-5 space-y-4">
                <p className="font-['Poppins',sans-serif] text-slate-700 text-base sm:text-lg leading-relaxed">
                  Vous préparez un déménagement de Paris à Versailles ? Avec Guivarche, vous bénéficiez d'un accompagnement
                  complet pour organiser un transfert fluide, maîtrisé et sans stress, quelle que soit la taille de votre
                  logement.
                </p>
                <p className="font-['Poppins',sans-serif] text-slate-700 text-base sm:text-lg leading-relaxed">
                  Notre équipe prend en charge chaque étape : emballage, transport, manutention et installation dans votre
                  nouveau logement à Versailles. L'objectif est simple : vous libérer de toute contrainte logistique. Un
                  déménagement Paris Versailles demande une vraie expertise terrain. Entre les contraintes de stationnement
                  à Paris, les immeubles parfois sans ascenseur, la circulation dense et les accès variables selon les
                  quartiers de Versailles, une mauvaise organisation peut rapidement compliquer le projet.
                </p>
                <p className="font-['Poppins',sans-serif] text-slate-700 text-base sm:text-lg leading-relaxed">
                  Avec Guivarche, chaque déménagement est anticipé et structuré afin d'éviter les imprévus et garantir un
                  déroulement fluide. Nous intervenons régulièrement dans tout Paris ainsi que dans les quartiers de
                  Versailles comme Notre-Dame, Saint-Louis, Montreuil, Clagny-Glatigny ou Porchefontaine. Vous bénéficiez
                  d'un interlocuteur unique et d'une organisation maîtrisée du début à la fin.
                </p>
              </div>
            </div>
            <div className="relative mx-auto h-[300px] w-full max-w-[360px] sm:h-[340px] sm:max-w-[400px] lg:mx-0 lg:h-full lg:max-w-none">
              <VersailleIntroImage />
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

            <div className="mt-10 sm:mt-12 max-w-6xl mx-auto space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {VERSAILLE_PRESTATIONS_INCLUDED.slice(0, -3).map((item) => (
                  <VersaillePrestationCard key={item} item={item} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:mx-auto lg:max-w-[75%]">
                {VERSAILLE_PRESTATIONS_INCLUDED.slice(-3).map((item) => (
                  <VersaillePrestationCard key={item} item={item} />
                ))}
              </div>
            </div>

            
          </div>
        </section>

        {renderCtaBand(
          "Devis déménagement Paris Versailles",
          "Obtenez rapidement une estimation personnalisée et sans surprise pour votre déménagement. Guivarche vous propose un devis clair, adapté à votre besoin et accompagné par un conseiller dédié.",
        )}

        {/* Comment ça se passe */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
          <div className="flex flex-col gap-2">
            <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500">
              Comment ça se passe
            </p>
            <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
              Comment se déroule votre déménagement ?
            </h2>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "Étape 1",
                title: "Demande de devis",
                desc: "Vous nous transmettez les informations essentielles : adresse, volume et date souhaitée.",
              },
              {
                step: "Étape 2",
                title: "Préparation",
                desc: "Nous analysons les accès et préparons les moyens logistiques adaptés à votre déménagement.",
              },
              {
                step: "Étape 3",
                title: "Jour du déménagement",
                desc: "Notre équipe assure le chargement à Paris avec protection complète de vos biens.",
              },
              {
                step: "Étape 4",
                title: "Livraison à Versailles",
                desc: "Vos meubles sont livrés et installés dans votre nouveau logement selon vos consignes.",
              },
            ].map((x, index) => (
              <div
                key={x.step}
                className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-[0px_10px_30px_rgba(15,23,42,0.06)]"
              >
                <span
                  className="pointer-events-none absolute -right-1 -top-2 font-['Poppins',sans-serif] text-[5.5rem] font-extrabold leading-none text-[#CC922F]/[0.07] select-none"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-start justify-between gap-3">
                  <span className="font-['Poppins',sans-serif] text-sm font-extrabold text-[#CC922F] sm:text-base">
                    {x.step}
                  </span>

                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                    <span
                      className="absolute inset-0 rounded-full border-2 border-dashed border-[#CC922F]/35"
                      aria-hidden
                    />
                    <span
                      className="absolute inset-1 rounded-full bg-[#CC922F]/10"
                      aria-hidden
                    />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#CC922F] to-[#a67824] font-['Poppins',sans-serif] text-lg font-extrabold text-white shadow-[0_6px_18px_rgba(204,146,47,0.45)] ring-[3px] ring-white">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <div className="relative mt-3 font-['Poppins',sans-serif] font-bold text-[#191919]">
                  {x.title}
                </div>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                  {x.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Fourchette tarifaire */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16 bg-white">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl">
              Prix d'un déménagement Paris Versailles
            </h2>
            <p className="mt-3 font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg leading-relaxed">
              Le tarif d'un déménagement avec Guivarche dépend de plusieurs facteurs : volume à transporter, étage et
              accessibilité, distance et conditions de stationnement, besoin de monte-meuble et prestations choisies.
              Chaque projet étant différent, un devis personnalisé est nécessaire pour obtenir un prix précis et adapté.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="font-['Poppins',sans-serif] font-semibold text-[#1C3957] text-lg sm:text-xl">
                Facteurs influençant le prix
              </h3>
              <p className="mt-2 font-['Poppins',sans-serif] text-slate-500 text-sm sm:text-base">
                Volume, accès, distance, monte-meuble et prestations
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
                Estimation par type de logement
              </h3>
              <p className="font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
                Logement, volume et prix indicatif
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left">
                  <thead>
                    <tr className="bg-[#1C3957] text-white">
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Logement
                      </th>
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Volume
                      </th>
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Prix indicatif
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
              Tarifs indicatifs pouvant varier selon les conditions d'accès et les services choisis.
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
          title="FAQ"
          items={VERSAILLE_DESTINATION_FAQ}
        />

        {/* Zones d'intervention */}
        <InterventionMapVersaille />

        {renderCtaBand(
          "Demandez votre devis avec Guivarche",
          "Pour toute destination, bénéficiez d'un accompagnement personnalisé.",
        )}

        {/* Maillage interne */}
        <section className="bg-white border-t border-slate-100 py-16 sm:py-20 lg:py-24">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-xl sm:text-2xl lg:text-3xl text-center uppercase tracking-[0.12em] sm:tracking-[0.16em]">
              Livraisons dans les autres villes de France
            </h2>
            <div className="mt-12 sm:mt-14 max-w-6xl mx-auto text-center">
              <p className="font-['Poppins',sans-serif] text-slate-600 text-base sm:text-lg leading-[2.4] sm:leading-[2.6]">
                {VERSAILLE_OTHER_CITIES.map((city, index) => (
                  <span key={city}>
                    <Sparkles
                      className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-[#CC922F] align-middle mx-0.5 sm:mx-1.5"
                      aria-hidden="true"
                    />
                    <span className="inline text-slate-700 hover:text-[#1C3957] transition-colors mx-0.5 sm:mx-1.5">
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
      </main>

      <Footer />
    </div>
  );
}
