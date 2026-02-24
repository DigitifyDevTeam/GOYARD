import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onGetQuote?: () => void;
}

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/solution", label: "Solution" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function Group685({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-7 w-40 lg:h-[32.103px] lg:w-[259.486px] ${className}`}>
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 260 33">
        <g id="Group 683">
          <path d="M11.4678 32H0V20.6484L8.59473 18.835L11.4678 32ZM32 32H16.6016L13.5029 17.7998L32 13.8975V32ZM8.11914 16.6514L0 18.3643V0H4.48633L8.11914 16.6514ZM32 11.6133L13.0264 15.6162L9.61914 0H32V11.6133Z" fill="var(--fill-0, #1C3957)" id="Subtract" />
          <g id="Group 727">
            <g id="Group 721">
              <path d="M68.0844 0.155904C70.6995 -0.415182 75.3757 0.641796 77.4364 2.36162C79.8882 4.4077 80.5577 7.72886 78.4262 10.2668C76.6223 12.4147 73.8454 13.142 71.1938 13.3907C68.7526 14.0147 63.7856 12.8339 61.902 11.2616C59.4414 9.20778 58.677 5.97196 60.7961 3.37816C62.6239 1.14109 65.3819 0.446376 68.0844 0.155904Z" fill="var(--fill-0, black)" id="Vector" />
              <path d="M68.4411 2.59702C68.4558 2.59469 68.4706 2.59264 68.4854 2.59086C77.1076 1.51104 80.1087 9.85916 70.7689 10.9598C68.0819 11.3311 63.2679 10.4574 62.8586 7.11901C62.754 6.2504 63.0021 5.37615 63.5471 4.69184C64.7135 3.20146 66.6812 2.81171 68.4411 2.59702Z" fill="var(--fill-0, white)" id="Vector_2" />
            </g>
            <g id="Group 724">
              <path d="M134.537 0.677561C138.029 0.666511 141.518 0.642213 145.01 0.692059C150.737 0.77382 154 6.5513 149.943 10.991C146.662 13.7846 138.957 12.9038 134.537 12.8913V0.677561Z" fill="var(--fill-0, black)" id="Vector_3" />
              <path d="M137.662 3.11301C140.126 3.11172 144.036 2.7878 146.235 3.56147C148.869 4.48808 149.363 7.31928 147.489 9.34369C145.267 10.9644 140.537 10.4777 137.662 10.4576V3.11301Z" fill="var(--fill-0, white)" id="Vector_4" />
            </g>
            <g id="Group 728">
              <path d="M116.291 0.67746L123.679 0.660232C126.879 0.648693 134.07 0.18105 131.78 6.25725C131.33 7.45232 129.271 8.06995 128.106 8.37544C128.716 8.97148 132.323 12.4064 132.455 12.8096L132.255 12.8912H128.27C126.902 11.4005 125.544 9.90118 124.195 8.3934H119.397V12.8912H116.291V0.67746Z" fill="var(--fill-0, black)" id="Vector_5" />
              <path d="M119.395 2.97681C121.398 2.95955 130.979 1.85794 128.54 5.64548C127.221 6.47277 121.281 6.14779 119.395 6.13801V2.97681Z" fill="var(--fill-0, white)" id="Vector_6" />
            </g>
            <path d="M48.7315 0.161904C51.6971 -0.159878 54.5077 0.533719 57.1993 1.70957C57.0099 2.18562 56.3237 3.41826 56.0577 3.92941C52.7453 2.38585 45.9178 1.35187 43.6705 5.29573C42.6521 7.08292 43.8395 9.27105 45.6286 10.0596C48.4664 11.3105 51.6921 11.0356 54.5836 10.0481L54.5732 8.39633C53.3825 8.40545 51.0016 8.48296 49.9146 8.33511C49.6931 7.96637 49.7582 7.73141 49.7414 7.2645C49.7365 6.85616 49.7627 6.60126 49.8117 6.19545C50.2038 5.83325 56.6667 5.98997 57.7119 5.99413V11.2716C55.7958 12.3691 53.6706 13.0519 51.4738 13.276C47.2347 13.6809 40.7049 12.4293 40.0348 7.20921C39.8645 5.88233 40.402 4.35758 41.2704 3.34021C43.1476 1.14087 45.9604 0.423982 48.7315 0.161904Z" fill="var(--fill-0, black)" id="Vector_7" />
            <g id="Group 722">
              <path d="M103.671 0.677453H106.848L114.878 12.8912H111.057L109.456 10.2009H106.866H100.968L99.3471 12.8912H95.6495L103.671 0.677453Z" fill="var(--fill-0, black)" id="Vector_8" />
              <path d="M105.159 3.19433C105.62 3.47545 107.74 7.30276 108.145 8.00567H105.428H102.27L105.159 3.19433Z" fill="var(--fill-0, white)" id="Vector_9" />
            </g>
            <path d="M78.8059 0.678413L83.2481 0.67735L88.9255 6.2341L94.6162 0.67735H98.8164C97.6367 1.73745 96.4508 2.86135 95.2826 3.9404L90.4556 8.44459V12.8911H87.1293V8.39894L78.8059 0.678413Z" fill="var(--fill-0, black)" id="Vector_10" />
          </g>
          <g id="Group 726">
            <path d="M65.6635 16.4162H69.3319L66.2512 18.3708C65.8675 18.0573 65.3028 17.6615 65.1016 17.2269C65.1749 16.7371 65.2381 16.8113 65.6635 16.4162Z" fill="var(--fill-0, black)" id="Vector_11" />
            <path d="M104.317 16.4162H107.985L104.904 18.3708C104.521 18.0573 103.956 17.6615 103.755 17.2269C103.828 16.7371 103.891 16.8113 104.317 16.4162Z" fill="var(--fill-0, black)" id="Vector_12" />
            <g id="Group 723">
              <path d="M40.0029 19.4335C43.4953 19.4224 46.9836 19.3981 50.4758 19.448C56.2029 19.5297 59.466 25.3072 55.4089 29.7469C52.1276 32.5406 44.4231 31.6597 40.0029 31.6472V19.4335Z" fill="var(--fill-0, black)" id="Vector_13" />
              <path d="M43.1276 21.8689C45.5916 21.8676 49.5019 21.5437 51.7011 22.3174C54.3351 23.244 54.8286 26.0752 52.9546 28.0996C50.7327 29.7204 46.0033 29.2336 43.1276 29.2135V21.8689Z" fill="var(--fill-0, white)" id="Vector_14" />
            </g>
            <path d="M76.3585 19.4335H80.6175L85.9197 28.2904L91.2263 19.4335H95.1648V31.6472H92.0884V26.9773V23.1842L87.0075 31.6472H84.5015L79.4306 23.2445V31.6472H76.3585V19.4335Z" fill="var(--fill-0, black)" id="Vector_15" />
            <path d="M188.149 19.4335H192.408L197.711 28.2904L203.017 19.4335H206.956V31.6472H203.879V26.9773V23.1842L198.798 31.6472H196.292L191.222 23.2445V31.6472H188.149V19.4335Z" fill="var(--fill-0, black)" id="Vector_16" />
            <path d="M159.53 18.918C162.496 18.5963 165.307 19.2899 167.998 20.4657C167.81 20.9418 167.123 22.1744 166.857 22.6855C163.545 21.142 156.717 20.108 154.469 24.0519C153.451 25.839 154.639 28.0272 156.428 28.8158C159.266 30.0666 162.492 29.7918 165.383 28.8042L165.373 27.1525C164.182 27.1616 161.801 27.2391 160.714 27.0912C160.493 26.7225 160.558 26.4875 160.54 26.0206C160.536 25.6123 160.562 25.3574 160.611 24.9516C161.003 24.5894 167.466 24.7461 168.511 24.7503V30.0277C166.596 31.1253 164.47 31.8081 162.273 32.0321C158.034 32.437 151.504 31.1855 150.834 25.9653C150.663 24.6385 151.202 23.1137 152.07 22.0963C153.946 19.897 156.76 19.1801 159.53 18.918Z" fill="var(--fill-0, black)" id="Vector_17" />
            <path d="M171.191 19.4335H185.341L185.339 21.8688H174.318V24.319H183.394V26.7209L178.008 26.7212H174.318V29.1931H185.791V31.6472H171.191V19.4335Z" fill="var(--fill-0, black)" id="Vector_18" />
            <path d="M209.845 19.4335H223.994L223.993 21.8688H212.971V24.319H222.047V26.7209L216.661 26.7212H212.971V29.1931H224.444V31.6472H209.845V19.4335Z" fill="var(--fill-0, black)" id="Vector_19" />
            <path d="M59.4046 19.4335H73.5536L73.5522 21.8688H62.5311V24.319H71.6066V26.7209L66.2211 26.7212H62.5311V29.1931H74.0034V31.6472H59.4046V19.4335Z" fill="var(--fill-0, black)" id="Vector_20" />
            <path d="M98.0539 19.4335H112.203L112.202 21.8688H101.181V24.319H110.256V26.7209L104.871 26.7212H101.181V29.1931H112.653V31.6472H98.0539V19.4335Z" fill="var(--fill-0, black)" id="Vector_21" />
            <path d="M226.803 19.4335H230.586C233.494 22.259 236.542 25.0886 239.488 27.8845V19.4335H242.593C242.591 20.6649 242.739 30.845 242.525 31.5389L242.202 31.6472H239.381C236.288 28.6397 233.045 25.6293 229.909 22.6536V31.6472H226.803V19.4335Z" fill="var(--fill-0, black)" id="Vector_22" />
            <path d="M115.012 19.4335H118.795C121.704 22.259 124.751 25.0886 127.697 27.8845V19.4335H130.802C130.801 20.6649 130.949 30.845 130.734 31.5389L130.411 31.6472H127.591C124.497 28.6397 121.254 25.6293 118.118 22.6536V31.6472H115.012V19.4335Z" fill="var(--fill-0, black)" id="Vector_23" />
            <g id="Group 725">
              <path d="M140.183 19.4334H143.36L151.391 31.6471H147.569L145.968 28.9568H143.379H137.48L135.86 31.6471H132.162L140.183 19.4334Z" fill="var(--fill-0, black)" id="Vector_24" />
              <path d="M141.676 21.9502C142.138 22.2314 144.257 26.0587 144.662 26.7616H141.945H138.787L141.676 21.9502Z" fill="var(--fill-0, white)" id="Vector_25" />
            </g>
            <path d="M244.027 19.4335H259.486V21.8892H253.368V25.3967V31.6472H250.144V21.8892H244.027V19.4335Z" fill="var(--fill-0, black)" id="Vector_26" />
          </g>
        </g>
      </svg>
    </div>
  );
}

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
          <div className="flex items-center justify-between h-14 lg:h-[56px] gap-4">
            {/* Logo + nav grouped so Accueil sits closer to logo */}
            <div className="flex items-center gap-6 lg:gap-20">
              <a href="/" className="flex-shrink-0" aria-label="Accueil">
                <Group685 />
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleGetQuote}
                className="hidden sm:flex bg-[#1c3957] hover:bg-[#2a4f6b] text-white font-['Poppins',sans-serif] font-semibold text-sm lg:text-base px-4 py-2.5 lg:px-5 lg:py-3 rounded transition-colors duration-200 capitalize"
              >
                obtenir un devis gratuit
              </button>
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
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <a href="/" onClick={() => setMobileMenuOpen(false)}>
              <Group685 className="scale-90 origin-left" />
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
              className="sm:hidden mt-4 w-full bg-[#1c3957] hover:bg-[#2a4f6b] text-white font-['Poppins',sans-serif] font-semibold text-base py-3 px-4 rounded capitalize"
            >
              obtenir un devis gratuit
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
