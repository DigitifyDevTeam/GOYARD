import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Clock,
  Shield,
  ArrowRight,
  Truck,
  Users,
  CheckCircle,
  Calendar,
  Laptop,
  Warehouse,
  ShoppingCart,
  ChevronRight,
  Lock,
  Headphones,
  Globe,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContactPhoneLink } from "@/components/ContactPhoneLink";
import {
  gradientCtaActionsClass,
  gradientCtaOutlineButtonClass,
  gradientCtaPrimaryButtonClass,
} from "@/components/gradientCtaStyles";
import TarificationSection from "@/components/TarificationSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import InteractiveImageBentoGallery from "@/components/bento-gallery";

// ─── Professionnel Data ───────────────────────────────────────────

const proDomaines = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Bureaux",
    description: "Postes de travail, mobilier, archivage",
  },
  {
    icon: <Laptop className="w-8 h-8" />,
    title: "IT / Matériel",
    description: "Déménagement sécurisé de serveurs",
  },
  {
    icon: <Warehouse className="w-8 h-8" />,
    title: "Entrepôts",
    description: "Stockage industriel, racks et palettes",
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "Commerces",
    description: "Agencement, linéaires, caisse",
  },
];

/*
const proFormules = [
  {
    name: "Standard",
    subtitle: "Petites structures",
    popular: false,
    features: [
      "Déménagement de mobilier",
      "Emballage standard",
      "Livraison J+1",
      "1 chef d'équipe dédié",
    ],
  },
  {
    name: "Business",
    subtitle: "PME jusqu'à 50 postes",
    popular: true,
    features: [
      "Tout le pack Standard",
      "Déménagement IT sécurisé",
      "Intervention nuit/WE",
      "Coordinateur dédié",
      "Compte-rendu de transfert",
    ],
  },
  {
    name: "Grand compte",
    subtitle: "Sur devis, sur mesure",
    popular: false,
    features: [
      "Tout le pack Business",
      "Multi-sites / international",
      "Gestion des archives",
      "SLA contractualisé",
    ],
  },
];
*/

