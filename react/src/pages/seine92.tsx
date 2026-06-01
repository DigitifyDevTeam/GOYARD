import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { InterventionMapVersailles92 } from "../components/intervention-map";
import { LightboxImageDialog, type LightboxImage } from "../components/lightbox-image-dialog";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { DevisForm, ParisDevisTrustAside, ParisHeroServicePitch } from "./paris";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

export default function Seine92() {
  usePageMeta(PAGE_META.lpHautsDeSeine);

  const navigate = useNavigate();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const primaryCta = () => {
    sessionStorage.setItem("cameFromHome", "true");
    navigate("/tunnel/mes-coordonnees");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={primaryCta} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(204,146,47,0.22),transparent_60%),radial-gradient(900px_500px_at_85%_10%,rgba(25,25,25,0.10),transparent_55%)]" />
          <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  Hauts-de-Seine (92) • Déménagement pro
                </div>
                <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-[#191919] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Déménagement dans les Hauts-de-Seine (92), sans stress.
                </h1>
                <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Une équipe réactive pour des déménagements efficaces, soignés et parfaitement organisés dans les Hauts-de-Seine (92). Devis rapide, dates flexibles, protection premium.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Intervention rapide (92)",
                    "Protection mobilier & accès difficiles",
                    "Équipe expérimentée et ponctuelle",
                    "Suivi simple, clair, transparent",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#CC922F] mt-0.5" />
                      <span className="text-sm sm:text-[15px] text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={primaryCta}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
                  >
                    Obtenir mon devis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white/70 backdrop-blur-sm shadow-[0px_14px_45px_rgba(15,23,42,0.10)] border border-slate-100 p-6 sm:p-7">
                  <ParisHeroServicePitch showAnimatedPhone />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Devis complet — full quote form */}
        <section className="w-full bg-slate-50/60 py-16 sm:py-20 lg:py-24 border-y border-slate-200/80">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight tracking-tight">
                Obtenez un Devis Gratuit en 24H
              </h2>
              <p className="mt-4 mx-auto max-w-2xl rounded-xl border border-[#CC922F]/35 bg-[#CC922F]/12 px-4 py-3 sm:px-5 sm:py-4 text-[#191919] text-base sm:text-lg leading-relaxed shadow-[0_4px_20px_rgba(204,146,47,0.12)]">
                Confiez votre déménagement à nos équipes.{" "}
                <span className="font-bold text-[#CC922F] underline decoration-[#CC922F]/50 decoration-2 underline-offset-4">
                  Nous proposons les tarifs les moins élevés d&apos;Île-de-France.
                </span>
              </p>
            </div>

            <DevisForm />
          </div>
        </section>

        <GoogleReviewsSection />

        {/* Hauts-de-Seine (92) — carte & zone */}
        <section className="mt-0">
          <InterventionMapVersailles92 />
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
                  soigné — partout dans les Hauts-de-Seine (92).
                </p>
              </div>
            </div>

            {/* Gallery row */}
            <div className="mt-12 sm:mt-14 lg:mt-16">
              {/* Mobile: simple 2x2 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
                {[
                  { src: "/gallery/hero.jpeg", alt: "Équipe Guivarche Déménagement" },
                  { src: "/gallery/monte_meuble.jpeg", alt: "Garde-meubles : caisses de stockage dans l'entrepôts" },
                  { src: "/gallery/1.jpeg", alt: "Protection et chargement soigné" },
                  {
                    src: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.55.jpeg",
                    alt: "Caisses  professionnelles empilées pour le déménagement",
                  },
                ].map((img) => (
                  <button
                    key={img.src}
                    type="button"
                    className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[3/4] sm:aspect-[4/5] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#CC922F] focus:ring-offset-2"
                    onClick={() => setLightboxImage(img)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </button>
                ))}
              </div>

              {/* Desktop: staggered heights like your reference */}
              <div className="hidden lg:flex items-end gap-4">
                {(() => {
                  return [
                    { src: "/gallery/hero.jpeg", alt: "Équipe Guivarche Déménagement" },
                    { src: "/gallery/monte_meuble.jpeg", alt: "Garde-meubles : caisses de stockage dans l'entrepôt" },
                    { src: "/gallery/1.jpeg", alt: "Protection et chargement soigné" },
                    {
                      src: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.55.jpeg",
                      alt: "Caisses  professionnelles empilées pour le déménagement",
                    },
                  ].map((img) => {
                    return (
                      <button
                        key={img.src}
                        type="button"
                        className="relative flex-1 overflow-hidden rounded-2xl sm:rounded-3xl h-[320px] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#CC922F] focus:ring-offset-2"
                        onClick={() => setLightboxImage(img)}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            <LightboxImageDialog image={lightboxImage} onClose={() => setLightboxImage(null)} />
          </div>
        </section>



        {/* Process */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14">
          <div className="flex flex-col gap-2">
            <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500">
              Comment ça se passe
            </p>
            <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
              Un déroulé simple, maîtrisé, pro.
            </h2>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Devis rapide",
                desc: "Vous décrivez votre déménagement (volume, accès, dates). On vous répond vite, sans blabla.",
              },
              {
                step: "02",
                title: "Préparation",
                desc: "On planifie le jour J, les protections, le stationnement, et les options (emballage, démontage).",
              },
              {
                step: "03",
                title: "Jour J",
                desc: "Chargement, transport, livraison. Votre mobilier est protégé et tout est cadré.",
              },
            ].map((x) => (
              <div key={x.step} className="rounded-3xl border border-slate-100 bg-white shadow-[0px_10px_30px_rgba(15,23,42,0.06)] p-6">
                <div className="flex items-center justify-between">
                  <span className="font-['Poppins',sans-serif] font-extrabold text-[#CC922F]">
                    {x.step}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#CC922F]" aria-hidden="true" />
                </div>
                <div className="mt-3 font-['Poppins',sans-serif] font-bold text-[#191919]">
                  {x.title}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {x.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage + CTA */}
        <section className="bg-slate-50/60 border-y border-slate-100">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7">
                <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
                  Hauts-de-Seine (92)
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Intervention dans les Hauts-de-Seine (92) : desserte locale, accès résidentiels et contraintes de
                  stationnement prises en compte pour une organisation fluide sur tout le département.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    "Déménagement appartement / maison",
                    "Transfert bureaux / commerces",
                    "Accès difficiles & étages",
                    "Options d’emballage & démontage",
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
                  <ParisDevisTrustAside showAnimatedPhone />
                </div>
              </div>
            </div>
          </div>
        </section>
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={primaryCta}
                  className="inline-flex items-center justify-center bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-base sm:text-lg font-['Poppins',sans-serif] transition-colors"
                >
                  Obtenir un devis gratuit
                </button>

                <a
                  href="/contact"
                  className="inline-flex items-center justify-center border border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-base sm:text-lg font-['Poppins',sans-serif] transition-colors"
                >
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}