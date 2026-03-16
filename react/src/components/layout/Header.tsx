import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  onGetQuote?: () => void;
}

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/solution", label: "Solution" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/tarification", label: "Tarification" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ onGetQuote }: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetQuote = () => {
    setMobileMenuOpen(false);
    if (onGetQuote) {
      onGetQuote();
    } else {
      navigate("/tunnel/mes-coordonnees");
    }
  };

  const linkClass = "font-['Poppins',sans-serif] font-semibold text-[#191919] hover:text-[#CC922F] transition-colors text-sm lg:text-[15px] py-2 px-4 lg:px-5 rounded-md hover:bg-slate-50/80";

  return (
    <>
      {/* Top bar: logo + desktop nav + CTA / hamburger */}
      <header className="w-full bg-white shadow-[0px_6px_16px_0px_rgba(25,25,25,0.06)]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
          <div className="flex items-center justify-between h-32 lg:h-30 gap-4">
            {/* Logo + nav grouped so Accueil sits closer to logo */}
            <div className="flex items-center gap-6 lg:gap-20">
              <a href="/" className="flex-shrink-0 py-4" aria-label="Accueil">
                <img
                  src="/logo.svg"
                  alt="BrasenPlus"
                  className="h-32 w-auto lg:h-40"
                />
              </a>
              {/* Desktop nav - hidden on mobile */}
              <nav className="hidden lg:flex items-center gap-12 xl:gap-16 2xl:gap-20 font-[600] text-[#191919]" aria-label="Navigation principale">
                {navLinks.map(({ href, label }) => (
                  <a key={href} href={href} className={linkClass}>
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* CTA desktop / Hamburger mobile */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleGetQuote}
                className="hidden sm:flex bg-[#1c3957] hover:bg-[#2a4f6b] text-white font-['Poppins',sans-serif] font-semibold text-sm lg:text-base px-4 py-2.5 lg:px-5 lg:py-3 rounded transition-colors duration-200 whitespace-nowrap"
              >
                Devis en un clic
              </button>
              <a
                href="tel:+33742366424"
                className="hidden sm:flex items-center gap-2 text-[#1c3957] hover:text-[#CC922F] font-['Poppins',sans-serif] font-semibold text-sm lg:text-base whitespace-nowrap transition-colors"
                aria-label="Appeler le 07 42 36 64 24"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>07 42 36 64 24</span>
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
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg ${linkClass} text-base`}
              >
                {label}
              </a>
            ))}
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
