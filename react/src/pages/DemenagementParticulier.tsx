import { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { 
  Home, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Truck,
  Package,
  Heart,
  Users,
  Sofa,
  Car,
  Archive,
  CheckCircle,
  FileText,
  Calendar,
  Camera,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// Feature interface
interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string | React.ReactNode;
}

// Stat Counter Component
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

  const displayValue = useTransform(springValue, (latest: number) => Math.floor(latest));

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
      <motion.div ref={countRef} className="text-3xl font-bold text-white flex items-center font-['Poppins',sans-serif]">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-white/90 text-sm mt-1 font-['Poppins',sans-serif]">{label}</p>
      <motion.div className="w-10 h-0.5 bg-[#CC922F] mt-3 group-hover:w-16 transition-all duration-300" />
    </motion.div>
  );
}

// Auto Carousel Component for Steps
interface AutoCarouselProps {
  features: Feature[];
}

function AutoCarousel({ features }: AutoCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '400px' }}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-0 h-full"
        >
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#CC922F] text-white font-bold text-2xl mb-8 self-start">
              {currentStep + 1}
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-['Poppins',sans-serif]">
              {features[currentStep].title}
            </h3>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-['Poppins',sans-serif]">
              {features[currentStep].content}
            </p>
          </div>
          
          <div className="relative overflow-hidden min-h-[300px] md:min-h-[550px] md:h-[550px]">
            {typeof features[currentStep].image === 'string' ? (
              <img
                src={features[currentStep].image}
                alt={features[currentStep].title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1C3957]/50">
                {features[currentStep].image}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentStep
                ? 'w-12 h-3 bg-[#CC922F]'
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// FAQ data for individual moving service
const individualFaqs = [
  {
    question: "Comment estimer le volume de mon déménagement ?",
    answer: "Nous proposons trois méthodes : estimation par surface habitable, calcul par liste d'objets détaillée, ou analyse IA à partir de photos de vos pièces. Notre outil en ligne vous donne une estimation précise en quelques minutes."
  },
  {
    question: "Quels sont les délais pour réserver un déménagement ?",
    answer: "Nous recommandons de réserver 2 à 4 semaines à l'avance, surtout en période estivale (juin-septembre). Cependant, nous pouvons parfois accommoder des demandes de dernière minute selon nos disponibilités."
  },
  {
    question: "Proposez-vous des services d'emballage ?",
    answer: "Oui, nous proposons un service d'emballage complet ou partiel. Nos équipes peuvent emballer l'intégralité de vos biens ou uniquement les objets fragiles selon vos préférences. Les cartons professionnels sont fournis."
  },
  {
    question: "Comment sont calculés les tarifs ?",
    answer: "Le prix dépend de plusieurs facteurs : volume à déménager, distance entre les adresses, étages (avec ou sans ascenseur), services additionnels choisis (emballage, démontage, etc.), et la date souhaitée."
  },
  {
    question: "Mes biens sont-ils assurés pendant le transport ?",
    answer: "Oui, tous vos biens sont couverts par notre assurance professionnelle pendant le transport. Pour les objets de valeur, nous proposons des options d'assurance renforcée sur demande."
  },
  {
    question: "Gérez-vous le démontage et remontage des meubles ?",
    answer: "Absolument. Nos déménageurs sont formés au démontage et remontage de tous types de meubles. Cela inclut les lits, armoires, étagères et tout autre mobilier nécessitant une dépose."
  }
];

// Services data
const services = [
  {
    icon: <Home className="w-8 h-8" />,
    title: "Déménagement complet",
    description: "Service clé en main incluant emballage, transport et déballage dans votre nouveau logement."
  },
  {
    icon: <Box className="w-8 h-8" />,
    title: "Emballage professionnel",
    description: "Fourniture de cartons et emballage de vos biens par nos équipes expertes."
  },
  {
    icon: <Sofa className="w-8 h-8" />,
    title: "Démontage / Remontage",
    description: "Prise en charge complète de vos meubles : démontage, transport et remontage."
  },
  {
    icon: <Archive className="w-8 h-8" />,
    title: "Garde-meuble",
    description: "Solution de stockage sécurisée pour vos biens en attendant votre nouvel emménagement."
  },
  {
    icon: <Car className="w-8 h-8" />,
    title: "Transport véhicule",
    description: "Service de transfert de votre véhicule vers votre nouvelle destination."
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Estimation IA",
    description: "Estimez votre volume en prenant simplement des photos de vos pièces avec notre IA."
  }
];

// Main Component
export default function DemenagementParticulier() {
  const statsRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      step: "Étape 1",
      title: "Estimation gratuite",
      content: "Estimez votre volume en ligne en quelques minutes. Choisissez entre notre calculateur par surface, liste d'objets ou estimation IA par photos.",
      image: "/mesurer le volume.png"
    },
    {
      step: "Étape 2", 
      title: "Devis personnalisé",
      content: "Renseignez vos adresses de départ et d'arrivée, sélectionnez vos options (emballage, démontage, etc.) et recevez votre devis détaillé instantanément.",
      image: "/Renseignement des adresses.png"
    },
    {
      step: "Étape 3",
      title: "Validation et planning",
      content: "Validez votre devis en ligne et choisissez la date de votre déménagement. Notre équipe confirme votre réservation sous 24h.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
    },
    {
      step: "Étape 4",
      title: "Préparation",
      content: "Si vous avez opté pour l'emballage, notre équipe arrive avec tout le matériel nécessaire. Sinon, nous vous guidons pour votre auto-emballage.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
    },
    {
      step: "Étape 5",
      title: "Déménagement et installation",
      content: "Nos déménageurs professionnels transportent vos biens avec soin et les installent dans votre nouveau logement selon vos indications.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop"
    }
  ];

  const advantages = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Devis instantané",
      description: "Obtenez votre estimation en quelques minutes sans attendre de rappel téléphonique."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Assurance incluse",
      description: "Tous vos biens sont couverts par notre assurance professionnelle pendant le transport."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Véhicules adaptés",
      description: "Flotte de camions de différentes tailles pour s'adapter à chaque volume de déménagement."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Service attentionné",
      description: "Nos équipes traitent vos biens avec le plus grand soin comme s'il s'agissait des leurs."
    }
  ];

  const stats = [
    { icon: <Home />, value: 15000, label: "Déménagements réalisés", suffix: "+" },
    { icon: <Users />, value: 98, label: "Clients satisfaits", suffix: "%" },
    { icon: <Star />, value: 4, label: "Note moyenne", suffix: "/5" },
    { icon: <Truck />, value: 50, label: "Véhicules disponibles", suffix: "" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Blue Bar */}
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Home className="h-4 w-4 text-[#CC922F]" />
              <span className="text-sm font-medium text-white">
                Pour particuliers
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Déménagement particulier
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Votre déménagement en toute sérénité. De l'estimation à l'installation, 
              nous nous occupons de tout pour vous permettre de vous installer sereinement dans votre nouveau chez-vous.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-[#CC922F] hover:bg-[#b58228] text-white font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                  onClick={() => window.location.href = '/tunnel/mes-coordonnees'}
                >
                  Obtenir mon devis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Découvrir nos services
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CC922F]/10 mb-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Package className="h-4 w-4 text-[#CC922F]" />
                <span className="text-sm font-semibold text-[#CC922F]">Nos services</span>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#1C3957] font-['Poppins',sans-serif]">
                Solutions pour particuliers
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Des services adaptés à tous les types de déménagements, du studio à la grande maison
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
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
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-['Poppins',sans-serif]">
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

        {/* Steps Section */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C3957]/10 mb-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Calendar className="h-4 w-4 text-[#1C3957]" />
                <span className="text-sm font-semibold text-[#1C3957]">Notre processus</span>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 text-center text-[#1C3957] font-['Poppins',sans-serif]">
                Les étapes de votre déménagement
              </h2>
            </div>
            
            <AutoCarousel features={features} />
          </div>
        </section>

        {/* Advantages Section */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CC922F]/10 mb-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="h-4 w-4 text-[#CC922F]" />
                <span className="text-sm font-semibold text-[#CC922F]">Nos atouts</span>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#1C3957] font-['Poppins',sans-serif]">
                Pourquoi nous choisir ?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Découvrez les avantages qui font de nous le partenaire idéal pour votre déménagement
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {advantages.map((advantage, index) => (
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
                    {advantage.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 text-white font-['Poppins',sans-serif]">
                    {advantage.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed font-['Poppins',sans-serif]">
                    {advantage.description}
                  </p>
                  <motion.div className="w-10 h-0.5 bg-[#CC922F] mt-6 mx-auto group-hover:w-16 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div ref={statsRef} className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C3957]/10 mb-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="h-4 w-4 text-[#1C3957]" />
                <span className="text-sm font-semibold text-[#1C3957]">Nos chiffres</span>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#1C3957] font-['Poppins',sans-serif]">
                BrasenPlus en chiffres
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-['Poppins',sans-serif]">
                La confiance de milliers de particuliers
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <StatCounter
                  key={index}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center">
              <motion.div
                className="inline-flex items-center gap-2 mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-8 h-8" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-['Poppins',sans-serif]">
                Prêt à déménager sereinement ?
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Rejoignez les milliers de familles qui ont fait confiance à BrasenPlus. 
                Obtenez votre devis gratuit en quelques minutes !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                    onClick={() => window.location.href = '/tunnel/mes-coordonnees'}
                  >
                    Obtenir mon devis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Nous contacter
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C3957]/10 mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText className="h-4 w-4 text-[#1C3957]" />
                  <span className="text-sm font-semibold text-[#1C3957]">FAQ</span>
                </motion.div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-[#1C3957] font-['Poppins',sans-serif]">
                  Questions fréquentes
                </h2>
              </div>
              
              <Accordion type="single" collapsible className="w-full space-y-4">
                {individualFaqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-b-2 border-gray-200 bg-white rounded-lg px-6">
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
      </main>

      <Footer />
    </div>
  );
}
