import { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import {
  Home,
  Building2,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Zap,
  Truck,
  Package,
  Users,
  CheckCircle,
  FileText,
  Calendar,
  Laptop,
  Warehouse,
  ShoppingCart,
  Quote,
  Phone,
  ChevronRight,
  Lock,
  Headphones,
  Globe,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TarificationSection from "@/components/TarificationSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface StatCounterProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: false });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    } else if (!isInView && hasAnimated) {
      springValue.set(0);
      setHasAnimated(false);
    }
  }, [isInView, value, springValue, hasAnimated]);

  const displayValue = useTransform(springValue, (latest: number) =>
    Math.floor(latest)
  );

  return (
    <motion.div
      className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] p-6 rounded-xl flex flex-col items-center text-center group hover:from-[#2a4f6b] hover:to-[#1C3957] transition-all duration-300 border border-[#1C3957] hover:shadow-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-14 h-14 rounded-full bg-[#CC922F] flex items-center justify-center mb-4 text-white group-hover:bg-[#CC922F]/90 transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div
        ref={countRef}
        className="text-3xl font-bold text-white flex items-center font-['Poppins',sans-serif]"
      >
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-white/90 text-sm mt-1 font-['Poppins',sans-serif]">
        {label}
      </p>
      <motion.div className="w-10 h-0.5 bg-[#CC922F] mt-3 group-hover:w-16 transition-all duration-300" />
    </motion.div>
  );
}

// ─── Particulier Data ─────────────────────────────────────────────

const particulierServices = [
  {
    icon: <Package className="w-8 h-8" />,
    title: "Emballage",
    description: "Protection soignée de vos affaires",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Transport",
    description: "Véhicules adaptés, tous volumes",
  },
  {
    icon: <Home className="w-8 h-8" />,
    title: "Installation",
    description: "Montage et mise en place inclus",
  },
];

const particulierFormules = [
  {
    name: "Essentiel",
    subtitle: "Transport seul",
    popular: false,
    features: [
      "Chargement / déchargement",
      "Camion adapté",
      "Assurance incluse",
      "Démontage meubles",
    ],
  },
  {
    name: "Confort",
    subtitle: "Emballage + transport",
    popular: true,
    features: [
      "Tout le pack Essentiel",
      "Cartons fournis",
      "Emballage fragiles",
    ],
  },
  {
    name: "Clé en main",
    subtitle: "Service complet",
    popular: false,
    features: [
      "Tout le pack Confort",
      "Remontage meubles",
      "Gestion garde-meuble",
    ],
  },
];

