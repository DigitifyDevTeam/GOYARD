import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin } from "lucide-react";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import { HeroTrustCard, HeroTrustCardMobile } from "../components/HeroTrustCard";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ParisCompactDevisForm } from "../components/paris/ParisLandingHero";
import { ParisLpFormProvider } from "../components/paris/ParisLpFormContext";
import { TUNNEL_DEVIS_CONFIG } from "../components/paris/landingHeroConfig";
import { clearParisLpSession } from "../constants/parisLp";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

const TUNNEL_HERO_IMAGE = "/gallery/Déménagement longue distance.jpeg";

export default function TunnelDevis() {
  usePageMeta(PAGE_META.tunnelDevis);

  const navigate = useNavigate();
  const primaryCta = () => navigate("/");

  useEffect(() => {
    const handlePageHide = () => {
      clearParisLpSession();
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={primaryCta} />

      <main>
        <section className="relative overflow-hidden min-h-[360px] sm:min-h-[380px] lg:min-h-[420px]">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={TUNNEL_HERO_IMAGE}
              alt="Camion Guivarche Déménagement — demande de devis"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/75 via-[#1C3957]/35 to-[#0f172a]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-[#0f172a]/15 to-[#0f172a]/25" />
            <div className="absolute inset-y-0 left-0 w-full max-w-[62%] bg-gradient-to-r from-black/50 via-black/20 to-transparent lg:max-w-[58%]" />
          </div>

          <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-10 sm:py-12 lg:py-14">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="relative lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-lg">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  Devis en ligne • Réponse sous 24 h
                </div>
                <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-white text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
                  Demande de devis rapide
                </h1>
                <p className="mt-3 text-[#f1f5f9] text-base sm:text-lg leading-relaxed max-w-2xl font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.65)]">
                  Complétez le formulaire ci-dessous pour recevoir un devis personnalisé : adresses, volume et date de
                  déménagement. Réponse sous 24 h par l&apos;équipe Guivarche, sans engagement.
                </p>

                <div className="mt-5 grid sm:grid-cols-2 gap-2.5 max-w-2xl">
                  {[
                    "Formulaire simple et sécurisé",
                    "Estimation du volume en ligne",
                    "Devis personnalisé sous 24 h",
                    "Données protégées",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#F5C76E] mt-0.5 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" />
                      <span className="text-sm sm:text-[15px] text-[#f8fafc] font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_10px_rgba(0,0,0,0.6)]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 max-w-2xl">
                  <ContactPhoneLink
                    variant="hero"
                    className="w-full justify-center gap-2.5 px-6 py-3 sm:py-3.5"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 flex w-full justify-center lg:self-end">
                <div className="hidden lg:block w-full">
                  <HeroTrustCard />
                </div>
                <div className="lg:hidden w-full">
                  <HeroTrustCardMobile />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ParisLpFormProvider>
          <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16 bg-white border-b border-slate-100">
            <div className="hidden lg:block w-full">
              <ParisCompactDevisForm config={TUNNEL_DEVIS_CONFIG} />
            </div>
            <div className="lg:hidden w-full rounded-2xl border border-slate-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] overflow-hidden">
              <ParisCompactDevisForm config={TUNNEL_DEVIS_CONFIG} variant="mobile" />
            </div>
          </section>
        </ParisLpFormProvider>
      </main>

      <Footer />
    </div>
  );
}
