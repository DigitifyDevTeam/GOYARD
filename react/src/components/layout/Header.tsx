import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Phone, Calculator, BadgeEuro, Layers3, MapPin, Route, Globe2 } from "lucide-react";

interface HeaderProps {
  onGetQuote?: () => void;
}

export default function Header({ onGetQuote }: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [outilOpen, setOutilOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);
  const [mobileZonesOpen, setMobileZonesOpen] = useState(false);
  const [mobileOutilsOpen, setMobileOutilsOpen] = useState(false);
  const zonesTimeoutRef = useRef<number | null>(null);
  const outilsTimeoutRef = useRef<number | null>(null);

  const openZones = () => {
    if (zonesTimeoutRef.current !== null) {
      window.clearTimeout(zonesTimeoutRef.current);
      zonesTimeoutRef.current = null;
    }
    setZonesOpen(true);
  };

  const closeZonesWithDelay = () => {
    if (zonesTimeoutRef.current !== null) {
      window.clearTimeout(zonesTimeoutRef.current);
    }
    zonesTimeoutRef.current = window.setTimeout(() => {
      setZonesOpen(false);
      zonesTimeoutRef.current = null;
    }, 150);
  };

  const openOutils = () => {
    if (outilsTimeoutRef.current !== null) {
      window.clearTimeout(outilsTimeoutRef.current);
      outilsTimeoutRef.current = null;
    }
    setOutilOpen(true);
  };

  const closeOutilsWithDelay = () => {
    if (outilsTimeoutRef.current !== null) {
      window.clearTimeout(outilsTimeoutRef.current);
    }
    outilsTimeoutRef.current = window.setTimeout(() => {
      setOutilOpen(false);
      outilsTimeoutRef.current = null;
    }, 150);
  };

  const handleGetQuote = () => {
    setMobileMenuOpen(false);
    if (onGetQuote) {
      onGetQuote();
    } else {
      navigate("/tunnel/mes-coordonnees");
    }
  };

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileZonesOpen(false);
      setMobileOutilsOpen(false);
    }
  }, [mobileMenuOpen]);

  const linkClass = "font-['Poppins',sans-serif] font-semibold text-[#191919] hover:text-[#CC922F] transition-colors text-sm lg:text-[15px] py-2 px-4 laptop:text-sm laptop:py-2 laptop:px-3 laptop:whitespace-nowrap laptop:shrink-0 desktop:text-[15px] desktop:px-5 rounded-md hover:bg-slate-50/80";

  return (
    <>
      {/* Top bar: logo + desktop nav + CTA / hamburger */}
      <header className="w-full bg-white shadow-[0px_6px_16px_0px_rgba(25,25,25,0.06)]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 laptop:px-10 desktop:px-[90px] min-[1920px]:px-[210px]">
          <div className="flex items-center justify-between h-32 lg:h-30 gap-4 laptop:gap-3 desktop:gap-4 min-w-0">
            {/* Laptop: logo + nav grouped. Desktop: logo | centered nav | CTA for equal side gaps */}
            <div className="flex items-center gap-6 laptop:gap-6 min-w-0 laptop:flex-1 laptop:min-w-0 desktop:contents">
              <a href="/" className="shrink-0 py-4 laptop:py-2" aria-label="Accueil">
                <img
                  src="/logo.svg"
                  alt="BrasenPlus"
                  className="h-32 w-auto laptop:h-32 desktop:h-40"
                />
              </a>
              {/* Desktop nav - hidden on mobile; single line on laptop with max even spacing */}
              <nav className="hidden lg:flex items-center laptop:flex-1 laptop:flex-nowrap laptop:justify-between desktop:flex-1 desktop:flex-nowrap desktop:justify-center desktop:gap-x-14 font-[600] text-[#191919] laptop:min-w-0 desktop:min-w-0" aria-label="Navigation principale">
                <a href="/" className={linkClass}>
                  Accueil
                </a>
                <a href="/solution" className={linkClass}>
                  Solution
                </a>
                <a href="/demenagement-particulier" className={linkClass}>
                  Particulier
                </a>
                <a href="/demenagement-entreprise" className={linkClass}>
                  Pro
                </a>

                {/* Zones mega menu */}
                <div
                  className="relative laptop:mx-0 desktop:mx-2"
                  onMouseEnter={openZones}
                  onMouseLeave={closeZonesWithDelay}
                >
                  <button
                    type="button"
                    className={`${linkClass} flex items-center gap-1`}
                    aria-haspopup="true"
                    aria-expanded={zonesOpen}
                  >
                    Zone
                    <span className="text-xs mt-[1px]">▾</span>
                  </button>
                  {zonesOpen && (
                    <div className="absolute left-1/2 top-full z-40 mt-3 w-[600px] -translate-x-1/2 rounded-2xl bg-white shadow-xl border border-slate-100 px-6 py-4">
                      <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500 mb-3">
                        Zones d&apos;intervention
                      </p>
                      <div className="flex gap-4 justify-between">
                        <a
                          href="/ile-de-france"
                          className="group flex-1 flex flex-col gap-1 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CC922F]/10 text-[#CC922F]">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] text-[#191919]">
                              Île-de-France
                            </span>
                          </div>
                          <span className="font-['Poppins',sans-serif] text-[11px] text-slate-500 leading-snug">
                            Proximité Parisienne
                          </span>
                        </a>
                        <a
                          href="/demenagement-national"
                          className="group flex-1 flex flex-col gap-1 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CC922F]/10 text-[#CC922F]">
                              <Route className="h-4 w-4" />
                            </div>
                            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] text-[#191919] whitespace-nowrap">
                              Déménagement National
                            </span>
                          </div>
                          <span className="font-['Poppins',sans-serif] text-[11px] text-slate-500 leading-snug">
                            Toute la France
                          </span>
                        </a>
                        <a
                          href="/international"
                          className="group flex-1 flex flex-col gap-1 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CC922F]/10 text-[#CC922F]">
                              <Globe2 className="h-4 w-4" />
                            </div>
                            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] text-[#191919]">
                              International
                            </span>
                          </div>
                          <span className="font-['Poppins',sans-serif] text-[11px] text-slate-500 leading-snug">
                            Europe &amp; Monde
                          </span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Outil mega menu */}
                <div
                  className="relative"
                  onMouseEnter={openOutils}
                  onMouseLeave={closeOutilsWithDelay}
                >
                  <button
                    type="button"
                    className={`${linkClass} flex items-center gap-1`}
                    aria-haspopup="true"
                    aria-expanded={outilOpen}
                  >
                    Outils
                    <span className="text-xs mt-[1px]">▾</span>
                  </button>
                  {outilOpen && (
                    <div className="absolute left-1/2 top-full z-40 mt-3 w-[520px] -translate-x-1/2 rounded-2xl bg-white shadow-xl border border-slate-100 px-6 py-4">
                      <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500 mb-3">
                        Outils en ligne
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <a
                          href="/tunnel/mes-coordonnees"
                          className="group flex flex-col gap-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CC922F]/10 text-[#CC922F]">
                              <Calculator className="h-4 w-4" />
                            </div>
                            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] text-[#191919]">
                              Calculateur de volume
                            </span>
                          </div>
                          <span className="font-['Poppins',sans-serif] text-[11px] text-slate-500 leading-snug">
                            Estimez le volume de votre déménagement en m³.
                          </span>
                        </a>
                        <a
                          href="/formules-demenagement"
                          className="group flex flex-col gap-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CC922F]/10 text-[#CC922F]">
                              <BadgeEuro className="h-4 w-4" />
                            </div>
                            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] text-[#191919]">
                              Tarifs
                            </span>
                          </div>
                          <span className="font-['Poppins',sans-serif] text-[11px] text-slate-500 leading-snug">
                            Simulez le prix de votre déménagement.
                          </span>
                        </a>
                        <a
                          href="/tarification"
                          className="group flex flex-col gap-2 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CC922F]/10 text-[#CC922F]">
                              <Layers3 className="h-4 w-4" />
                            </div>
                            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] text-[#191919]">
                              Formules de déménagement
                            </span>
                          </div>
                          <span className="font-['Poppins',sans-serif] text-[11px] text-slate-500 leading-snug">
                            Comparez les formules Éco, Standard, Prestige.
                          </span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <a href="/contact" className={linkClass}>
                  Contact
                </a>
              </nav>
            </div>

            {/* CTA desktop / Hamburger mobile */}
            <div className="flex items-center gap-4 laptop:gap-3 desktop:gap-4 shrink-0 laptop:pl-2">
              <button
                onClick={handleGetQuote}
                className="hidden sm:flex bg-[#1c3957] hover:bg-[#2a4f6b] text-white font-['Poppins',sans-serif] font-semibold text-sm lg:text-base laptop:text-sm laptop:px-4 laptop:py-2.5 desktop:text-base desktop:px-5 desktop:py-3 px-4 py-2.5 rounded transition-colors duration-200 whitespace-nowrap"
              >
                Devis en un clic
              </button>
              <a
                href="tel:+33 1 89 70 33 24"
                className="hidden sm:flex laptop:hidden desktop:flex items-center gap-2 text-[#1c3957] hover:text-[#CC922F] font-['Poppins',sans-serif] font-semibold text-sm lg:text-base desktop:text-base whitespace-nowrap transition-colors"
                aria-label="Appeler le +33 1 89 70 33 24"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>1 89 70 33 24</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-[#191919] hover:bg-slate-100 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <a href="/" onClick={() => setMobileMenuOpen(false)}>
              <img
                src="/logo.svg"
                alt="BrasenPlus"
                className="h-12 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-[#191919] hover:bg-slate-100"
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col p-4 gap-1" aria-label="Menu mobile">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-lg ${linkClass} text-base`}
            >
              Accueil
            </a>
            <a
              href="/solution"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-lg ${linkClass} text-base`}
            >
              Solution
            </a>
            <a
              href="/demenagement-particulier"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-lg ${linkClass} text-base`}
            >
              Particulier
            </a>
            <a
              href="/demenagement-entreprise"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-lg ${linkClass} text-base`}
            >
              Pro
            </a>
            {/* Mobile "Zones" section with sub-links */}
            <div className="mt-1 mb-2">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 pt-3 pb-1 text-xs font-['Poppins',sans-serif] font-semibold uppercase tracking-[0.16em] text-slate-500"
                onClick={() => setMobileZonesOpen((v) => !v)}
                aria-expanded={mobileZonesOpen}
              >
                <span>Zones</span>
                <span className="text-[12px] leading-none text-slate-500">{mobileZonesOpen ? "▴" : "▾"}</span>
              </button>
              {mobileZonesOpen && (
                <div className="flex flex-col gap-1 pl-4">
                  <a
                    href="/ile-de-france"
                    onClick={() => {
                      setMobileZonesOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-lg text-sm font-['Poppins',sans-serif] text-[#191919] hover:bg-slate-100 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-[#CC922F]" />
                    Île-de-France · Proximité Parisienne
                  </a>
                  <a
                    href="/demenagement-national"
                    onClick={() => {
                      setMobileZonesOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-lg text-sm font-['Poppins',sans-serif] text-[#191919] hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Route className="h-4 w-4 text-[#CC922F]" />
                    Déménagement National · Toute la France
                  </a>
                  <a
                    href="/international"
                    onClick={() => {
                      setMobileZonesOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-lg text-sm font-['Poppins',sans-serif] text-[#191919] hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Globe2 className="h-4 w-4 text-[#CC922F]" />
                    International · Europe &amp; Monde
                  </a>
                </div>
              )}
            </div>
            {/* Mobile "Outils" section with sub-links */}
            <div className="mt-1 mb-2">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 pt-3 pb-1 text-xs font-['Poppins',sans-serif] font-semibold uppercase tracking-[0.16em] text-slate-500"
                onClick={() => setMobileOutilsOpen((v) => !v)}
                aria-expanded={mobileOutilsOpen}
              >
                <span>Outils</span>
                <span className="text-[12px] leading-none text-slate-500">{mobileOutilsOpen ? "▴" : "▾"}</span>
              </button>
              {mobileOutilsOpen && (
                <div className="flex flex-col gap-1 pl-4">
                  <a
                    href="/tunnel/mes-coordonnees"
                    onClick={() => {
                      setMobileOutilsOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-lg text-sm font-['Poppins',sans-serif] text-[#191919] hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Calculator className="h-4 w-4 text-[#CC922F]" />
                    Calculer votre volume avec notre outil IA
                  </a>
                  <a
                    href="/formules-demenagement"
                    onClick={() => {
                      setMobileOutilsOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-lg text-sm font-['Poppins',sans-serif] text-[#191919] hover:bg-slate-100 flex items-center gap-2"
                  >
                    <BadgeEuro className="h-4 w-4 text-[#CC922F]" />
                    Tarifs
                  </a>
                  <a
                    href="/tarification"
                    onClick={() => {
                      setMobileOutilsOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 rounded-lg text-sm font-['Poppins',sans-serif] text-[#191919] hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Layers3 className="h-4 w-4 text-[#CC922F]" />
                    Formules de déménagement
                  </a>
                </div>
              )}
            </div>
            <a
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-lg ${linkClass} text-base`}
            >
              Contact
            </a>
            <button
              onClick={handleGetQuote}
              className="sm:hidden mt-4 w-full bg-[#1c3957] hover:bg-[#2a4f6b] text-white font-['Poppins',sans-serif] font-semibold text-base py-3 px-4 rounded "
            >
              Devis en un clic
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
