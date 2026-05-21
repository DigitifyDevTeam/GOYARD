import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe, Home, MapPin, Boxes, Sofa, Package } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { LightboxImageDialog, type LightboxImage } from "../components/lightbox-image-dialog";
import { DevisForm, ParisDevisTrustAside, ParisHeroServicePitch } from "./paris";

// ─── Sections (Particulier) ─────────────────────────────────────────

const particulierDomaines = [
  {
    icon: <Home className="w-8 h-8" />,
    title: "Appartements",
    description: "Accès, étages, protection du mobilier",
  },
  {
    icon: <Sofa className="w-8 h-8" />,
    title: "Maisons",
    description: "Volumes plus importants, organisation sur-mesure",
  },
  {
    icon: <Boxes className="w-8 h-8" />,
    title: "Cartons & fragiles",
    description: "Emballage, vaisselle, objets sensibles",
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Options",
    description: "Démontage/remontage, emballage, garde-meubles",
  },
];

function SectionHeader({
  icon,
  pill,
  pillColor = "gold",
  title,
  subtitle,
}: Readonly<{
  icon: ReactNode;
  pill: string;
  pillColor?: "gold" | "navy";
  title: string;
  subtitle?: string;
}>) {
  const bg = pillColor === "gold" ? "bg-[#CC922F]/10" : "bg-[#1C3957]/10";
  const textColor = pillColor === "gold" ? "text-[#CC922F]" : "text-[#1C3957]";

  return (
    <div className="text-center mb-10 sm:mb-16">
      <motion.div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${bg} mb-4`}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={textColor}>{icon}</span>
        <span className={`text-sm font-semibold ${textColor}`}>{pill}</span>
      </motion.div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#1C3957] font-['Poppins',sans-serif]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-['Poppins',sans-serif]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function Particulier() {
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
        {/* Devis complet — full quote form */}
        <section className="w-full bg-slate-50/60 py-16 sm:py-20 lg:py-24 border-y border-slate-200/80">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight tracking-tight">
                Confiez-nous votre projet de déménagement
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
                Confiez votre déménagement à nos équipes. Nous proposons les tarifs les moins élevés d'Île-de-France.
              </p>
            </div>

            <DevisForm />
          </div>
        </section>

        {/* Hero — Paris 75 */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(204,146,47,0.22),transparent_60%),radial-gradient(900px_500px_at_85%_10%,rgba(25,25,25,0.10),transparent_55%)]" />
          <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  Déménagement particulier

                </div>
                <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-[#191919] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Déménagement particulier, sans stress.

                </h1>
                <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Studio, appartement, maison : une organisation claire, des délais maîtrisés et une exécution soignée. Devis rapide, dates flexibles, protection premium.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Planification & coordination",
                    "Protection du mobilier & des fragiles",
                    "Équipe expérimentée et ponctuelle",
                    "Options d’emballage & démontage",
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
                  <button
                    type="button"
                    onClick={() => (globalThis.location.href = "tel:+33189703324")}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-['Poppins',sans-serif] font-semibold text-[#191919] hover:bg-slate-50 transition"
                  >
                    Parler à un conseiller
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white/70 backdrop-blur-sm shadow-[0px_14px_45px_rgba(15,23,42,0.10)] border border-slate-100 p-6 sm:p-7">
                  <ParisHeroServicePitch />
                </div>
              </div>
            </div>
          </div>
        </section>

        

        {/* Notre expertise */}
        <section className="bg-white py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Globe className="h-4 w-4" />}
              pill="Notre expertise"
              pillColor="gold"
              title="Nos domaines d'intervention"
              subtitle="Des solutions spécialisées pour chaque type d'activité"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {particulierDomaines.map((domaine, index) => (
                <motion.div
                  key={domaine.title}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-[#CC922F]/30 text-center group shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] hover:border-[#CC922F]/60"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#1C3957] flex items-center justify-center mx-auto mb-6 text-white shadow-md ring-4 ring-[#CC922F]/15 group-hover:bg-[#152a3d] transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {domaine.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1C3957] font-['Poppins',sans-serif]">
                    {domaine.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-['Poppins',sans-serif] text-sm">
                    {domaine.description}
                  </p>
                  <motion.div className="w-10 h-0.5 bg-[#CC922F] mt-6 mx-auto group-hover:w-16 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
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
                  soigné — pour votre logement et votre famille.
                </p>
              </div>
            </div>

            {/* Gallery row */}
            <div className="mt-12 sm:mt-14 lg:mt-16">
              {/* Mobile: simple 2x2 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
                {[
                  { src: "/gallery/hero.jpeg", alt: "Équipe de déménagement en action" },
                  { src: "/gallery/monte_meuble.jpeg", alt: "Garde-meubles : caisses de stockage dans l'entrepôt" },
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
                    { src: "/gallery/hero.jpeg", alt: "Équipe de déménagement en action" },
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
              Un déroulé simple, maîtrisé, clair.
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
                  Déménagement particulier
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Organisation adaptée à votre logement : accès, étages, stationnement, protections, manutention et remise en place soignée.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    "Appartement / maison",
                    "Protection & manutention soignée",
                    "Accès difficiles & étages",
                    "Emballage / démontage en option",
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
                  <ParisDevisTrustAside />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Desktop: section title + Google Reviews widget */}
        <div className="hidden lg:block w-full max-w-[1920px] bg-white pt-20 pb-12">
          <div className="text-center section-px">
            <h2 className="font-['Poppins',_sans-serif] font-[600] text-3xl lg:text-4xl xl:text-[51px] xl:leading-[62px] text-black">
              Ce que nos clients disent de nous !
            </h2>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="elfsight-app-402ccb84-5c20-4877-9afd-70877cb72277" data-elfsight-app-lazy />
          </div>
        </div>
        {/* Mobile: section title + Google Reviews widget */}
        <div className="lg:hidden w-full bg-white pt-16 pb-10 sm:pt-20 sm:pb-12 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-['Poppins',_sans-serif] font-[600] text-2xl sm:text-3xl text-black">
              Ce que nos clients disent de nous !
            </h2>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="elfsight-app-402ccb84-5c20-4877-9afd-70877cb72277 w-full" data-elfsight-app-lazy />
          </div>
        </div>

       
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