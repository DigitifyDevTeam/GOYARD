import { cn } from "../lib/utils";
import { EXTERNAL_LINK_REL } from "../constants/externalLink";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?hl=fr-TN&gl=tn&q=Guivarche+D%C3%A9m%C3%A9nagement,+25+Rue+de+C%C3%AEteaux,+75012+Paris,+France&ludocid=449127112689032564&lsig=AB86z5WRT9msHEVSPtou8m9KcU8X#lrd=0x47e67304c6ac24e3:0x63b9ebabad39d74,3";

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/guivarchedemenagement.fr";

const CLIENT_LOGOS = [
  { src: "/logos/Dior_Logo.svg.png", alt: "Dior" },
  { src: "/logos/Givenchy.png", alt: "Givenchy" },
  { src: "/logos/sephora.svg", alt: "Sephora" },
  { src: "/logos/Fedex-logo.png", alt: "FedEx" },
  { src: "/logos/Hilton.png", alt: "Hilton", scale: 1.35 },
  { src: "/logos/sorbonne.svg", alt: "Sorbonne Université", scale: 0.82 },
] as const;

function TrustpilotStarIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg className={cn("shrink-0", className)} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="#00B67A"
        d="M12 2.5l2.68 5.82 6.32.92-4.57 4.46 1.08 6.3L12 17.77l-5.51 2.9 1.08-6.3-4.57-4.46 6.32-.92L12 2.5z"
      />
    </svg>
  );
}

function GoogleGIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function HeroTrustCard() {
  return (
    <div className="w-full max-w-[720px] rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:p-7 xl:p-8">
      <div className="flex items-center justify-center gap-8 border-b border-slate-100 pb-6 sm:gap-12">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel={EXTERNAL_LINK_REL}
          className="flex items-center gap-3 transition hover:opacity-90"
          aria-label="Google 5 sur 5"
        >
          <GoogleGIcon className="h-10 w-10 xl:h-11 xl:w-11" />
          <div>
            <p className="font-['Poppins',sans-serif] text-base font-bold text-[#1C3957] xl:text-lg">Google 5/5</p>
            <p className="text-[#CC922F] text-base leading-none xl:text-lg" aria-hidden>
              ★★★★★
            </p>
          </div>
        </a>
        <div className="h-12 w-px bg-slate-200" aria-hidden />
        <a
          href={TRUSTPILOT_URL}
          target="_blank"
          rel={EXTERNAL_LINK_REL}
          className="flex items-center gap-3 transition hover:opacity-90"
          aria-label="Trustpilot 4,8 sur 5"
        >
          <TrustpilotStarIcon className="h-10 w-10 xl:h-11 xl:w-11" />
          <div>
            <p className="font-['Poppins',sans-serif] text-base font-bold text-[#1C3957] xl:text-lg">Trustpilot 4,8/5</p>
            <p className="text-[#00B67A] text-base leading-none xl:text-lg" aria-hidden>
              ★★★★★
            </p>
          </div>
        </a>
      </div>
      <p className="mt-5 text-center font-['Poppins',sans-serif] text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[13px]">
        Ils nous ont fait confiance
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 grayscale opacity-85 sm:gap-x-8">
        {CLIENT_LOGOS.map((logo) => (
          <img
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className="h-8 w-auto max-w-[96px] object-contain sm:h-9 sm:max-w-[104px]"
            style={"scale" in logo && logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroTrustCardMobile() {
  return (
    <div className="mt-4 mb-2 rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.08)]">
      <div className="flex items-stretch justify-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel={EXTERNAL_LINK_REL}
          className="flex flex-1 flex-col items-center gap-1.5 px-2 transition hover:opacity-90"
          aria-label="Google 5 sur 5"
        >
          <GoogleGIcon className="h-9 w-9" />
          <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#1C3957]">Google 5/5</p>
          <p className="text-[#CC922F] text-sm leading-none" aria-hidden>
            ★★★★★
          </p>
        </a>
        <div className="mx-3 w-px self-stretch bg-slate-200" aria-hidden />
        <a
          href={TRUSTPILOT_URL}
          target="_blank"
          rel={EXTERNAL_LINK_REL}
          className="flex flex-1 flex-col items-center gap-1.5 px-2 transition hover:opacity-90"
          aria-label="Trustpilot 4,8 sur 5"
        >
          <TrustpilotStarIcon className="h-9 w-9" />
          <p className="font-['Poppins',sans-serif] text-sm font-bold text-[#1C3957]">Trustpilot 4,8/5</p>
          <p className="text-[#00B67A] text-sm leading-none" aria-hidden>
            ★★★★★
          </p>
        </a>
      </div>
    </div>
  );
}
