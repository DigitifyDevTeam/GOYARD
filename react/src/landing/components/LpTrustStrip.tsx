import { CheckCircle2 } from "lucide-react";

const DEFAULT_ITEMS = [
  "Équipe expérimentée et ponctuelle",
  "Devis clair et sans engagement",
  "Assurance et protection du mobilier",
  "Accompagnement du premier appel à la livraison",
];

type LpTrustStripProps = Readonly<{
  items?: string[];
}>;

export default function LpTrustStrip({ items = DEFAULT_ITEMS }: LpTrustStripProps) {
  return (
    <section className="border-y border-slate-100 bg-slate-50/60">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-10 sm:py-12">
        <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-center text-lg mb-6">
          Pourquoi nous faire confiance
        </p>
        <ul className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#CC922F] shrink-0 mt-0.5" />
              <span className="text-sm sm:text-[15px] text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
