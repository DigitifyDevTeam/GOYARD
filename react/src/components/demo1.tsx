import { BentoCard, BentoGrid } from "@/components/bento-grid";
import { DEVIS_FORM_PATH } from "../constants/parisLp";

const features = [
  {
    name: "Déménagement particulier",
    description: "Accompagnement complet pour les déménagements d'appartements et de maisons, du studio à la grande villa.",
    href: DEVIS_FORM_PATH,
    cta: "Commencer",
    background: (
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/gallery/Déménagement longue distance.jpeg"
        alt="Déménagement particulier"
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    name: "Déménagement d’entreprise",
    description: "Transfert de bureaux, de postes de travail et d’archives avec une organisation millimétrée.",
    href: DEVIS_FORM_PATH,
    cta: "Commencer",
    background: (
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/gallery/Déménagement entreprise.jpeg"
        alt="Déménagement d’entreprise"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    name: "Déménagement longue distance",
    description: "Solutions optimisées pour vos déménagements partout en France et en Europe.",
    href: DEVIS_FORM_PATH,
    cta: "Commencer",
    background: (
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/gallery/Déménagement international.jpeg"
        alt="Déménagement longue distance"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    name: "Garde-meubles",
    description: "Stockage sécurisé de vos biens en box individuels, pour quelques jours ou plusieurs mois.",
    href: DEVIS_FORM_PATH,
    cta: "Commencer",
    background: (
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/gallery/monte_meuble.jpeg"
        alt="Garde-meubles"
      />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    name: "Déménagement groupé",
    description:
      "Réduisez vos coûts en partageant le même camion avec d’autres clients sur des trajets similaires.",
    href: DEVIS_FORM_PATH,
    cta: "Commencer",
    background: (
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/gallery/Déménagement groupé.jpeg"
        alt="Déménagement groupé"
      />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
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