import { Phone } from "lucide-react";
import {
  CONTACT_PHONE_AREA,
  CONTACT_PHONE_ARIA,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_REST,
} from "../constants/contactPhone";
import { cn } from "../lib/utils";

type ContactPhoneVariant = "header" | "cta" | "hero" | "inline";

type ContactPhoneLinkProps = Readonly<{
  variant?: ContactPhoneVariant;
  className?: string;
}>;

export function ContactPhoneLink({ variant = "header", className }: ContactPhoneLinkProps) {
  const isCta = variant === "cta";
  const isHero = variant === "hero";
  const isInline = variant === "inline";

  const iconWrapClass = cn(
    "flex shrink-0 items-center justify-center rounded-full transition-colors duration-300",
    isHero &&
      "h-5 w-5 bg-[#CC922F] text-white group-hover:bg-[#1c3957] group-hover:text-white",
    isCta && "h-9 w-9 bg-white/15 text-white group-hover:bg-[#CC922F] group-hover:text-white",
    (variant === "header" || isInline) &&
      "h-7 w-7 bg-[#CC922F]/15 text-[#CC922F] group-hover:bg-[#CC922F] group-hover:text-white",
  );

  const iconClass = cn(
    isHero && "h-3 w-3",
    isInline && "h-3.5 w-3.5",
    !isHero && !isInline && "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]",
  );

  const numberClass = cn(
    "tabular-nums tracking-[0.04em]",
    !isHero && "font-bold",
    isHero && "text-[14px] sm:text-[15px] font-semibold tracking-tight",
    isInline && "text-sm",
    isCta && "text-white text-base sm:text-lg",
    variant === "header" &&
      "text-[#1c3957] text-base laptop:text-sm desktop:text-lg min-[1920px]:text-xl",
  );

  const areaClass = isCta ? "text-[#FBBF24]" : "text-[#CC922F]";
  const restClass = isCta
    ? "text-white"
    : isHero
      ? "text-[#1c3957]"
      : "text-[#1c3957] group-hover:text-[#CC922F] transition-colors duration-300";

  return (
    <a
      href={CONTACT_PHONE_HREF}
      className={cn(
        "group relative inline-flex items-center rounded-full font-['Poppins',sans-serif] font-semibold whitespace-nowrap",
        "transition-[background-color,transform,box-shadow] duration-300 ease-out",
        !isHero && "hover:scale-[1.01] active:scale-[0.995]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2",
        "motion-reduce:animate-none motion-reduce:hover:scale-100",
        isHero && [
          "gap-2 px-4 py-2 sm:px-5 sm:py-2.5",
          "bg-white text-[#1c3957]",
          "border border-[#CC922F]",
          "shadow-lg shadow-black/20 backdrop-blur-sm",
          "hover:bg-[#FFF8EB] hover:border-[#b88329]",
          "animate-phone-attention-hero",
        ],
        isCta && [
          "min-h-[3.75rem] gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 text-white",
          "border border-white/50 bg-white/10 backdrop-blur-md",
          "hover:bg-white/20 hover:border-white/70",
          "animate-phone-attention-cta",
        ],
        isInline && [
          "gap-2.5 px-4 py-2.5 text-[#1c3957]",
          "border border-[#CC922F]/35 bg-gradient-to-r from-[#CC922F]/10 via-white to-[#1c3957]/5",
          "hover:border-[#CC922F]/55 hover:from-[#CC922F]/15",
          "animate-phone-attention",
        ],
        variant === "header" && [
          "gap-3 px-4 py-2.5 laptop:gap-2 laptop:px-3 laptop:py-2 text-[#1c3957]",
          "border border-[#CC922F]/35 bg-gradient-to-r from-[#CC922F]/10 via-white to-[#1c3957]/5",
          "hover:border-[#CC922F]/55 hover:from-[#CC922F]/15",
          "animate-phone-attention",
        ],
        className,
      )}
      aria-label={CONTACT_PHONE_ARIA}
    >
      <span className={iconWrapClass} aria-hidden>
        <Phone className={iconClass} strokeWidth={2.25} />
      </span>

      <span
        className={cn(
          "flex min-w-0 leading-tight items-center gap-2",
          isCta && "flex-row flex-wrap sm:flex-nowrap items-center gap-x-2 gap-y-0.5",
        )}
      >
        {isHero ? (
          <span className="flex items-center gap-1.5 min-w-0 leading-none">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-[#CC922F]">
              Appelez-nous
            </span>
            <span className={numberClass}>
              <span className={areaClass}>{CONTACT_PHONE_AREA}</span>
              <span className={restClass}> {CONTACT_PHONE_REST}</span>
            </span>
          </span>
        ) : (
          <>
            {isCta && (
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-white/75 shrink-0">
                Appelez-nous
              </span>
            )}
            <span className={numberClass}>
              <span className={areaClass}>{CONTACT_PHONE_AREA}</span>
              <span className={restClass}> {CONTACT_PHONE_REST}</span>
            </span>
          </>
        )}
      </span>
    </a>
  );
}
