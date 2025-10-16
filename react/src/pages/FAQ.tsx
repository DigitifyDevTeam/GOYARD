import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ImageStack from "../components/polaroid-flick-through";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

const faqData: Record<string, FAQCategory> = {
  "services": {
    name: "Services de déménagement",
    items: [
      {
        question: "Quels types de déménagements proposez-vous ?",
        answer: "Nous proposons tous types de déménagements : résidentiels (appartements, maisons), professionnels (bureaux, commerces), nationaux et internationaux. Nous nous adaptons à vos besoins spécifiques, que ce soit un studio ou une grande maison."
      },
      {
        question: "Proposez-vous un service de garde-meubles ?",
        answer: "Oui, nous disposons d'espaces de stockage sécurisés pour entreposer vos biens temporairement ou sur le long terme. Nos garde-meubles sont surveillés 24h/24 et climatisés pour préserver vos meubles et objets précieux."
      },
      {
        question: "Pouvez-vous déménager des objets fragiles ou volumineux ?",
        answer: "Absolument ! Notre équipe est formée pour manipuler tous types d'objets : pianos, œuvres d'art, antiquités, équipements électroniques, objets fragiles. Nous utilisons du matériel spécialisé et des techniques adaptées pour garantir leur sécurité."
      },
      {
        question: "Effectuez-vous des déménagements le week-end ?",
        answer: "Oui, nous proposons nos services 7 jours sur 7, y compris les week-ends et jours fériés. Nous comprenons que vous avez besoin de flexibilité et nous nous adaptons à votre emploi du temps."
      }
    ]
  },
  "tarifs": {
    name: "Tarifs et Devis",
    items: [
      {
        question: "Comment est calculé le prix d'un déménagement ?",
        answer: "Le tarif dépend de plusieurs facteurs : le volume à déménager, la distance entre les deux logements, l'étage, la présence d'un ascenseur, les services supplémentaires demandés (emballage, démontage/remontage). Nous vous proposons un devis personnalisé et transparent."
      },
      {
        question: "Le devis est-il gratuit et sans engagement ?",
        answer: "Oui, tous nos devis sont entièrement gratuits et sans aucun engagement de votre part. Vous pouvez demander plusieurs devis pour comparer nos offres. Nous nous déplaçons à votre domicile pour une estimation précise si nécessaire."
      },
      {
        question: "Quels sont les modes de paiement acceptés ?",
        answer: "Nous acceptons les paiements par virement bancaire, chèque, carte bancaire et espèces. Un acompte peut être demandé à la réservation, le solde étant réglé à la fin de la prestation. Nous vous fournissons une facture détaillée."
      },
      {
        question: "Y a-t-il des frais cachés ?",
        answer: "Non, nous garantissons une transparence totale. Tous les coûts sont détaillés dans votre devis : main-d'œuvre, transport, fournitures, services additionnels. Le prix final correspond exactement au devis, sauf modification de votre demande."
      }
    ]
  },
  "preparation": {
    name: "Préparation du déménagement",
    items: [
      {
        question: "Dois-je emballer mes affaires moi-même ?",
        answer: "C'est vous qui décidez ! Nous proposons un service d'emballage complet avec fourniture de cartons, papier bulle et matériel de protection. Si vous préférez le faire vous-même, nous pouvons vous fournir les cartons et vous donner des conseils."
      },
      {
        question: "Combien de temps avant le déménagement dois-je vous contacter ?",
        answer: "Nous recommandons de nous contacter 2 à 4 semaines avant votre date souhaitée pour les déménagements standards. Pour les périodes de forte demande (fin de mois, été), prévoyez 6 à 8 semaines. En urgence, nous pouvons intervenir sous 48h selon nos disponibilités."
      },
      {
        question: "Fournissez-vous les cartons et le matériel d'emballage ?",
        answer: "Oui, nous fournissons tous les matériaux nécessaires : cartons de différentes tailles, papier bulle, film étirable, housse de protection pour meubles et matelas, couvertures. Tout est inclus dans nos forfaits ou disponible à la vente."
      },
      {
        question: "Comment préparer mes meubles pour le déménagement ?",
        answer: "Notre équipe s'occupe du démontage et du remontage de vos meubles si nécessaire. Nous vous conseillons de vider armoires et commodes, et de mettre à part les objets précieux que vous souhaitez transporter vous-même."
      }
    ]
  },
  "assurance": {
    name: "Assurance et Protection",
    items: [
      {
        question: "Mes biens sont-ils assurés pendant le déménagement ?",
        answer: "Oui, nous disposons d'une assurance responsabilité civile professionnelle qui couvre vos biens pendant le transport. Nous proposons également une assurance complémentaire « tous risques » pour une protection maximale de vos objets de valeur."
      },
      {
        question: "Que se passe-t-il en cas de dommage ?",
        answer: "En cas de dommage, nous établissons un constat immédiatement et prenons en charge la déclaration auprès de notre assurance. Vous serez indemnisé selon les conditions du contrat et la nature du préjudice. Notre objectif est de résoudre tout problème rapidement."
      },
      {
        question: "Comment protégez-vous mes objets fragiles ?",
        answer: "Nous utilisons du matériel de protection professionnel : papier bulle, mousse, cartons renforcés, caisses en bois pour les objets très fragiles. Nos équipes sont formées aux techniques d'emballage et de manutention spécifiques pour les objets délicats."
      }
    ]
  },
  "options": {
    name: "Options supplémentaires",
    items: [
      {
        question: "Proposez-vous un service de nettoyage ?",
        answer: "Oui, nous proposons un service de nettoyage complet de votre ancien logement après le déménagement. Cela vous permet de restituer les lieux en parfait état et de récupérer votre caution sans souci."
      },
      {
        question: "Pouvez-vous démonter et remonter mes meubles ?",
        answer: "Absolument ! Le démontage et remontage des meubles fait partie de nos services. Nos déménageurs sont équipés des outils nécessaires et veilleront à remonter vos meubles exactement comme ils étaient, dans votre nouveau logement."
      },
      {
        question: "Aidez-vous à l'installation dans le nouveau logement ?",
        answer: "Oui, nous ne nous contentons pas de déposer les cartons. Nous plaçons vos meubles selon vos instructions, installons les gros équipements et veillons à ce que tout soit à sa place avant de partir."
      }
    ]
  },
  "zone": {
    name: "Zone d'intervention",
    items: [
      {
        question: "Dans quelles régions intervenez-vous ?",
        answer: "Nous intervenons principalement en Île-de-France et dans toute la France métropolitaine. Pour les déménagements internationaux, nous avons des partenaires de confiance dans toute l'Europe et au-delà."
      },
      {
        question: "Faites-vous des déménagements internationaux ?",
        answer: "Oui, nous organisons des déménagements vers tous les pays. Nous nous occupons de toutes les formalités administratives, douanières et logistiques. Notre réseau international nous permet d'assurer un service de qualité partout dans le monde."
      }
    ]
  },
  "pratique": {
    name: "Questions pratiques",
    items: [
      {
        question: "Combien de déménageurs seront présents ?",
        answer: "Le nombre de déménageurs dépend du volume à déménager et de la complexité de l'intervention. Généralement, nous envoyons une équipe de 2 à 4 personnes pour un déménagement résidentiel standard. Tout est précisé dans votre devis."
      },
      {
        question: "Que dois-je faire le jour du déménagement ?",
        answer: "Soyez présent pour accueillir l'équipe et donner vos instructions. Nous vous recommandons de préparer un sac avec vos affaires essentielles pour la première nuit. Notre équipe s'occupe du reste ! Vous pouvez superviser et poser des questions à tout moment."
      },
      {
        question: "Puis-je annuler ou reporter mon déménagement ?",
        answer: "Oui, vous pouvez annuler ou reporter votre déménagement. Nous vous demandons de nous prévenir le plus tôt possible. Les conditions d'annulation sont précisées dans votre contrat. Plus vous nous prévenez tôt, moins il y a de frais."
      }
    ]
  },
  "delais": {
    name: "Délais et Planning",
    items: [
      {
        question: "Quelle est la durée moyenne d'un déménagement ?",
        answer: "La durée dépend du volume et de la distance. Un studio se déménage en 2-4h, un T3 en 4-6h, une maison en 6-10h. Notre devis précise le temps estimé pour votre déménagement spécifique."
      },
      {
        question: "Peut-on déménager un jour férié ?",
        answer: "Oui, Goyard propose ses services 365 jours par an, y compris les jours fériés. Un supplément peut s'appliquer pour les jours fériés, cela sera clairement indiqué dans votre devis."
      },
      {
        question: "Quel est le meilleur moment pour déménager ?",
        answer: "Les périodes les moins chargées sont de septembre à mai (hors vacances). Évitez les fins de mois et l'été si possible. Réserver en semaine plutôt que le week-end permet souvent d'obtenir de meilleurs tarifs."
      }
    ]
  },
  "materiel": {
    name: "Matériel et Équipement",
    items: [
      {
        question: "Quel type de camion utilisez-vous ?",
        answer: "Nous disposons d'une flotte variée : utilitaires 20m³ pour studios, camions 40m³ pour appartements, semi-remorques 90m³ pour maisons. Tous nos véhicules sont équipés de sangles, couvertures et matériel de protection."
      },
      {
        question: "Les déménageurs ont-ils le matériel nécessaire ?",
        answer: "Oui, nos équipes arrivent avec tout le matériel professionnel : diables, transpalettes, sangles, couvertures de protection, outils pour démontage. Vous n'avez rien à fournir."
      },
      {
        question: "Que se passe-t-il si le camion ne peut pas accéder à mon logement ?",
        answer: "Nous effectuons une étude préalable des accès. Si nécessaire, nous utilisons une navette (petit véhicule), un monte-meubles ou organisons un portage manuel. Ces solutions sont évaluées et chiffrées lors de l'établissement du devis."
      }
    ]
  },
  "stockage": {
    name: "Stockage et Garde-meubles",
    items: [
      {
        question: "Combien de temps puis-je stocker mes affaires ?",
        answer: "Nos solutions de stockage sont flexibles : de quelques jours à plusieurs années. Vous pouvez commencer par une courte durée et prolonger selon vos besoins. Tarifs dégressifs pour les longues durées."
      },
      {
        question: "Comment sont stockés mes biens ?",
        answer: "Vos biens sont stockés dans des box individuels sécurisés, dans un entrepôt surveillé 24h/24, climatisé et protégé contre l'humidité. Chaque box est fermé et seul vous avez accès à vos affaires."
      },
      {
        question: "Puis-je accéder à mes affaires en stockage ?",
        answer: "Oui, vous pouvez accéder à votre garde-meubles sur rendez-vous pendant les heures d'ouverture. Prévenez-nous 24h à l'avance pour que nous organisions votre visite en toute sécurité."
      }
    ]
  },
  "objets-speciaux": {
    name: "Objets spéciaux",
    items: [
      {
        question: "Pouvez-vous déménager un piano ?",
        answer: "Oui, nous sommes équipés et formés pour le transport de pianos droits et à queue. Nous utilisons des sangles spéciales, housses de protection et techniques de portage adaptées. Un supplément s'applique selon le type de piano."
      },
      {
        question: "Comment transportez-vous les œuvres d'art ?",
        answer: "Les œuvres d'art nécessitent un soin particulier : emballage sur mesure, caisses en bois pour les pièces fragiles, transport vertical pour les tableaux, assurance renforcée. Nous pouvons faire appel à des spécialistes pour les œuvres de grande valeur."
      },
      {
        question: "Puis-je déménager mes plantes ?",
        answer: "Oui pour les déménagements locaux. Pour les longues distances ou l'international, les plantes peuvent ne pas survivre ou être interdites. Nous vous conseillons sur les meilleures options pour vos plantes."
      },
      {
        question: "Transportez-vous les animaux de compagnie ?",
        answer: "Pour des raisons de sécurité et de bien-être animal, nous ne transportons pas les animaux. Nous vous recommandons des services spécialisés ou de les transporter vous-même dans votre véhicule."
      }
    ]
  },
  "technologie": {
    name: "Technologie Goyard",
    items: [
      {
        question: "Comment fonctionne l'estimation de volume par IA ?",
        answer: "Notre technologie d'intelligence artificielle analyse les photos de vos pièces pour identifier et quantifier automatiquement vos meubles et objets. Elle calcule ensuite le volume total en m³ pour un devis précis et instantané."
      },
      {
        question: "Mes données et photos sont-elles sécurisées ?",
        answer: "Absolument ! Toutes vos données sont cryptées et stockées de manière sécurisée. Nous respectons le RGPD et ne partageons jamais vos informations personnelles. Vos photos sont supprimées après l'établissement du devis si vous le souhaitez."
      },
      {
        question: "Puis-je suivre mon déménagement en temps réel ?",
        answer: "Oui, via votre espace client, vous pouvez suivre l'avancement de votre déménagement : confirmation de réservation, heure d'arrivée estimée de l'équipe, progression du chargement/déchargement. Vous êtes informé à chaque étape clé."
      }
    ]
  },
  "goyard": {
    name: "À propos de Goyard",
    items: [
      {
        question: "Qu'est-ce qui distingue Goyard des autres déménageurs ?",
        answer: "Goyard révolutionne le déménagement avec sa plateforme 100% digitale : devis instantané en ligne, estimation par IA, réservation sécurisée, suivi en temps réel. Nous combinons technologie moderne et expertise traditionnelle du déménagement."
      },
      {
        question: "Êtes-vous certifiés et assurés ?",
        answer: "Oui, Goyard possède toutes les certifications professionnelles requises et dispose d'une assurance responsabilité civile professionnelle complète. Nous sommes également membres des associations professionnelles du déménagement."
      },
      {
        question: "Que faire si je ne suis pas satisfait du service ?",
        answer: "Votre satisfaction est notre priorité. Si un problème survient, contactez-nous immédiatement via notre chat en ligne, email ou téléphone. Notre équipe service client traitera votre réclamation rapidement pour trouver une solution adaptée."
      },
      {
        question: "Proposez-vous des garanties ?",
        answer: "Oui, nous garantissons nos services : respect des délais, intégrité de vos biens, professionnalisme de nos équipes. Toutes nos prestations sont couvertes par notre assurance professionnelle. Satisfait ou remboursé dans les conditions contractuelles."
      }
    ]
  }
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("services");
  const [expandedItem, setExpandedItem] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setExpandedItem(prev => prev === index ? null : index);
  };

  const categories = [
    { id: "services", label: "Services de déménagement" },
    { id: "tarifs", label: "Tarifs et Devis" },
    { id: "preparation", label: "Préparation" },
    { id: "assurance", label: "Assurance" },
    { id: "options", label: "Options supplémentaires" },
    { id: "zone", label: "Zone d'intervention" },
    { id: "pratique", label: "Questions pratiques" },
    { id: "delais", label: "Délais et Planning" },
    { id: "materiel", label: "Matériel et Équipement" },
    { id: "stockage", label: "Stockage" },
    { id: "objets-speciaux", label: "Objets spéciaux" },
    { id: "technologie", label: "Technologie Goyard" },
    { id: "goyard", label: "À propos de Goyard" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 font-['Poppins',sans-serif]">
              Questions fréquemment posées
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
              Trouvez rapidement des réponses à vos questions sur nos services de déménagement.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 px-8 bg-white">
          <div className="max-w-full px-8">
            {/* Small Title */}
            <h2 className="text-2xl font-semibold text-[#0C1E3A] mb-6 font-['Poppins',sans-serif]">
              Choisissez une catégorie
            </h2>
            
            {/* Category Navigation */}
            <div className="mb-24 flex gap-3 justify-start flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setExpandedItem(0);
                  }}
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                  className={`
                    px-5 py-2.5 rounded-full text-[17px] transition-all duration-300
                    whitespace-nowrap
                    ${activeCategory === category.id 
                      ? 'bg-[#1c3957] text-white shadow-sm' 
                      : 'bg-transparent text-[#6B6B8C] hover:bg-gray-50'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ Content with Images */}
            <div className="flex gap-8">
              {/* Left side - FAQ Items */}
              <div className="w-2/3">
                <div className="space-y-4">
              {faqData[activeCategory].items.map((item, index) => (
                <div 
                  key={index}
                  className="overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full py-5 flex items-start text-left hover:opacity-80 transition-opacity duration-200 relative"
                  >
                    <div className="flex items-start gap-6 pr-32">
                      <div className={`
                        flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mt-1
                        ${expandedItem === index 
                          ? 'bg-[#1c3957]' 
                          : 'bg-[#CC922F]'
                        }
                      `}>
                        {expandedItem === index ? (
                          <Minus 
                            className="w-6 h-6 text-white"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Plus 
                            className="w-6 h-6 text-white"
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                      <span className="text-[22px] font-semibold text-[#0C1E3A] leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {item.question}
                      </span>
                    </div>
                    <div className="absolute top-5 right-48">
                      {expandedItem === index ? (
                        <ArrowDownLeft 
                          className="w-20 h-20 flex-shrink-0 transition-all duration-300 text-[#1c3957]"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <ArrowUpRight 
                          className="w-20 h-20 flex-shrink-0 transition-all duration-300 text-[#CC922F]"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </button>
                  
                  <div 
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${expandedItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="pb-6 pt-3 pr-48">
                      <p className="text-[#6B6B8C] leading-relaxed text-[20px] font-['Inter',sans-serif]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </div>
              
              {/* Right side - Image Stack */}
              <div className="w-1/3 flex-shrink-0 flex justify-end">
                <ImageStack 
                  images={[
                    {
                      id: "1",
                      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
                      alt: "Déménagement professionnel",
                    },
                    {
                      id: "2", 
                      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop",
                      alt: "Équipe de déménageurs",
                    },
                    {
                      id: "3",
                      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=800&fit=crop", 
                      alt: "Camion de déménagement",
                    },
                    {
                      id: "4",
                      src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=800&fit=crop",
                      alt: "Emballage sécurisé",
                    },
                    {
                      id: "5",
                      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=800&fit=crop",
                      alt: "Livraison à domicile",
                    },
                  ]}
                  className="h-[600px]"
                />
              </div>
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
      </main>
      
      <Footer />
    </div>
  );
}