const particulierSteps = [
  {
    number: "01",
    title: "Devis gratuit",
    description: "En ligne ou par téléphone",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    number: "02",
    title: "Visite technique",
    description: "Inventaire à domicile",
    icon: <ClipboardCheck className="w-6 h-6" />,
  },
  {
    number: "03",
    title: "Jour J",
    description: "Équipe ponctuelle et soignée",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    number: "04",
    title: "Emménagé !",
    description: "Installation et vérification",
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

const particulierFaqs = [
  {
    question: "Combien de temps à l'avance dois-je réserver ?",
    answer:
      "Nous recommandons de contacter nos équipes au moins 2 à 3 semaines avant la date souhaitée, surtout en période estivale.",
  },
  {
    question: "Le devis est-il vraiment gratuit ?",
    answer:
      "Oui, le devis et la visite technique sont entièrement gratuits et sans engagement de votre part.",
  },
  {
    question: "Assurez-vous les objets fragiles ?",
    answer:
      "Tous nos déménagements incluent une assurance. Des options de couverture renforcée sont disponibles pour les objets de valeur.",
  },
  {
    question: "Puis-je modifier la date après signature ?",
    answer:
      "Oui, sous réserve de disponibilité. Contactez votre conseiller dès que possible pour tout changement.",
  },
];

const testimonials = [
  {
    rating: 5,
    text: "Équipe très professionnelle, rien de cassé. Merci !",
    author: "Sophie M.",
    location: "Lyon",
  },
  {
    rating: 5,
    text: "Devis rapide, prix honnête. Je recommande.",
    author: "Thomas B.",
    location: "Paris",
  },
  {
    rating: 5,
    text: "Service clé en main parfait, zéro stress.",
    author: "Lucie D.",
    location: "Bordeaux",
  },
];

// ─── Professionnel Data ───────────────────────────────────────────

const proStats = [
  { icon: <Building2 />, value: 500, label: "Entreprises accompagnées", suffix: "+" },
  { icon: <Star />, value: 98, label: "De satisfaction client", suffix: "%" },
  { icon: <Clock />, value: 0, label: "D'interruption d'activité visée", suffix: "h" },
];

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

const proSectors = [
  "Banque",
  "Assurance",
  "Santé",
  "Retail",
  "Administration publique",
  "Industrie",
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

// ─── Step Card ────────────────────────────────────────────────────

function StepCard({
  number,
  title,
  description,
  icon,
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

// ─── Main Component ───────────────────────────────────────────────

export default function particulier() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ════════════════════════════════════════════════════════════
            SECTION 1 — DÉMÉNAGEMENT PARTICULIER
        ════════════════════════════════════════════════════════════ */}

        {/* Hero Particulier */}
        <section className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#CC922F] rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Home className="h-4 w-4 text-[#CC922F]" />
              <span className="text-sm font-medium text-white font-['Poppins',sans-serif]">
                Déménagement particulier
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Votre déménagement,{" "}
              <span className="text-[#CC922F]">serein et maîtrisé</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-6 sm:mb-8 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Studio, appartement ou maison — nous nous adaptons à votre
              situation
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-[#CC922F] hover:bg-[#b58228] text-white font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                  onClick={() =>
                    (window.location.href = "/tunnel/mes-coordonnees")
                  }
                >
                  Obtenir mon devis gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                  onClick={() =>
                    document
                      .getElementById("particulier-services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Découvrir nos services
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Ce que nous faisons pour vous */}
        <section
          id="particulier-services"
          className="bg-white py-12 sm:py-16 lg:py-20"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Package className="h-4 w-4" />}
              pill="Nos prestations"
              pillColor="gold"
              title="Ce que nous faisons pour vous"
              subtitle="Un accompagnement complet à chaque étape de votre déménagement"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {particulierServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] p-6 sm:p-8 rounded-2xl border border-[#1C3957] text-center group hover:from-[#2a4f6b] hover:to-[#1C3957] hover:shadow-xl shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#CC922F] flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-[#CC922F]/90 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-white font-['Poppins',sans-serif]">
                    {service.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed font-['Poppins',sans-serif] text-sm">
                    {service.description}
                  </p>
                  <motion.div className="w-10 h-0.5 bg-[#CC922F] mt-6 mx-auto group-hover:w-16 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Tarification – contenu réutilisé depuis la page Tarification */}
        <TarificationSection />

        {/* Comment ça se passe ? */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Calendar className="h-4 w-4" />}
              pill="Notre processus"
              pillColor="gold"
              title="Comment ça se passe ?"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 max-w-4xl mx-auto relative">
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#CC922F]/20 via-[#CC922F] to-[#CC922F]/20" />
              {particulierSteps.map((step, index) => (
                <StepCard key={index} index={index} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Particulier */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                icon={<FileText className="h-4 w-4" />}
                pill="FAQ"
                pillColor="navy"
                title="Questions fréquentes"
              />

              <Accordion
                type="single"
                collapsible
                className="w-full space-y-4"
              >
                {particulierFaqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`pfaq-${idx}`}
                    className="border-b-2 border-gray-200 bg-white rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold font-['Poppins',sans-serif] text-lg md:text-xl py-6 hover:text-[#CC922F] transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 font-['Poppins',sans-serif] text-base md:text-lg leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Quote className="h-4 w-4" />}
              pill="Témoignages"
              pillColor="gold"
              title="Ce que disent nos clients"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {testimonials.map((t, index) => (
                <motion.div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <Quote className="w-8 h-8 text-[#CC922F]/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#CC922F] fill-[#CC922F]"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 font-['Poppins',sans-serif] italic leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] flex items-center justify-center text-white font-bold text-sm font-['Poppins',sans-serif]">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C3957] font-['Poppins',sans-serif] text-sm">
                        {t.author}
                      </p>
                      <p className="text-gray-500 text-xs font-['Poppins',sans-serif]">
                        {t.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Particulier */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white rounded-full blur-2xl" />
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
                  <Zap className="w-8 h-8" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Poppins',sans-serif]">
                  Prêt à déménager ?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                  Obtenez votre devis gratuit en 2 minutes
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                      onClick={() =>
                        (window.location.href = "/tunnel/mes-coordonnees")
                      }
                    >
                      Demander mon devis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                      onClick={() => (window.location.href = "/contact")}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Nous appeler
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2 — DÉMÉNAGEMENT PROFESSIONNEL
        ════════════════════════════════════════════════════════════ */}

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center px-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#CC922F]/40 to-transparent" />
          </div>
        </div>

        {/* Hero Professionnel */}
        <section className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
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

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Transfert d'entreprise{" "}
              <span className="text-[#CC922F]">sans interruption</span>{" "}
              d'activité
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              PME, grands comptes, administrations — nous gérons la logistique
              complète
            </motion.p>

            {/* Inline Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {proStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[#CC922F] font-['Poppins',sans-serif]">
                    +{stat.value}
                    {stat.suffix}
                  </div>
                  <p className="text-white/80 text-sm mt-1 font-['Poppins',sans-serif]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Domaines d'intervention */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
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

        {/* Offres Entreprises */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Star className="h-4 w-4" />}
              pill="Offres entreprises"
              pillColor="navy"
              title="Nos offres entreprises"
              subtitle="Des formules pensées pour chaque taille d'organisation"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
              {proFormules.map((formule, index) => (
                <PricingCard key={index} index={index} {...formule} />
              ))}
            </div>
          </div>
        </section>

        {/* Notre méthode projet */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
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

        {/* Engagements */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
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
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <SectionHeader
              icon={<Users className="h-4 w-4" />}
              pill="Références"
              pillColor="gold"
              title="Ils nous ont fait confiance"
            />

            <motion.div
              className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {proSectors.map((sector, index) => (
                <motion.span
                  key={index}
                  className="px-5 py-2.5 bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white rounded-full text-sm font-medium font-['Poppins',sans-serif] shadow-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{
                    scale: 1.08,
                    transition: { duration: 0.2 },
                  }}
                >
                  {sector}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Professionnel */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                      onClick={() => (window.location.href = "/contact")}
                    >
                      Demander un devis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                      onClick={() => (window.location.href = "/solution")}
                    >
                      Découvrir notre solution
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
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
