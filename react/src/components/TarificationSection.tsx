import { useNavigate } from "react-router-dom";
import { Box, Layers, Star, Check } from "lucide-react";

const tarificationPlans = [
  {
    id: "economique",
    icon: Box,
    title: "Économique",
    tagline: "L'essentiel, maîtrisé.",
    features: [
      "Chargement - Transport - Livraison, Mise en place du Mobilier",
      "Protection du mobilier sous couvertures",
      "Protection de la literie sous housses",
      "Protection de la HI-FI et de l'électronique",
      "Emballage des vêtements sur cintres en penderies",
      "Débranchement et branchement de l'électroménager",
      "Protection des éléments fragiles",
    ],
    highlighted: false,
  },
  {
    id: "standard",
    icon: Layers,
    title: "Standard",
    tagline: "Le choix de la sérénité.",
    features: [
      "Formule Économique +",
      "Démontage et remontage du mobilier non fixé au mur",
    ],
    highlighted: true,
  },
  {
    id: "luxe",
    icon: Star,
    title: "Luxe",
    tagline: "L'excellence absolue.",
    features: [
      "Formule Standard +",
      "Emballage et déballage des objets fragiles",
      "Emballage de la vaisselle fragile",
      "Décrochage mural (hors électricité et vissé)",
      "Emballage des objets non fragiles",
      "Emballage des vêtements non sur cintres",
      "Déballage des cartons",
    ],
    highlighted: false,
  },
];

export default function TarificationSection() {
  const navigate = useNavigate();

  const handleChoose = () => {
    navigate("/tunnel/mes-coordonnees");
  };

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-['Poppins',_sans-serif] font-[700] text-[#1c3957] text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Tarification
          </h2>
          <p className="font-['Poppins',_sans-serif] font-[500] text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Des solutions sur-mesure pour un déménagement réussi : choisissez la formule qui vous convient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {tarificationPlans.map((plan) => {
            const IconComp = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col bg-white rounded-2xl border transition-all duration-200 ${
                  plan.highlighted
                    ? "border-[#CC922F] shadow-[0px_8px_32px_rgba(204,146,47,0.15)]"
                    : "border-slate-200 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-[#CC922F] text-white font-['Poppins',_sans-serif] font-[600] text-xs uppercase tracking-wider px-4 py-1.5 rounded-full">
                      Le plus choisi
                    </span>
                  </div>
                )}

                <div className="flex flex-col flex-1 p-8 sm:p-10 pt-10 sm:pt-12">
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.highlighted ? "bg-[#CC922F]/15 text-[#CC922F]" : "bg-slate-100 text-[#1c3957]"
                    }`}>
                      <IconComp className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-['Poppins',_sans-serif] font-[600] text-[#161c2d] text-xl text-center mb-2">
                    {plan.title}
                  </h3>
                  <p className="font-['Poppins',_sans-serif] font-[500] text-slate-500 text-sm text-center mb-6">
                    {plan.tagline}
                  </p>

                  <ul className="space-y-4 flex-1 min-w-0">
                    {plan.features.map((feature) => (
                      <li key={`${plan.id}-${feature}`} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#CC922F]/20 flex items-center justify-center mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#CC922F]" strokeWidth={2.5} />
                        </span>
                        <span className="font-['Poppins',_sans-serif] font-[500] text-slate-700 text-base leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={handleChoose}
                    className={`mt-8 w-full py-3 rounded-xl font-['Poppins',_sans-serif] font-[600] text-sm uppercase tracking-wide transition-colors ${
                      plan.highlighted
                        ? "bg-[#CC922F] text-white hover:bg-[#b88028]"
                        : "bg-[#1c3957] text-white hover:bg-[#2a4f6b]"
                    }`}
                  >
                    Choisir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
