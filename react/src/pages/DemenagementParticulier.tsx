import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  ArrowRight,
  Zap,
  Truck,
  Package,
  CheckCircle,
  FileText,
  Calendar,
  Phone,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TarificationSection from "@/components/TarificationSection";
import InteractiveImageBentoGallery from "@/components/bento-gallery";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/*
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
*/

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

/*
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
*/

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

// ─── Gallery Data (Particulier) ───────────────────────────────────

const particulierGalleryItems = [
  { id: 7, title: "Déménagement résidentiel", desc: "Équipe professionnelle et matériel adapté pour votre logement.", url: "/gallery/img1.jpeg", span: "md:col-span-2 md:row-span-2" },
  { id: 8, title: "Monte-meuble", desc: "Utilisation d'un monte-meuble pour accéder aux étages élevés en toute sécurité.", url: "/gallery/img2.jpeg", span: "md:row-span-1" },
  { id: 9, title: "Protection du mobilier", desc: "Protection intégrale de vos meubles pendant le transport.", url: "/gallery/img3.jpeg", span: "md:row-span-1" },
  { id: 11, title: "Nouveau chez vous", desc: "Installation et déballage jusqu'au dernier carton.", url: "/gallery/img5.jpeg", span: "md:row-span-1" },
  { id: 22, title: "Démontage du mobilier", desc: "Démontage et remontage complet de votre mobilier.", url: "/gallery/WhatsApp%20Image%202026-03-04%20at%2000.05.46.jpeg", span: "md:row-span-1" },
  { id: 36, title: "Déménagement résidentiel", desc: "Accompagnement des familles dans chaque étape du projet.", url: "/gallery/WhatsApp%20Image%202026-03-05%20at%2015.55.51.jpeg", span: "md:row-span-1" },
  { id: 16, title: "Emballage sur mesure", desc: "Solutions d'emballage adaptées aux objets fragiles.", url: "/gallery/WhatsApp%20Image%202026-03-j04%20at%2000.05.07.jpeg", span: "md:row-span-1" },
  { id: 10, title: "Camions et véhicules", desc: "Flotte moderne pour tous types de volumes.", url: "/gallery/img4.jpeg", span: "md:row-span-1" },
  { id: 28, title: "Accès difficile", desc: "Solutions adaptées pour les accès complexes.", url: "/gallery/WhatsApp%20Image%202026-03-04%20at%2000.05.45.jpeg", span: "md:row-span-1" },
  { id: 30, title: "Protection des sols", desc: "Mise en place de protections pour préserver vos sols.", url: "/gallery/WhatsApp%20Image%206862026-03-04%20at%2000.06.05.jpeg", span: "md:row-span-1" },
  { id: 34, title: "Préparation des cartons", desc: "Conditionnement des effets personnels avec soin.", url: "/gallery/WhatsApp%20Image%202026-0-04%20at%2000.07.05.jpeg", span: "md:row-span-1" },
  { id: 39, title: "Derniers réglages", desc: "Vérifications finales pour un déménagement réussi.", url: "/gallery/WhatsApp%20Image%202026-03-05%20at%2016.32.42.jpeg", span: "md:row-span-1" },
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

// ─── Step Card ────────────────────────────────────────────────────

function StepCard({
  number,
  title,
  description,
  icon: _icon,
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
        <div className="text-center">
          <h2 className="font-['Poppins',_sans-serif] font-[600] text-[51px] leading-[62px] text-black">
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

export default function particulier() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ════════════════════════════════════════════════════════════
            SECTION 1 — DÉMÉNAGEMENT PARTICULIER
        ════════════════════════════════════════════════════════════ */}

        {/* Hero Particulier */}
        <section className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
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
          className="bg-white py-8 sm:py-12 lg:py-16"
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
        <section className="bg-white py-8 sm:py-12 lg:py-16">
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

        {/* Galerie particulier */}
        <InteractiveImageBentoGallery
          imageItems={particulierGalleryItems}
          uniformTiles
          title="Guivarche déménagement en action"
          description="Découvrez nos déménagements résidentiels en images : emballage, monte-meuble, protection et installation chez vous."
        />

        {/* FAQ Particulier */}
        <section className="bg-gray-50 py-8 sm:py-12 lg:py-16">
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

        <GoogleReviewsSection />

         

        {/* CTA Particulier */}
        <section className="bg-gray-50 py-8 sm:py-12 lg:py-12">
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

       
      </main>

      <Footer />
    </div>
  );
}
