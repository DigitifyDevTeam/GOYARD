import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Globe2, PackageCheck, ShieldCheck, Truck, FileText } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import {
  gradientCtaActionsClass,
  gradientCtaOutlineClass,
  gradientCtaPrimaryClass,
} from "../components/gradientCtaStyles";
import { InterventionMapInternational } from "../components/intervention-map";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

export default function ZoneInternational() {
  usePageMeta(PAGE_META.international);

  const navigate = useNavigate();
  const primaryCta = () => navigate("/tunnel/mes-coordonnees");

  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={primaryCta} />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_18%,rgba(204,146,47,0.22),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(25,25,25,0.10),transparent_55%)]" />
          <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700">
                  <Globe2 className="h-4 w-4 text-[#CC922F]" />
                  Déménagement international • Europe & monde
                </div>
                <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-[#191919] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Déménagement international : logistique + formalités, gérées proprement.
                </h1>
                <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  À l’international, tout se joue sur l’anticipation : emballage, inventaire, coordination transport,
                  et documents. On vous accompagne étape par étape.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Coordination transport & délais",
                    "Inventaire détaillé et suivi",
                    "Options d’emballage renforcé",
                    "Accompagnement sur les documents",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#CC922F] mt-0.5" />
                      <span className="text-sm sm:text-[15px] text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={primaryCta}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
                  >
                    Obtenir mon devis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <ContactPhoneLink variant="inline" className="justify-center w-full sm:w-auto" />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white shadow-[0px_14px_45px_rgba(15,23,42,0.10)] border border-slate-100 p-6 sm:p-7">
                  <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg">
                    Ce que nous cadrons pour vous
                  </p>
                  <div className="mt-4 grid gap-3">
                    {[
                      { icon: <PackageCheck className="h-5 w-5" />, title: "Emballage renforcé", desc: "Protections adaptées au trajet et au mode de transport." },
                      { icon: <FileText className="h-5 w-5" />, title: "Inventaire & documents", desc: "On vous aide à préparer les informations nécessaires." },
                      { icon: <Truck className="h-5 w-5" />, title: "Coordination transport", desc: "Organisation des étapes pour un acheminement fluide." },
                      { icon: <ShieldCheck className="h-5 w-5" />, title: "Assurance", desc: "Niveau de couverture cohérent avec la valeur de vos biens." },
                    ].map((x) => (
                      <div key={x.title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CC922F]/10 text-[#CC922F]">
                          {x.icon}
                        </div>
                        <div>
                          <div className="font-['Poppins',sans-serif] font-semibold text-[#191919] text-sm">
                            {x.title}
                          </div>
                          <div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                            {x.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#191919] text-white p-5">
                    <p className="font-['Poppins',sans-serif] font-semibold text-sm">
                      Conseil international
                    </p>
                    <p className="mt-1 text-xs sm:text-[13px] text-white/80 leading-relaxed">
                      Pour un départ à l’étranger, prévoyez du délai (inventaire, papiers, transport). Démarrez le devis,
                      puis on affine ensemble selon votre pays et vos contraintes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Zones d'intervention */}
        <section className="mt-16">
          <InterventionMapInternational />
        </section>

        {/* À propos – visual showcase */}
        <section className="w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            {/* Top: heading + quote */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              <div>
                <span className="inline-block font-['Poppins',sans-serif] text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                  À Propos
                </span>
                <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
                  L'excellence au service
                  <br className="hidden sm:block" /> de votre déménagement.
                </h2>
              </div>
              <div className="flex gap-4 lg:gap-5 items-start lg:pt-6">
                <svg
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 text-slate-200"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.5 28.8c0-5.1 3.3-9.7 8.3-11.3l-.8-3.5C13.6 16 9 21.7 9 28.8c0 5.2 3.2 8.7 7.2 8.7 3.4 0 5.8-2.6 5.8-5.7 0-3-2.2-5.4-5.3-5.4-1.5 0-2.8.6-3.6 1.5-.2-4.5 2.4-8.6 6.5-10.2l-.8-3.5C13.4 16 9.2 21.4 9.2 28.2c0 .2 0 .4.1.6h3.2zm18.7 0c0-5.1 3.3-9.7 8.3-11.3l-.8-3.5c-6.4 2-11 7.7-11 14.8 0 5.2 3.2 8.7 7.2 8.7 3.4 0 5.8-2.6 5.8-5.7 0-3-2.2-5.4-5.3-5.4-1.5 0-2.8.6-3.6 1.5-.2-4.5 2.4-8.6 6.5-10.2l-.8-3.5C32.1 16 27.9 21.4 27.9 28.2c0 .2 0 .4.1.6h3.2z" />
                </svg>
                <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed max-w-lg">
                  <span className="font-semibold text-slate-800">
                    Nous accompagnons chaque projet avec rigueur et bienveillance.
                  </span>{" "}
                  De la préparation au dernier carton posé, notre équipe met son
                  savoir-faire au service d'un déménagement fluide, ponctuel et
                  soigné — partout en Europe et dans le monde.
                </p>
              </div>
            </div>

            {/* Gallery row */}
            <div className="mt-12 sm:mt-14 lg:mt-16">
              {/* Mobile: simple 2x2 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
                {[
                  { src: "/zones/int1.jpg", alt: "Équipe de déménagement en action" },
                  { src: "/zones/int2.jpg", alt: "Nos locaux et équipements" },
                  { src: "/zones/int3.jpg", alt: "Monte-meuble en intervention" },
                  { src: "/zones/int4.jpg", alt: "Protection et chargement soigné" },
                ].map((img) => (
                  <div
                    key={img.src}
                    className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[3/4] sm:aspect-[4/5]"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: staggered heights like your reference */}
              <div className="hidden lg:flex items-end gap-4">
                {(() => {
                  return [
                    { src: "/zones/int1.jpg", alt: "Équipe de déménagement en action" },
                    { src: "/zones/int2.jpg", alt: "Nos locaux et équipements" },
                    { src: "/zones/int3.jpg", alt: "Monte-meuble en intervention" },
                    { src: "/zones/int4.jpg", alt: "Protection et chargement soigné" },
                  ].map((img) => {
                    return (
                      <div
                        key={img.src}
                        className="relative flex-1 overflow-hidden rounded-2xl sm:rounded-3xl h-[320px]"
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </section>


      

        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14">
          <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500">
            Déroulé
          </p>
          <h2 className="mt-2 font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
            Un process clair, pour éviter les mauvaises surprises.
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              {
                title: "Évaluation",
                desc: "Volume, accès, destination, dates. On identifie les contraintes et le mode de transport.",
              },
              {
                title: "Préparation",
                desc: "Emballage, inventaire, documents. On vous guide pour une préparation propre.",
              },
              {
                title: "Acheminement",
                desc: "Transport, livraison, installation si option. Vous suivez l’avancement simplement.",
              },
            ].map((x) => (
              <div key={x.title} className="rounded-3xl border border-slate-100 bg-white shadow-[0px_10px_30px_rgba(15,23,42,0.06)] p-6">
                <div className="font-['Poppins',sans-serif] font-bold text-[#191919]">
                  {x.title}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {x.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50/60 border-y border-slate-100">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7">
                <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
                  Europe & monde
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Déménagement vers l’étranger (UE et hors UE) avec un accompagnement orienté “propreté” : inventaire,
                  protections, coordination, informations utiles pour les démarches.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    "Particulier & entreprise",
                    "Emballage renforcé & fragile",
                    "Suivi et organisation par étapes",
                    "Options d’assurance",
                  ].map((x) => (
                    <div key={x} className="flex items-start gap-2 rounded-2xl bg-white border border-slate-100 p-4">
                      <CheckCircle2 className="h-5 w-5 text-[#CC922F] mt-0.5" />
                      <span className="text-sm text-slate-700">{x}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white border border-slate-100 shadow-[0px_14px_40px_rgba(15,23,42,0.08)] p-6 sm:p-7">
                  <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg">
                    Préparez votre devis international
                  </p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Démarrez maintenant, puis on adapte selon votre destination et vos contraintes (délais, documents).
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={primaryCta}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3 font-['Poppins',sans-serif] font-semibold text-white hover:brightness-95 transition"
                    >
                      Démarrer mon devis
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/contact")}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-['Poppins',sans-serif] font-semibold text-[#191919] hover:bg-slate-50 transition"
                    >
                      Être rappelé
                    </button>
                    <ContactPhoneLink variant="inline" className="justify-center" />
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Organisation • Formalités • Transport coordonné
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </section>

        <GoogleReviewsSection />
        {/* CTA final */}
        <section className="w-full bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]">
                Prêt à déménager en toute sérénité ?
              </h2>

              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Rejoignez des milliers de clients qui ont déjà fait confiance à Guivarche. Obtenez votre devis
                gratuit maintenant !
              </p>

              <div className={gradientCtaActionsClass}>
                <button type="button" onClick={primaryCta} className={gradientCtaPrimaryClass}>
                  Obtenir un devis gratuit
                </button>

                <a href="/contact" className={gradientCtaOutlineClass}>
                  Nous contacter
                </a>

                <ContactPhoneLink variant="cta" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

