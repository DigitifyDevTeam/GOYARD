import { Phone, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

export default function StickyContactButtons() {
  // Central contact number used across the site.
  const phoneE164 = "+33 1 89 70 33 24";
  const telHref = `tel:${phoneE164}`;
  const whatsappNumberDigits = phoneE164
    .split("")
    .filter((ch) => ch >= "0" && ch <= "9")
    .join("");
  const whatsappHref = `https://wa.me/+33746326678`;

  const buttonClassName =
    "w-12 h-12 rounded-full bg-[#1c3957] hover:bg-[#2a4f6b] text-white shadow-lg border border-white/10 transition-colors flex items-center justify-center z-60";

  const iconClassName = "w-5 h-5";

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-3">
      <a
        href={telHref}
        className={`${buttonClassName} pointer-events-auto`}
        aria-label="Appeler"
      >
        <Phone className={iconClassName} />
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClassName} pointer-events-auto bg-[#1f7a3a] hover:bg-[#1a6a33]`}
        aria-label="WhatsApp"
      >
        <span className="font-['Poppins',sans-serif] font-semibold text-[13px] tracking-[0.02em]">
          WA
        </span>
      </a>

      <Link
        to="/tunnel/mes-coordonnees"
        className={`${buttonClassName} pointer-events-auto`}
        aria-label="Demander un devis"
      >
        <Calculator className={iconClassName} />
      </Link>
    </div>
  );
}

