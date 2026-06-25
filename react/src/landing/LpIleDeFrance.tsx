import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, ShieldCheck, Timer, Truck } from "lucide-react";
import LandingShell from "./components/LandingShell";
import LpHero from "./components/LpHero";
import LpTrustStrip from "./components/LpTrustStrip";
import { useLandingMeta } from "./useLandingMeta";
import { PAGE_META } from "../seo/pageMeta";
import { DEVIS_FORM_PATH } from "../constants/parisLp";

export default function LpIleDeFrance() {
  const navigate = useNavigate();
  const primaryCta = () => navigate(DEVIS_FORM_PATH);

  useLandingMeta(PAGE_META.lpIleDeFrance);

  return (
    <LandingShell onGetQuote={primaryCta}>
      <LpHero
        badge="Île-de-France • Local & régional"
        title="Déménagement en Île-de-France : réactivité et savoir-faire"
        subtitle="Que vous partiez de Paris ou de la banlieue, nous maîtrisons les contraintes d'accès, de stationnement et de timing. Devis clair pour avancer vite."
        onPrimary={primaryCta}
      />

      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-16">
        <h2 className="font-['Poppins',sans-serif] font-bold text-[#191919] text-xl sm:text-2xl text-center max-w-2xl mx-auto">
          Idéal pour votre projet en région parisienne
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: <MapPin className="h-7 w-7 text-[#CC922F]" />,
              title: "Couverture locale",
              text: "Interventions dans Paris, petite couronne et trajets régionaux selon votre besoin.",
            },
            {
              icon: <Truck className="h-7 w-7 text-[#CC922F]" />,
              title: "Logistique adaptée",
              text: "Camions et équipes dimensionnés selon l'accès et le volume à transporter.",
            },
            {
              icon: <Timer className="h-7 w-7 text-[#CC922F]" />,
              title: "Créneaux qui vous conviennent",
              text: "Matin, fin de journée ou week-end pour s'adapter à votre emploi du temps.",
            },
            {
              icon: <ShieldCheck className="h-7 w-7 text-[#CC922F]" />,
              title: "Protection & assurance",
              text: "Options pour sécuriser vos biens tout au long du trajet.",
            },
          ].map((x) => (
            <div
              key={x.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0px_8px_30px_rgba(15,23,42,0.06)] flex gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#CC922F]/10">{x.icon}</div>
              <div>
                <h3 className="font-['Poppins',sans-serif] font-semibold text-[#191919]">{x.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{x.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={primaryCta}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-8 py-3.5 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
          >
            Devis Île-de-France en ligne
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <LpTrustStrip
        items={[
          "Réponse rapide sur les demandes de devis",
          "Équipes habituées aux immeubles parisiens",
          "Tarification transparente",
          "Un seul interlocuteur pour votre dossier",
        ]}
      />

      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-14 sm:py-16">
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-8 sm:p-10">
          <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg sm:text-xl">
            Votre déménagement en Île-de-France commence ici
          </p>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Indiquez vos adresses et vos dates : nous vous proposons une estimation alignée sur votre projet.
          </p>
          <button
            type="button"
            onClick={primaryCta}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-8 py-3.5 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
          >
            Obtenir mon devis
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </LandingShell>
  );
}
