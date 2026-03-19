import { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { 
  Building2, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Truck,
  Package,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  CheckCircle,
  FileText,
  Headphones,
  Laptop,
  Box,
  Warehouse
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

// FAQ data for business moving service
const businessFaqs = [
  {
    question: "Comment planifier un déménagement d'entreprise ?",
    answer: "Notre équipe vous accompagne dès la phase de planification. Nous analysons vos besoins spécifiques, le volume à déplacer, les contraintes de timing et établissons un plan de migration détaillé pour minimiser l'impact sur votre activité."
  },
  {
    question: "Quels types d'entreprises accompagnez-vous ?",
    answer: "Nous déménageons tous types d'entreprises : bureaux, commerces, industries, startups, PME et grandes entreprises. Chaque projet bénéficie d'une approche personnalisée adaptée à vos besoins spécifiques."
  },
  {
    question: "Proposez-vous des déménagements en dehors des heures de bureau ?",
    answer: "Oui, nous proposons des interventions 7j/7 et 24h/24, y compris les weekends et jours fériés. Cela permet de limiter la perturbation de votre activité et garantir une reprise rapide."
  },
  {
    question: "Comment protégez-vous le matériel informatique et sensible ?",
    answer: "Nous utilisons des emballages spécifiques pour le matériel informatique (caisses anti-statiques, housses protectrices). Nos équipes sont formées au transport de matériel sensible et nous proposons une assurance complète."
  },
  {
    question: "Gérez-vous le démontage et remontage des bureaux ?",
    answer: "Absolument. Nos équipes techniques prennent en charge le démontage complet de vos bureaux, mobiliers, rangements et installations, puis le remontage dans vos nouveaux locaux selon vos plans."
  },
  {
    question: "Proposez-vous une solution de stockage temporaire ?",
    answer: "Oui, nous disposons d'entrepôts sécurisés pour le stockage temporaire de vos biens pendant le déménagement, avec inventaire détaillé et accès contrôlé."
  }
];

// Services data
const services = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Déménagement de bureaux",
    description: "Déménagement complet de vos espaces de travail avec gestion de tous les mobiliers et équipements."
  },
  {
    icon: <Laptop className="w-8 h-8" />,
    title: "Transport matériel informatique",
    description: "Protection et transport sécurisé de vos serveurs, ordinateurs et équipements électroniques sensibles."
  },
  {
    icon: <Warehouse className="w-8 h-8" />,
    title: "Déménagement d'entrepôts",
    description: "Gestion de votre stock, rayonnages et équipements logistiques avec planification optimisée."
  },
  {
    icon: <Box className="w-8 h-8" />,
    title: "Emballage professionnel",
    description: "Fourniture de cartons professionnels et emballage de tous vos biens par nos équipes."
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Archives et documents",
    description: "Transport sécurisé de vos archives avec traçabilité et classement dans vos nouveaux locaux."
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "Chef de projet dédié",
    description: "Un interlocuteur unique pour coordonner l'ensemble de votre déménagement d'entreprise."
  }
];

// Main Component
export default function DemenagementEntreprise() {
  const statsRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      step: "Étape 1",
      title: "Audit et consultation",
      content: "Notre équipe réalise un audit complet de vos besoins : volume, équipements spécifiques, contraintes de timing et exigences particulières pour votre activité.",
      image: "/gallery/img4.jpeg"
    },
    {
      step: "Étape 2", 
      title: "Planification sur mesure",
      content: "Nous élaborons un plan de déménagement détaillé avec chronogramme, allocation des ressources et stratégie pour minimiser l'interruption de votre activité.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
    },
    {
      step: "Étape 3",
      title: "Devis transparent",
      content: "Recevez un devis détaillé et sans surprise couvrant tous les aspects de votre déménagement : transport, emballage, manutention et services annexes.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
    },
    {
      step: "Étape 4",
      title: "Exécution professionnelle",
      content: "Nos équipes qualifiées interviennent selon le plan établi, avec un chef de projet dédié qui supervise chaque étape et assure la coordination.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
    },
    {
      step: "Étape 5",
      title: "Installation et validation",
      content: "Remontage de vos bureaux, installation des équipements selon vos plans et validation finale avec votre chef de projet avant reprise d'activité.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop"
    }
  ];

  const advantages = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Intervention 24/7",
      description: "Nous nous adaptons à votre planning pour minimiser l'impact sur votre activité, y compris weekends et nuits."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Assurance complète",
      description: "Tous vos biens sont couverts par notre assurance professionnelle durant toute la durée du déménagement."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Flotte adaptée",
      description: "Véhicules de différentes capacités pour s'adapter à la taille de votre déménagement et vos contraintes d'accès."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Équipes spécialisées",
      description: "Déménageurs formés aux spécificités du déménagement d'entreprise et du matériel sensible."
    }
  ];

  const stats = [
    { icon: <Briefcase />, value: 850, label: "Entreprises déménagées", suffix: "+" },
    { icon: <Truck />, value: 2500, label: "Projets par an", suffix: "" },
    { icon: <Star />, value: 99, label: "Satisfaction clients", suffix: "%" },
    { icon: <MapPin />, value: 15, label: "Années d'expérience", suffix: "" },
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
              <Building2 className="h-4 w-4 text-[#CC922F]" />
              <span className="text-sm font-medium text-white">
                Solutions professionnelles
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Déménagement d'entreprise
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Solutions professionnelles pour le déménagement de vos bureaux, commerces et installations. 
              Minimisez l'impact sur votre activité avec notre expertise dédiée.
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
                  onClick={() => window.location.href = '/contact'}
                >
                  Demander un devis
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
                Solutions complètes pour entreprises
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Des services adaptés à tous types d'entreprises et de besoins professionnels
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
                Découvrez les avantages qui font de nous le partenaire idéal pour votre déménagement d'entreprise
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
                Guivarch en chiffres
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-['Poppins',sans-serif]">
                La confiance de centaines d'entreprises
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
                Prêt à déménager votre entreprise ?
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Rejoignez les entreprises qui ont fait confiance à BrasenPlus pour leur déménagement. 
                Obtenez votre devis personnalisé dès maintenant !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Demander un devis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                    onClick={() => window.location.href = '/solution'}
                  >
                    Découvrir notre solution
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
                {businessFaqs.map((faq, idx) => (
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
