import { Check, X } from "lucide-react";

const services = [
  {
    name: "Chargement - Transport - Livraison, Mise en place du Mobilier",
    economique: true,
    standard: true,
    luxe: true,
  },
  {
    name: "Protection du mobilier sous couvertures",
    economique: true,
    standard: true,
    luxe: true,
  },
  {
    name: "Protection de la literie sous housses",
    economique: true,
    standard: true,
    luxe: true,
  },
  {
    name: "Protection de la HI-FI et de l'électronique",
    economique: true,
    standard: true,
    luxe: true,
  },
  {
    name: "Emballage des vêtements sur cintres en penderies",
    economique: true,
    standard: true,
    luxe: true,
  },
  {
    name: "Débranchement et branchement de l'électroménager",
    economique: true,
    standard: true,
    luxe: true,
  },
  {
    name: "Protection des éléments fragiles",
    economique: true,
    standard: true,
    luxe: true,
  },
  {
    name: "Démontage et remontage du mobilier non fixé au mur",
    economique: false,
    standard: true,
    luxe: true,
  },
  {
    name: "Emballage et déballage des objets fragiles",
    economique: false,
    standard: false,
    luxe: true,
  },
  {
    name: "Emballage de la vaisselle fragile",
    economique: false,
    standard: false,
    luxe: true,
  },
  {
    name: "Décrochage mural (hors électricité et vissé)",
    economique: false,
    standard: false,
    luxe: true,
  },
  {
    name: "Emballage des objets non fragiles",
    economique: false,
    standard: false,
    luxe: true,
  },
  {
    name: "Emballage des vêtements non sur cintres",
    economique: false,
    standard: false,
    luxe: true,
  },
  {
    name: "Déballage des cartons",
    economique: false,
    standard: false,
    luxe: "option",
  },
];

const WhyUs = () => {
  return (
    <section id="why-us" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-['Poppins',sans-serif] font-semibold uppercase tracking-[0.2em] text-[#CC922F] mb-2 block">
            Nos Formules
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1C3957] font-bold mb-4 font-['Poppins',sans-serif]">
            Choisissez la formule adaptée à vos besoins
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-['Poppins',sans-serif]">
            Comparez nos différentes formules de déménagement et trouvez celle qui correspond le mieux à votre projet.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-[#1C3957]/5 via-[#CC922F]/10 to-[#1C3957]/5 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4 p-6">
                  <div className="font-bold text-[#1C3957] text-lg font-['Poppins',sans-serif]">Prestations</div>
                  <div className="text-center">
                    <div className="font-bold text-[#1C3957] text-lg mb-1 font-['Poppins',sans-serif]">Économique</div>
                    <div className="h-1 w-16 mx-auto bg-[#CC922F] rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#1C3957] text-lg mb-1 font-['Poppins',sans-serif]">Standard</div>
                    <div className="h-1 w-16 mx-auto bg-[#1C3957] rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#1C3957] text-lg mb-1 font-['Poppins',sans-serif]">Luxe</div>
                    <div className="h-1 w-16 mx-auto bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm text-gray-800 pr-4 flex items-center font-['Poppins',sans-serif]">
                      {service.name}
                    </div>
                    <div className="flex items-center justify-center">
                      {service.economique === true ? (
                        <Check className="w-5 h-5 text-[#CC922F]" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      {service.standard === true ? (
                        <Check className="w-5 h-5 text-[#1C3957]" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      {service.luxe === true ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : service.luxe === "option" ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded font-['Poppins',sans-serif]">
                          Option
                        </span>
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="text-3xl sm:text-4xl font-bold text-[#CC922F] mb-2 font-['Poppins',sans-serif]">5+</div>
            <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">Années d&apos;expérience</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="text-3xl sm:text-4xl font-bold text-[#CC922F] mb-2 font-['Poppins',sans-serif]">950+</div>
            <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">Déménagements réalisés par année</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
            <div className="text-3xl sm:text-4xl font-bold text-[#CC922F] mb-2 font-['Poppins',sans-serif]">98%</div>
            <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">Clients satisfaits</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