const proSteps = [
  {
    number: "01",
    title: "Audit des besoins",
    description: "Visite sur site, inventaire complet",
    icon: <ClipboardCheck className="w-6 h-6" />,
  },
  {
    number: "02",
    title: "Plan de transfert",
    description: "Planning, jalons, équipes dédiées",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    number: "03",
    title: "Exécution",
    description: "Intervention coordonnée, reporting",
    icon: <Truck className="w-6 h-6" />,
  },
  {
    number: "04",
    title: "Réception & bilan",
    description: "Vérification, PV de livraison",
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

const proEngagements = [
  {
    icon: <Clock className="w-6 h-6" />,
    text: "Disponibilité 7j/7, y compris nuit et week-end",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    text: "Assurance RC Pro tous risques",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    text: "Confidentialité des données garantie",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    text: "Interlocuteur unique du devis au bilan",
  },
];


// ─── Gallery Data (Entreprise) ────────────────────────────────────

const entrepriseGalleryItems = [
  { id: 1, title: "Déménagement entreprise", desc: "Transfert complet de bureaux et mobilier professionnel.", url: "/gallery/D%C3%A9m%C3%A9nagement%20entreprise.jpeg", span: "md:col-span-2 md:row-span-2" },
  { id: 2, title: "Déménagement groupé", desc: "Gestion logistique multi-sites pour les grandes structures.", url: "/gallery/D%C3%A9m%C3%A9nagement%20group%C3%A9.jpeg", span: "md:row-span-1" },
  { id: 3, title: "Déménagement international", desc: "Transfert d'activité à l'international, douane et logistique incluses.", url: "/gallery/D%C3%A9m%C3%A9nagement%20international.jpeg", span: "md:row-span-1" },
  { id: 4, title: "Longue distance", desc: "Solutions de transport longue distance pour vos équipements.", url: "/gallery/D%C3%A9m%C3%A9nagement%20longue%20distance.jpeg", span: "md:row-span-1" },
  { id: 5, title: "Préparation des cartons", desc: "Conditionnement des effets personnels avec soin.", url: "/gallery/WhatsApp%20Image%202026-0-04%20at%2000.07.05.jpeg", span: "md:row-span-1" },
  { id: 6, title: "Flotte et logistique", desc: "Véhicules adaptés aux volumes professionnels.", url: "/gallery/img6.jpeg", span: "md:row-span-1" },
  { id: 7, title: "Installation d'équipements", desc: "Mise en place soignée de matériel sensible et encombrant.", url: "/gallery/WhatsApp%20Image%202026-03-04%20at%2000.07.065jpeg.jpeg", span: "md:row-span-1" },
  { id: 8, title: "Installation sur site", desc: "Remise en place complète dans vos nouveaux locaux.", url: "/gallery/4.jpeg", span: "md:row-span-1" },
  { id: 9, title: "Coordination d'équipe", desc: "Gestion de projet et supervision sur le terrain.", url: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.54.jpeg", span: "md:row-span-1" },
  { id: 10, title: "Emballage professionnel", desc: "Conditionnement adapté aux équipements sensibles.", url: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.55.jpeg", span: "md:row-span-1" },
  { id: 11, title: "Transfert de mobilier", desc: "Déplacement et réagencement de mobilier de bureau.", url: "/gallery/WhatsApp%20Image%202026-03-04%20at%2000.21.13.jpeg", span: "md:row-span-1" },
  { id: 12, title: "Livraison et montage", desc: "Réception, montage et vérification dans les nouveaux espaces.", url: "/gallery/WhatsApp%20Image%202026-03-04%20at%2000.21.14.jpeg", span: "md:row-span-1" },
];

// ─── Reusable Section Header ──────────────────────────────────────

function SectionHeader({
  icon,
  pill,
  pillColor = "gold",
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  pill: string;
  pillColor?: "gold" | "navy";
  title: string;
  subtitle?: string;
}) {
  const bg =
    pillColor === "gold" ? "bg-[#CC922F]/10" : "bg-[#1C3957]/10";
  const textColor =
    pillColor === "gold" ? "text-[#CC922F]" : "text-[#1C3957]";

  return (
    <div className="text-center mb-10 sm:mb-16">
      <motion.div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${bg} mb-4`}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={textColor}>{icon}</span>
        <span className={`text-sm font-semibold ${textColor}`}>{pill}</span>
      </motion.div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#1C3957] font-['Poppins',sans-serif]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-['Poppins',sans-serif]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/*
// ─── Pricing Card ─────────────────────────────────────────────────

function PricingCard({
  name,
  subtitle,
  popular,
  features,
  index,
}: {
  name: string;
  subtitle: string;
  popular: boolean;
  features: string[];
  index: number;
}) {
  return (
    <motion.div
      className={`relative rounded-2xl p-6 sm:p-8 flex flex-col h-full transition-all duration-300 ${
        popular
          ? "bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white shadow-2xl scale-[1.02] border-2 border-[#CC922F]"
          : "bg-white text-[#1C3957] shadow-lg border border-gray-200 hover:border-[#CC922F]/40"
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#CC922F] text-white text-xs font-bold rounded-full uppercase tracking-wider font-['Poppins',sans-serif]">
          Le plus choisi
        </div>
      )}

      <h3
        className={`text-2xl font-bold mb-1 font-['Poppins',sans-serif] ${
          popular ? "text-white" : "text-[#1C3957]"
        }`}
      >
        {name}
      </h3>
      <p
        className={`text-sm mb-6 font-['Poppins',sans-serif] ${
          popular ? "text-white/80" : "text-gray-500"
        }`}
      >
        {subtitle}
      </p>

      <ul className="space-y-3 flex-1 mb-8">
        {features.map((feat, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle
              className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#CC922F]"
            />
            <span
              className={`text-sm font-['Poppins',sans-serif] ${
                popular ? "text-white/90" : "text-gray-600"
              }`}
            >
              {feat}
            </span>
          </li>
        ))}
      </ul>

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          size="lg"
          className={`w-full rounded-full font-semibold font-['Poppins',sans-serif] ${
            popular
              ? "bg-[#CC922F] hover:bg-[#b58228] text-white"
              : "bg-[#1C3957] hover:bg-[#2a4f6b] text-white"
          }`}
          onClick={() =>
            (window.location.href = "/tunnel/mes-coordonnees")
          }
        >
          Choisir cette formule
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
*/

// ─── Step Card ────────────────────────────────────────────────────

function StepCard({
  number,
  title,
  description,
  index,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] flex items-center justify-center mb-5 shadow-lg relative"
        whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
      >
        <span className="text-2xl font-bold text-[#CC922F] font-['Poppins',sans-serif]">
          {number}
        </span>
      </motion.div>
      <h4 className="text-lg font-bold text-[#1C3957] mb-2 font-['Poppins',sans-serif]">
        {title}
      </h4>
      <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
        {description}
      </p>
    </motion.div>
  );
}

function GoogleReviewsSection() {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]'))
      return;
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* Desktop: section title + Google Reviews widget */}
      <div className="hidden lg:block w-full max-w-[1920px] bg-white pt-20 pb-12">
        <div className="text-center section-px">
          <h2 className="font-['Poppins',_sans-serif] font-[600] text-3xl lg:text-4xl xl:text-[51px] xl:leading-[62px] text-black">
            Ce que nos clients disent de nous !
          </h2>
        </div>
        <div className="mt-8 flex justify-center">
          <div
            className="elfsight-app-402ccb84-5c20-4877-9afd-70877cb72277"
            data-elfsight-app-lazy
          />
        </div>
      </div>
      {/* Mobile: section title + Google Reviews widget */}
      <div className="lg:hidden w-full bg-white pt-16 pb-10 sm:pt-20 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-['Poppins',_sans-serif] font-[600] text-2xl sm:text-3xl text-black">
            Ce que nos clients disent de nous !
          </h2>
        </div>
        <div className="mt-6 flex justify-center">
          <div
            className="elfsight-app-402ccb84-5c20-4877-9afd-70877cb72277 w-full"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function DemenagementEntreprise() {
  usePageMeta(PAGE_META.demenagementEntreprise);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Professionnel */}
        <section className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#CC922F] rounded-full blur-3xl" />
            <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Building2 className="h-4 w-4 text-[#CC922F]" />
              <span className="text-sm font-medium text-white font-['Poppins',sans-serif]">
                Déménagement professionnel
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Transfert d'entreprise{" "}
              <span className="text-[#CC922F]">sans interruption</span>{" "}
              d'activité
            </motion.h1>
          </div>
        </section>

        {/* Domaines d'intervention */}
        <section className="bg-white py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Globe className="h-4 w-4" />}
              pill="Notre expertise"
              pillColor="gold"
              title="Nos domaines d'intervention"
              subtitle="Des solutions spécialisées pour chaque type d'activité"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {proDomaines.map((domaine, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] p-6 sm:p-8 rounded-2xl border border-[#1C3957] text-center group hover:from-[#2a4f6b] hover:to-[#1C3957] hover:shadow-xl shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#CC922F] flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-[#CC922F]/90 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {domaine.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-white font-['Poppins',sans-serif]">
                    {domaine.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed font-['Poppins',sans-serif] text-sm">
                    {domaine.description}
                  </p>
                  <motion.div className="w-10 h-0.5 bg-[#CC922F] mt-6 mx-auto group-hover:w-16 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tarification – contenu réutilisé depuis la page Tarification */}
        <TarificationSection />

        {/* Notre méthode projet */}
        <section className="bg-white py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Calendar className="h-4 w-4" />}
              pill="Méthode projet"
              pillColor="gold"
              title="Notre méthode projet"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 max-w-4xl mx-auto relative">
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#1C3957]/20 via-[#1C3957] to-[#1C3957]/20" />
              {proSteps.map((step, index) => (
                <StepCard key={index} index={index} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* Galerie entreprise */}
        <InteractiveImageBentoGallery
          imageItems={entrepriseGalleryItems}
          uniformTiles
          title="Guivarche déménagement en action"
          description="Découvrez nos transferts d'entreprise en images : bureaux, entrepôts, matériel IT et installations sur site."
        />

        {/* Engagements */}
        <section className="bg-gray-50 py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Shield className="h-4 w-4" />}
              pill="Nos garanties"
              pillColor="navy"
              title="Nos engagements pour les entreprises"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {proEngagements.map((eng, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:border-[#CC922F]/30 transition-all duration-300"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -3,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#CC922F]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#CC922F]">{eng.icon}</span>
                  </div>
                  <p className="text-[#1C3957] font-medium font-['Poppins',sans-serif] text-sm sm:text-base">
                    {eng.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ils nous ont fait confiance */}
        <section className="bg-white py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <SectionHeader
              icon={<Users className="h-4 w-4" />}
              pill="Références"
              pillColor="gold"
              title="Ils nous ont fait confiance"
            />

            <style>{`
              @keyframes entreprise-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .entreprise-marquee-track {
                animation: entreprise-marquee 35s linear infinite;
              }
            `}</style>

            <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
              <div className="entreprise-marquee-track flex items-center gap-12 py-4 w-max">
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Fedex-logo.png" alt="FedEx" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sorbonne.svg" alt="Sorbonne" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(0.85)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sephora.svg" alt="Sephora" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Dior_Logo.svg.png" alt="Dior" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/IXINA-Logo_BLEU_CMJN.jpg" alt="Ixina" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Logo_BWT_Alpine_F1_Team_-_2022.svg" alt="BWT Alpine F1 Team" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Longchamps.jpg" alt="Longchamp" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Pinsent_Masons_logo.svg" alt="Pinsent Masons" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/espot.jpg" alt="Espot" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.25)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Polene.jpg" alt="Polène" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/le-tanneur.png" alt="Le Tanneur" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Givenchy.png" alt="Givenchy" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/meurice.jpg" alt="Le Meurice" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/gallery-dept.png" alt="Gallery Dept" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.55)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Hilton.png" alt="Hilton" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>
                {/* Duplicated set for seamless loop */}
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Fedex-logo.png" alt="FedEx" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sorbonne.svg" alt="Sorbonne" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(0.85)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sephora.svg" alt="Sephora" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Dior_Logo.svg.png" alt="Dior" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/IXINA-Logo_BLEU_CMJN.jpg" alt="Ixina" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Logo_BWT_Alpine_F1_Team_-_2022.svg" alt="BWT Alpine F1 Team" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Longchamps.jpg" alt="Longchamp" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Pinsent_Masons_logo.svg" alt="Pinsent Masons" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/espot.jpg" alt="Espot" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.25)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Polene.jpg" alt="Polène" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/le-tanneur.png" alt="Le Tanneur" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Givenchy.png" alt="Givenchy" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/meurice.jpg" alt="Le Meurice" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/gallery-dept.png" alt="Gallery Dept" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.55)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Hilton.png" alt="Hilton" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>
              </div>
            </div>
          </div>
        </section>

        <GoogleReviewsSection />

        {/* CTA Professionnel */}
        <section className="bg-gray-50 py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#1C3957] to-[#CC922F] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white rounded-full blur-2xl" />
              </div>
              <div className="relative z-10">
                <motion.div
                  className="inline-flex items-center gap-2 mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Building2 className="w-8 h-8" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Poppins',sans-serif]">
                  Planifiez votre transfert
                </h2>
                <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                  Parlez à un chef de projet en moins de 24h
                </p>

                <div className={gradientCtaActionsClass}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className={gradientCtaPrimaryButtonClass}
                      onClick={() => (window.location.href = "/tunnel/mes-coordonnees")}
                    >
                      Demander un devis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className={gradientCtaOutlineButtonClass}
                      onClick={() => (window.location.href = "/solution")}
                    >
                      Découvrir notre solution
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <ContactPhoneLink variant="cta" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
