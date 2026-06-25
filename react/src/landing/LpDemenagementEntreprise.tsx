import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Clock, Shield } from "lucide-react";
import LandingShell from "./components/LandingShell";
import LpHero from "./components/LpHero";
import LpTrustStrip from "./components/LpTrustStrip";
import { useLandingMeta } from "./useLandingMeta";
import { PAGE_META } from "../seo/pageMeta";
import { DEVIS_FORM_PATH } from "../constants/parisLp";

export default function LpDemenagementEntreprise() {
  const navigate = useNavigate();
  const primaryCta = () => navigate(DEVIS_FORM_PATH);

  useLandingMeta(PAGE_META.lpDemenagementEntreprise);

  return (
    <LandingShell onGetQuote={primaryCta}>
      <LpHero
        badge="Déménagement professionnel • B2B"
        title="Votre transfert d'entreprise, sans interruption d'activité"
        subtitle="Planning sur mesure, coordination avec vos équipes et protection des postes de travail et matériels sensibles. Un interlocuteur unique du devis à l'installation."
        onPrimary={primaryCta}
      />

      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-16">
        <h2 className="font-['Poppins',sans-serif] font-bold text-[#191919] text-xl sm:text-2xl text-center max-w-2xl mx-auto">
          Ce que nous optimisons pour les pros
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <Building2 className="h-7 w-7 text-[#CC922F]" />,
              title: "Organisation claire",
              text: "Phasage des équipes, étiquetage et réassort par zone pour un redémarrage rapide.",
            },
            {
              icon: <Shield className="h-7 w-7 text-[#CC922F]" />,
              title: "Sécurité des biens",
              text: "Emballages adaptés, manutention maîtrisée et options d'assurance selon vos besoins.",
            },
            {
              icon: <Clock className="h-7 w-7 text-[#CC922F]" />,
              title: "Créneaux flexibles",
              text: "Interventions tôt, tard ou week-end pour limiter l'impact sur votre activité.",
            },
          ].map((x) => (
            <div
              key={x.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0px_8px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CC922F]/10">{x.icon}</div>
              <h3 className="mt-4 font-['Poppins',sans-serif] font-semibold text-[#191919]">{x.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{x.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={primaryCta}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-8 py-3.5 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
          >
            Demander un devis entreprise
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <LpTrustStrip
        items={[
          "Chef de projet et planning détaillé",
          "Déménagement de postes informatiques et archives",
          "Respect des contraintes d'accès et de sécurité du site",
          "Transparence des prix, sans frais cachés",
        ]}
      />

      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-14 sm:py-16">
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-8 sm:p-10">
          <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg sm:text-xl">
            Prêt à planifier votre déménagement d'entreprise ?
          </p>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Décrivez vos locaux et vos contraintes : nous revenons vers vous avec une proposition adaptée.
          </p>
          <button
            type="button"
            onClick={primaryCta}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-8 py-3.5 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
          >
            Lancer mon devis en ligne
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </LandingShell>
  );
}
