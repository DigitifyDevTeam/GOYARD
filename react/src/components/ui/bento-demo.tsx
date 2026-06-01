import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: FileTextIcon,
    name: "Dossiers de déménagement",
    description: "Centralisez tous vos documents et devis au même endroit.",
    href: "/tunnel/mes-coordonnees",
    cta: "Préparer mon dossier",
    background: (
      <img
        className="absolute -right-20 -top-20 h-40 w-40 opacity-60 object-cover"
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80"
        alt="Dossiers et documents pour organiser un déménagement"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Estimation du volume",
    description: "Choisissez la méthode la plus simple pour estimer votre volume.",
    href: "/tunnel/choix-volume",
    cta: "Estimer mon volume",
    background: (
      <img
        className="absolute -right-20 -top-20 h-40 w-40 opacity-60 object-cover"
        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop&q=80"
        alt="Chambre meublée pour estimer le volume à déménager"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Zones desservies",
    description: "Un réseau solide en Île-de-France, en national et à l’international.",
    href: "/en-construction",
    cta: "Voir les zones",
    background: (
      <img
        className="absolute -right-20 -top-20 h-40 w-40 opacity-60 object-cover"
        src="https://images.unsplash.com/photo-1502920917128-1aa500764b68?w=400&auto=format&fit=crop&q=80"
        alt="Carte et zones de déménagement en France et à l'international"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Planification",
    description: "Choisissez la date idéale et suivez chaque étape de votre projet.",
    href: "/tunnel/devis",
    cta: "Planifier mon déménagement",
    background: (
      <img
        className="absolute -right-20 -top-20 h-32 w-32 opacity-60 object-cover"
        src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400&auto=format&fit=crop&q=80"
        alt="Agenda et planification des dates de déménagement"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications & suivi",
    description:
      "Recevez des rappels clés et des informations pratiques avant le jour J.",
    href: "/en-construction",
    cta: "Découvrir le suivi",
    background: (
      <img
        className="absolute -right-20 -top-20 h-40 w-40 object-cover opacity-60"
        src="https://images.unsplash.com/photo-1515165562835-c4c9e0737eaa?w=400&auto=format&fit=crop&q=80"
        alt="Notifications et suivi du projet de déménagement"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };

