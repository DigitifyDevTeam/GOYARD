import { useNavigate } from "react-router-dom";
import { ArrowRight, Home, Package, Truck } from "lucide-react";
import LandingShell from "./components/LandingShell";
import LpHero from "./components/LpHero";
import LpTrustStrip from "./components/LpTrustStrip";
import { useLandingMeta } from "./useLandingMeta";

const CANONICAL = "/lp/demenagement-particulier";

export default function LpDemenagementParticulier() {
  const navigate = useNavigate();
  const primaryCta = () => navigate("/tunnel/mes-coordonnees");

  useLandingMeta({
    title: "Déménagement particulier — Devis gratuit | Guivarche",
    description:
      "Déménagement maison & appartement : emballage, transport, montage. Devis gratuit et équipe à l'écoute. Simplifiez votre projet dès aujourd'hui.",
    canonicalPath: CANONICAL,
    noindex: true,
  });

  return (
    <LandingShell onGetQuote={primaryCta}>
      <LpHero
        badge="Particuliers • Maison & appartement"
        title="Déménagez sereinement, nous gérons les détails"
        subtitle="Du premier carton à la dernière pièce de mobilier, une équipe soigneuse et ponctuelle. Estimation en ligne rapide pour cadrer budget et dates."
        onPrimary={primaryCta}
      />

      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-16">
        <h2 className="font-['Poppins',sans-serif] font-bold text-[#191919] text-xl sm:text-2xl text-center max-w-2xl mx-auto">
          Une offre pensée pour votre foyer
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <Package className="h-7 w-7 text-[#CC922F]" />,
              title: "Protection & emballage",
              text: "Couvertures, housse matelas, cartons et étiquetage pour un rangement efficace à l'arrivée.",
            },
            {
              icon: <Truck className="h-7 w-7 text-[#CC922F]" />,
              title: "Transport adapté",
              text: "Véhicules et équipements selon le volume et l'accès (étage, ascenseur, stationnement).",
            },
            {
              icon: <Home className="h-7 w-7 text-[#CC922F]" />,
              title: "Installation au nouveau logement",
              text: "Reposez-vous : nous plaçons les meubles selon vos indications.",
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
            Estimer mon déménagement
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <LpTrustStrip
        items={[
          "Devis gratuit et sans engagement",
          "Interlocuteur unique pour suivre votre dossier",
          "Respect des délais convenus",
          "Solutions adaptées aux petits et grands volumes",
        ]}
      />

      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-14 sm:py-16">
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-8 sm:p-10">
          <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg sm:text-xl">
            Obtenez votre estimation en quelques minutes
          </p>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Parlez-nous de votre logement et de vos dates : nous vous guidons vers la formule la plus adaptée.
          </p>
          <button
            type="button"
            onClick={primaryCta}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-8 py-3.5 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
          >
            Commencer mon devis
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </LandingShell>
  );
}
