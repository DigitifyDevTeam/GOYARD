import { ArrowRight } from "lucide-react";

const TEL_HREF = "tel:+33189703324";
const TEL_LABEL = "01 89 70 33 24";

export type LpHeroProps = Readonly<{
  badge: string;
  title: string;
  subtitle: string;
  onPrimary: () => void;
}>;

export default function LpHero({ badge, title, subtitle, onPrimary }: LpHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(204,146,47,0.18),transparent_60%),radial-gradient(900px_500px_at_85%_10%,rgba(25,25,25,0.08),transparent_55%)]" />
      <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700">
            {badge}
          </div>
          <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-[#191919] text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">{subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              type="button"
              onClick={onPrimary}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
            >
              Obtenir mon devis gratuit
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={TEL_HREF}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-['Poppins',sans-serif] font-semibold text-[#191919] hover:bg-slate-50 transition"
            >
              {TEL_LABEL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
