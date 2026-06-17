import { cn } from "../../lib/utils";

const STEPS = [
  {
    number: 1,
    text: "Sélectionnez les meubles et objets à déménager dans chaque pièce de votre logement",
  },
  {
    number: 2,
    text: "Le nombre d'objet s'affiche en temps réel à droite de l'écran pour un inventaire clair et précis.",
  },
  {
    number: 3,
    text: "Cliquez sur Voir mon prix pour transmettre vos infos et obtenir un devis personnalisé et sans engagement.",
  },
] as const;

export function ParisVolumeCalcHowItWorks({ className }: Readonly<{ className?: string }>) {
  return (
    <section className={cn("w-full", className)} aria-labelledby="paris-volume-how-title">
      <h2
        id="paris-volume-how-title"
        className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-extrabold text-[#1C3957] mb-5 sm:mb-6"
      >
        Comment ça marche ?
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center rounded-xl border-2 border-[#CC922F] bg-white px-4 py-6 text-center"
          >
            <span
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#CC922F] font-['Poppins',sans-serif] text-2xl font-extrabold text-white"
              aria-hidden
            >
              {step.number}
            </span>
            <p className="font-['Poppins',sans-serif] text-sm sm:text-[15px] font-medium leading-snug text-[#1C3957]">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
