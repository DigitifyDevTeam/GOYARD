import { Phone, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_PHONE_ARIA, CONTACT_PHONE_HREF } from "../constants/contactPhone";
import { EXTERNAL_LINK_REL } from "../constants/externalLink";

/** WhatsApp sticky button — unchanged; separate from the main call line */
const STICKY_WHATSAPP_E164 = "+33746326678";

export default function StickyContactButtons() {
  const telHref = CONTACT_PHONE_HREF;
  const whatsappHref = `https://wa.me/${STICKY_WHATSAPP_E164.replace(/\D/g, "")}`;

  const buttonClassName =
    "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1c3957] hover:bg-[#2a4f6b] text-white shadow-lg border border-white/10 transition-colors flex items-center justify-center";

  const iconClassName = "w-4 h-4 sm:w-5 sm:h-5";

  return (
    <div className="fixed right-3 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-[60] flex flex-col gap-3">
      <a
        href={telHref}
        className={`${buttonClassName} pointer-events-auto`}
        aria-label={CONTACT_PHONE_ARIA}
      >
        <Phone className={iconClassName} />
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel={EXTERNAL_LINK_REL}
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

