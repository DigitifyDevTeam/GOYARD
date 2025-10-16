import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useSpring, useTransform } from "framer-motion";
import { 
  UserPlus, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Truck,
  Package,
  MapPin
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
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Content Area */}
      <div className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '550px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-0 h-full"
          >
            {/* Content Side */}
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
            
            {/* Image Side */}
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
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
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

// FAQ data for moving service
const movingFaqs = [
  {
    question: "Comment obtenir un devis de déménagement ?",
    answer: "Il vous suffit de renseigner vos informations (volume, adresses de départ et d'arrivée), et notre système calculera automatiquement un devis personnalisé en temps réel."
  },
  {
    question: "Puis-je modifier ma réservation ?",
    answer: "Oui, vous pouvez modifier les détails de votre déménagement directement depuis votre espace personnel jusqu'à 48h avant la date prévue."
  },
  {
    question: "Comment est calculé le volume de mon déménagement ?",
    answer: "Nous proposons trois méthodes : l'estimation par surface habitable, le calcul par liste d'objets, ou l'analyse IA à partir de photos de vos pièces."
  },
  {
    question: "Quelles sont les options supplémentaires disponibles ?",
    answer: "Nous proposons l'emballage, le démontage/remontage de meubles, la fourniture de cartons, le stockage temporaire et la protection des objets fragiles."
  },
  {
    question: "Le paiement est-il sécurisé ?",
    answer: "Oui, toutes nos transactions sont cryptées et sécurisées. Nous utilisons les standards bancaires les plus élevés pour protéger vos données."
  },
  {
    question: "Que faire en cas de problème ?",
    answer: "Notre service client est disponible pour vous accompagner. Vous pouvez nous contacter par téléphone, email ou via le formulaire de contact."
  }
];

// Main Component
export default function Solution() {
  const statsRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      step: "Étape 1",
      title: "Estimation du volume",
      content: "Évaluez votre volume de déménagement grâce à nos trois méthodes : surface habitable, liste d'objets, ou analyse IA par photos.",
      image: "/mesurer le volume.jpg"
    },
    {
      step: "Étape 2", 
      title: "Renseignement des adresses",
      content: "Indiquez vos adresses de départ et d'arrivée. Notre système calcule automatiquement la distance pour optimiser votre devis.",
      image: "/Renseignement des adresses.jpg"
    },
    {
      step: "Étape 3",
      title: "Sélection des options",
      content: "Choisissez parmi nos services complémentaires : emballage, démontage, cartons, stockage et protection des objets fragiles.",
      image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&h=600&fit=crop"
    },
    {
      step: "Étape 4",
      title: "Devis instantané",
      content: "Recevez immédiatement votre devis détaillé et transparent, sans surprise. Le prix affiché est le prix final.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
    },
    {
      step: "Étape 5",
      title: "Réservation sécurisée",
      content: "Validez votre réservation avec paiement sécurisé. Recevez votre confirmation et tous les détails par email.",
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
      title: "Paiement sécurisé",
      description: "Transactions protégées et conformes aux normes bancaires les plus strictes."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Professionnels qualifiés",
      description: "Des déménageurs expérimentés et équipés pour prendre soin de vos biens."
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Options flexibles",
      description: "Personnalisez votre déménagement avec nos services à la carte."
    }
  ];

  const stats = [
    { icon: <UserPlus />, value: 5000, label: "Clients satisfaits", suffix: "+" },
    { icon: <Truck />, value: 8000, label: "Déménagements réalisés", suffix: "+" },
    { icon: <Star />, value: 98, label: "Satisfaction client", suffix: "%" },
    { icon: <MapPin />, value: 50, label: "Villes desservies", suffix: "+" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Blue Bar */}
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="h-4 w-4 text-[#CC922F]" />
              <span className="text-sm font-medium text-white">
                Votre déménagement simplifié
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comment ça marche ?
            </motion.h1>

            <motion.p
              className="text-xl text-white/90 max-w-3xl mx-auto mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Goyard révolutionne le devis de déménagement en ligne. Estimez votre volume, obtenez votre devis 
              et réservez votre déménagement en quelques clics, avec la garantie d'une expérience simple et transparente.
            </motion.p>

            <motion.p
              className="text-lg text-white/80 max-w-2xl mx-auto font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Fini les estimations approximatives et les surprises de dernière minute. 
              Avec Goyard, tout est clair dès le départ.
            </motion.p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center text-[#1C3957] font-['Poppins',sans-serif]">
              Les étapes de votre déménagement
            </h2>
            
            <AutoCarousel features={features} />
          </div>
        </section>

        {/* Advantages Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1C3957] font-['Poppins',sans-serif]">
                Pourquoi choisir Goyard ?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Découvrez tous les avantages qui font de Goyard la solution idéale pour votre déménagement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] p-8 rounded-2xl border border-[#1C3957] text-center group hover:from-[#2a4f6b] hover:to-[#1C3957] hover:shadow-xl shadow-lg transition-all duration-300"
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
        <section className="bg-white py-20">
          <div ref={statsRef} className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1C3957] font-['Poppins',sans-serif]">
                Goyard en chiffres
              </h2>
              <p className="text-xl text-gray-600 font-['Poppins',sans-serif]">
                La confiance de milliers de clients
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-12 rounded-3xl text-center">
              <motion.div
                className="inline-flex items-center gap-2 mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-8 h-8" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-['Poppins',sans-serif]">
                Prêt à déménager en toute sérénité ?
              </h2>
              
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Rejoignez des milliers de clients qui ont déjà fait confiance à Goyard. 
                Obtenez votre devis gratuit maintenant !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                    onClick={() => window.location.href = '/tunnel/mes-coordonnees'}
                  >
                    Obtenir un devis gratuit
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
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#1C3957] font-['Poppins',sans-serif]">
                Questions fréquentes
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {movingFaqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-b-2 border-gray-200">
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

