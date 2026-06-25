import { useLocation } from "react-router-dom";
import { AlertCircle, Calculator, Home, Phone } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import { DEVIS_FORM_PATH } from "../constants/parisLp";

export default function NotFound() {
  usePageMeta(PAGE_META.notFound);
  const location = useLocation();

  // Keep the same phone number used in the floating contact buttons.
  const phoneE164 = "+33 1 89 70 33 24";
  const telHref = `tel:${phoneE164}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1C3957] via-[#1b3b68] to-[#2a4f6b] text-white min-h-[520px]">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            aria-hidden="true"
          >
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#CC922F_0%,transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.85)_0%,transparent_45%)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-16 sm:py-20 lg:py-28">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-[#CC922F]" />
                  </div>
                  <p className="text-sm sm:text-base text-white/90 font-['Poppins',sans-serif] font-semibold uppercase tracking-[0.14em]">
                    Oups ! Page introuvable
                  </p>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Poppins',sans-serif] leading-tight">
                  404
                </h1>

                <p className="mt-3 text-white/90 text-base sm:text-lg max-w-2xl font-['Poppins',sans-serif]">
                  Le lien que vous avez essayé d&apos;ouvrir n&apos;existe pas.
                  <span className="block mt-2 text-white/75 text-sm sm:text-base">
                    Adresse :{" "}
                    <span className="font-mono break-all">
                      {location.pathname}
                    </span>
                  </span>
                </p>
              </div>

              <div className="w-full lg:w-[320px]">
                <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-5">
                  <p className="text-white/90 font-semibold font-['Poppins',sans-serif]">
                    Besoin d&apos;avancer ?
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    <a
                      href={DEVIS_FORM_PATH}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] hover:bg-[#CC922F]/90 text-white font-semibold px-4 py-3 transition-colors font-['Poppins',sans-serif]"
                    >
                      <Calculator className="w-5 h-5" />
                      Demande un devis
                    </a>

                    <a
                      href={telHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-4 py-3 transition-colors font-['Poppins',sans-serif]"
                    >
                      <Phone className="w-5 h-5" />
                      Appeler
                    </a>

                    <a
                      href="/"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-4 py-3 transition-colors font-['Poppins',sans-serif]"
                    >
                      <Home className="w-5 h-5" />
                      Accueil
                    </a>
                  </div>

                  <p className="mt-4 text-white/70 text-sm font-['Poppins',sans-serif]">
                    Astuce : utilisez les boutons ci-dessus pour revenir au bon endroit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

       
      </main>

      <Footer />
    </div>
  );
}

