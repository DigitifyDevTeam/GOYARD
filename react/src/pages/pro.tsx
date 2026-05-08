import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, Globe, MapPin, Users, Laptop, Warehouse, ShoppingCart, Building2 } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AddressAutocomplete } from "../components/AddressAutocomplete";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { FormDataManager } from "../utils/formDataManager";
import { LightboxImageDialog, type LightboxImage } from "../components/lightbox-image-dialog";

// ─── Sections imported from DemenagementEntreprise.tsx ──────────────

const proDomaines = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Bureaux",
    description: "Postes de travail, mobilier, archivage",
  },
  {
    icon: <Laptop className="w-8 h-8" />,
    title: "IT / Matériel",
    description: "Déménagement sécurisé de serveurs",
  },
  {
    icon: <Warehouse className="w-8 h-8" />,
    title: "Entrepôts",
    description: "Stockage industriel, racks et palettes",
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "Commerces",
    description: "Agencement, linéaires, caisse",
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

export default function Pro() {
  const navigate = useNavigate();
  const [departureAddress, setDepartureAddress] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const persistLandingFormData = () => {
    FormDataManager.saveFormData({
      address: departureAddress.trim(),
      date: moveDate.trim(),
    });

    sessionStorage.setItem("cameFromHome", "true");
    if (departureAddress.trim()) sessionStorage.setItem("homeDepartureAddress", departureAddress.trim());
    if (moveDate.trim()) sessionStorage.setItem("homeMoveDate", moveDate.trim());
  };

  const ensureClientInfoSubmitted = async (): Promise<number | null> => {
    const existingClientId = localStorage.getItem("clientId");

    if (!departureAddress.trim() || departureAddress.trim().length < 10) {
      alert("Veuillez saisir une adresse valide (au moins 10 caractères).");
      return null;
    }
    if (!moveDate.trim()) {
      alert("Veuillez sélectionner une date de déménagement.");
      return null;
    }

    try {
      const payload = {
        adresse_depart: departureAddress.trim(),
        date_demenagement: moveDate.trim(),
      };

      const url = existingClientId
        ? `/api/demenagement/client-info/${existingClientId}/`
        : "/api/demenagement/client-info/";
      const method = existingClientId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result?.success || !result?.data?.id) {
        alert(
          `Erreur lors de l'enregistrement de vos informations${
            result?.message ? `: ${result.message}` : "."
          }`,
        );
        return null;
      }

      const id = Number(result.data.id);
      FormDataManager.markFormSubmitted(id);
      return id;
    } catch (e) {
      console.error("Error submitting client information from landing:", e);
      alert("Erreur lors de l'enregistrement de vos informations.");
      return null;
    }
  };

  const primaryCta = () => {
    persistLandingFormData();

    navigate("/tunnel/mes-coordonnees");
  };

  const continueToMethodSelection = async () => {
    persistLandingFormData();
    const clientId = await ensureClientInfoSubmitted();
    if (!clientId) return;
    navigate("/tunnel/choix-volume");
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
                  Déménagement entreprise
                </div>
                <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-[#191919] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Déménagement d'entreprise, sans stress.
                </h1>
                <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Transfert de bureaux, relocation d'équipes, déménagement de commerces ou d'entrepôts : une organisation
                  claire, des délais maîtrisés et une exécution soignée.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Planification & coordination",
                    "Protection du matériel & mobilier",
                    "Équipe expérimentée et ponctuelle",
                    "Intervention hors horaires si besoin",
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
                <div className="rounded-3xl bg-white shadow-[0px_14px_45px_rgba(15,23,42,0.10)] border border-slate-100 p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg leading-tight">
                        Obtenez votre devis gratuit
                        <br /> en 2 minutes
                      </p>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        Sans engagement • Réponse sous 24h
                      </p>
                    </div>
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#CC922F]/12 text-[#CC922F]">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div>
                      <Label htmlFor="pro-address" className="text-slate-900 mb-3 block text-base font-medium">
                        Mon service de déménagement
                      </Label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none"
                          style={{ color: "#CC922F" }}
                        />
                        <AddressAutocomplete
                          value={departureAddress}
                          onChange={setDepartureAddress}
                          placeholder="Quelle est votre adresse ?"
                          className="pl-12 bg-slate-50 border-slate-200 h-12 text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pro-date" className="text-slate-900 mb-2 block">
                        Date de déménagement préférée
                      </Label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
                          style={{ color: "#CC922F" }}
                        />
                        <Input
                          id="pro-date"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={moveDate}
                          onChange={(e) => setMoveDate(e.target.value)}
                          className="pl-10 bg-slate-50 border-slate-200 cursor-pointer h-12 text-base"
                          style={{ colorScheme: "light" }}
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={continueToMethodSelection}
                      className="w-full bg-[#CC922F] hover:bg-[#CC922F]/90 text-white py-3 rounded-xl font-bold"
                      size="lg"
                    >
                      CONTINUER →
                    </Button>

                    <p className="text-[11px] text-slate-500 text-center">
                      Données protégées — aucun démarchage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tout commence ici — large conversion strip */}
        <section className="w-full bg-gradient-to-b from-slate-50/90 to-slate-100/40 py-16 sm:py-20 lg:py-24 border-y border-slate-200/80">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32">
            <div className="mx-auto max-w-6xl text-center">
              <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight tracking-tight">
                Tout commence ici
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
                Indiquez votre adresse de départ et recevez un devis personnalisé en quelques minutes.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 bg-[#111827]/85 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-1 text-[#FBBF24] text-[15px] sm:text-base">
                    <span>★★★★★</span>
                  </div>
                  <span className="font-['Poppins',sans-serif] font-bold text-[15px] tracking-tight">
                    5/5
                  </span>
                  <span className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/80">
                    70 avis Google
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#111827]/85 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 text-xs text-emerald-400">
                    ✓
                  </span>
                  <span className="font-['Poppins',sans-serif] font-semibold text-[15px] whitespace-nowrap">
                    Devis sous 24h
                  </span>
                </div>
              </div>

              <div className="mt-10 w-full max-w-6xl mx-auto">
                <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:flex-row sm:items-stretch animate-cta-bar-attention">
                  <div className="flex min-h-[60px] sm:min-h-[68px] flex-1 items-center gap-4 px-5 py-4 sm:px-7 sm:py-5">
                    <MapPin className="h-7 w-7 shrink-0 text-[#C5912B] sm:h-8 sm:w-8" strokeWidth={2} aria-hidden />
                    <AddressAutocomplete
                      value={departureAddress}
                      onChange={setDepartureAddress}
                      autoFocus
                      placeholder="Adresse de départ"
                      className="h-auto border-0 bg-transparent px-0 py-0 text-left text-[17px] sm:text-lg font-['Poppins',sans-serif] text-[#0C1E3A] placeholder:text-[#8E9AAF] focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={primaryCta}
                    className="shrink-0 rounded-none border-t border-slate-100 bg-[#1B365D] px-6 py-4 text-center font-['Poppins',sans-serif] text-[15px] font-bold text-white transition hover:bg-[#152a4a] sm:border-t-0 sm:border-l sm:border-slate-100/20 sm:px-10 sm:py-5 sm:text-base lg:min-w-[240px]"
                  >
                    Obtenir un devis gratuit
                  </button>
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
              {proDomaines.map((domaine, index) => (
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
                  soigné — pour vos locaux, bureaux et équipes.
                </p>
              </div>
            </div>

            {/* Gallery row */}
            <div className="mt-12 sm:mt-14 lg:mt-16">
              {/* Mobile: simple 2x2 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
                {[
                  { src: "/gallery/hero.jpeg", alt: "Équipe de déménagement en action" },
                  { src: "/gallery/monte_meuble.jpeg", alt: "Monte-meuble en intervention" },
                  { src: "/gallery/1.jpeg", alt: "Protection et chargement soigné" },
                  {
                    src: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.55.jpeg",
                    alt: "Nos locaux et équipements",
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
                    { src: "/gallery/monte_meuble.jpeg", alt: "Monte-meuble en intervention" },
                    { src: "/gallery/1.jpeg", alt: "Protection et chargement soigné" },
                    {
                      src: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.55.jpeg",
                      alt: "Nos locaux et équipements",
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
                  Déménagement entreprise
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Organisation adaptée aux contraintes professionnelles : accès, sécurité, planning, zones sensibles,
                  manutention et remise en service rapide.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    "Transfert de bureaux / commerces",
                    "Relocation & réinstallation",
                    "Manutention & protection renforcée",
                    "Démontage / remontage & packaging",
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
                    Prêt à planifier votre déménagement d'entreprise ?
                  </p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Lancez votre devis en 2 minutes. Vous pouvez affiner ensuite (options, accès, dates).
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
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
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Réponse rapide • Devis clair • Équipe pro
                  </p>
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

        {/* Références */}
        <section className="bg-white py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <SectionHeader
              icon={<Users className="h-4 w-4" />}
              pill="Références"
              pillColor="gold"
              title="Ils nous ont fait confiance"
            />

            <style>{`
              @keyframes entreprise-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .entreprise-marquee-track {
                animation: entreprise-marquee 35s linear infinite;
              }
            `}</style>

            <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
              <div className="entreprise-marquee-track flex items-center gap-12 py-4 w-max">
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Fedex-logo.png" alt="FedEx" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sorbonne.svg" alt="Sorbonne" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(0.85)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sephora.svg" alt="Sephora" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Dior_Logo.svg.png" alt="Dior" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/IXINA-Logo_BLEU_CMJN.jpg" alt="Ixina" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Logo_BWT_Alpine_F1_Team_-_2022.svg" alt="BWT Alpine F1 Team" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Longchamps.jpg" alt="Longchamp" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Pinsent_Masons_logo.svg" alt="Pinsent Masons" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/espot.jpg" alt="Espot" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.25)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Polene.jpg" alt="Polène" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/le-tanneur.png" alt="Le Tanneur" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Givenchy.png" alt="Givenchy" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/meurice.jpg" alt="Le Meurice" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/gallery-dept.png" alt="Gallery Dept" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.55)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Hilton.png" alt="Hilton" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>

                {/* Duplicated set for seamless loop */}
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Fedex-logo.png" alt="FedEx" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sorbonne.svg" alt="Sorbonne" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(0.85)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/sephora.svg" alt="Sephora" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Dior_Logo.svg.png" alt="Dior" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/IXINA-Logo_BLEU_CMJN.jpg" alt="Ixina" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Logo_BWT_Alpine_F1_Team_-_2022.svg" alt="BWT Alpine F1 Team" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Longchamps.jpg" alt="Longchamp" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Pinsent_Masons_logo.svg" alt="Pinsent Masons" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/espot.jpg" alt="Espot" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.25)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Polene.jpg" alt="Polène" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/le-tanneur.png" alt="Le Tanneur" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Givenchy.png" alt="Givenchy" className="h-full w-full object-contain object-center" loading="lazy" /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/meurice.jpg" alt="Le Meurice" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.2)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/gallery-dept.png" alt="Gallery Dept" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.55)" }} /></div>
                <div className="flex h-[72px] w-[220px] flex-shrink-0 items-center justify-center overflow-hidden"><img src="/logos/Hilton.png" alt="Hilton" className="h-full w-full object-contain object-center" loading="lazy" style={{ transform: "scale(1.5)" }} /></div>
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
