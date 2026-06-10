import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Building2,
  Calendar,
  Clock,
  Handshake,
  Hash,
  Layers,
  Mail,
  Map,
  MapPin,
  NotebookPen,
  Package,
  Phone,
  ShieldCheck,
  Tag,
  User,
  Users,
} from "lucide-react";
import { FormDataManager } from "../../utils/formDataManager";
import { cn } from "../../lib/utils";
import { EXTERNAL_LINK_REL } from "../../constants/externalLink";
import {
  CONTACT_PHONE_AREA,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_REST,
} from "../../constants/contactPhone";
import type { LandingHeroConfig, LandingHeroLocationPart } from "./landingHeroConfig";

const DEVIS_CONFIRMATION_PATH = "/tunnel/devis/confirmation";

const PARIS_GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?hl=fr-TN&gl=tn&q=Guivarche+D%C3%A9m%C3%A9nagement,+25+Rue+de+C%C3%AEteaux,+75012+Paris,+France&ludocid=449127112689032564&lsig=AB86z5WRT9msHEVSPtou8m9KcU8X#lrd=0x47e67304c6ac24e3:0x63b9ebabad39d74,3";

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/guivarchedemenagement.fr";

const ETAGE_OPTIONS = ["RDC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const ASCENSEUR_OPTIONS = ["Non", "Oui 2 personnes", "Oui 4 personnes", "Oui 6 personnes"];

type ParisCompactDevisFormState = {
  nom: string;
  tel_portable: string;
  email: string;
  adresse_depart: string;
  cp_depart: string;
  etage_depart: string;
  ascenseur_depart: string;
  adresse_arrivee: string;
  cp_arrivee: string;
  etage_arrivee: string;
  ascenseur_arrivee: string;
  volume: string;
  superficie: string;
  date_demenagement: string;
  info_complementaire: string;
};

type ParisCompactDevisFieldKey = keyof ParisCompactDevisFormState;

function getParisCompactDevisFieldErrors(
  form: ParisCompactDevisFormState,
): Partial<Record<ParisCompactDevisFieldKey, boolean>> {
  const hasText = (value: string) => value.trim() !== "";
  const volumeSuperficieMissing = !hasText(form.volume) && !hasText(form.superficie);

  return {
    nom: !hasText(form.nom),
    tel_portable: !hasText(form.tel_portable),
    email: !hasText(form.email),
    date_demenagement: form.date_demenagement === "",
    adresse_depart: !hasText(form.adresse_depart),
    cp_depart: !hasText(form.cp_depart),
    etage_depart: form.etage_depart === "",
    ascenseur_depart: form.ascenseur_depart === "",
    volume: volumeSuperficieMissing,
    superficie: volumeSuperficieMissing,
    adresse_arrivee: !hasText(form.adresse_arrivee),
    cp_arrivee: !hasText(form.cp_arrivee),
    etage_arrivee: form.etage_arrivee === "",
    ascenseur_arrivee: form.ascenseur_arrivee === "",
  };
}

function hasParisCompactDevisFieldErrors(errors: Partial<Record<ParisCompactDevisFieldKey, boolean>>): boolean {
  return Object.values(errors).some(Boolean);
}

const HERO_BENEFITS = [
  { icon: Users, label: "Équipe 100% salariée" },
  { icon: Tag, label: "Prix fixe garanti" },
  { icon: ShieldCheck, label: "0 litige en 2025" },
  { icon: Clock, label: "Réponse immédiate" },
] as const;

/** Legibility on hero photo — black glow on glyphs, not a background frame. */
const HERO_TEXT_SHADOW =
  "[text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_2px_14px_rgba(0,0,0,0.75),0_0_24px_rgba(0,0,0,0.45)]";

const CLIENT_LOGOS = [
  { src: "/logos/Dior_Logo.svg.png", alt: "Dior" },
  { src: "/logos/Givenchy.png", alt: "Givenchy" },
  { src: "/logos/sephora.svg", alt: "Sephora" },
  { src: "/logos/Fedex-logo.png", alt: "FedEx" },
  { src: "/logos/Hilton.png", alt: "Hilton", scale: 1.35 },
  { src: "/logos/sorbonne.svg", alt: "Sorbonne Université", scale: 0.82 },
] as const;

const MOBILE_FOOTER_BENEFITS = [
  { icon: Users, label: "Équipe 100% salariée" },
  { icon: ShieldCheck, label: "0 litige 2025" },
  { icon: Handshake, label: "Prix fixe garanti" },
  { icon: Map, label: "France entière" },
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

function ParisLpHeaderMobile() {
  return (
    <header className="w-full border-b border-slate-100/80 bg-white">
      <div className="mx-auto flex h-[4.5rem] max-w-[1920px] items-center justify-between px-4">
        <a
          href="/"
          className="shrink-0 rounded-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2"
          aria-label="Retour à l'accueil — Guivarche Déménagement"
        >
          <img src="/logo.svg" alt="Guivarche Déménagement" className="h-11 w-auto" />
        </a>
        <a
          href={CONTACT_PHONE_HREF}
          className="inline-flex items-center gap-1.5 font-['Poppins',sans-serif] text-sm font-bold text-[#CC922F] sm:text-[15px]"
          aria-label="Appeler le 01 89 70 33 24"
        >
          <Phone className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
          <span className="tabular-nums tracking-tight">
            {CONTACT_PHONE_AREA} {CONTACT_PHONE_REST}
          </span>
        </a>
      </div>
    </header>
  );
}

function ParisLpHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-100/80">
      <div className="mx-auto flex h-[84px] max-w-[1920px] items-center justify-between px-6 xl:px-10">
        <a
          href="/"
          className="shrink-0 rounded-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2"
          aria-label="Retour à l'accueil — Guivarche Déménagement"
        >
          <img src="/logo.svg" alt="Guivarche Déménagement" className="h-[4.25rem] w-auto sm:h-[4.5rem]" />
        </a>
        <a
          href={CONTACT_PHONE_HREF}
          className="group inline-flex items-center gap-2.5 font-['Poppins',sans-serif] font-bold text-[#1C3957] transition hover:text-[#CC922F]"
          aria-label="Appeler le 01 89 70 33 24"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CC922F] text-white transition group-hover:bg-[#1C3957]">
            <Phone className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="text-lg tracking-tight tabular-nums">
            <span className="text-[#CC922F]">{CONTACT_PHONE_AREA}</span> {CONTACT_PHONE_REST}
          </span>
        </a>
      </div>
    </header>
  );
}

function IconField({
  icon: Icon,
  className,
  children,
  showObligatoire = false,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
  showObligatoire?: boolean;
}>) {
  return (
    <div className={cn("relative min-w-0 w-full", className)}>
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#1C3957]/60"
        aria-hidden
      />
      {showObligatoire ? (
        <span className="pointer-events-none absolute left-11 top-1/2 z-[1] -translate-y-1/2 font-['Poppins',sans-serif] text-[15px] text-red-500">
          obligatoire
        </span>
      ) : null}
      {children}
    </div>
  );
}

const fieldErrorCls = "border-red-500 placeholder:text-red-500";

const fieldCls =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-3.5 text-[15px] text-[#1C3957] placeholder:text-slate-400 focus:border-[#CC922F] focus:outline-none focus:ring-2 focus:ring-[#CC922F]/20 font-['Poppins',sans-serif] transition";

const dateFieldCls = (hasValue: boolean, isMobile: boolean) =>
  cn(
    fieldCls,
    "lp-form-date",
    hasValue ? "text-[#1C3957]" : "text-[#64748b]",
    isMobile && "min-h-[3rem] py-3.5 pl-11 pr-12 text-base leading-normal",
  );

function MobileLocationLine({ parts }: Readonly<{ parts: LandingHeroLocationPart[] }>) {
  if (parts.length === 0) return null;

  return (
    <p
      className={cn(
        "mt-4 font-['Poppins',sans-serif] text-sm font-medium text-white sm:text-[15px]",
        HERO_TEXT_SHADOW,
      )}
    >
      {parts.map((part, index) => (
        <span key={part.label}>
          {index > 0 ? <span className="mx-1.5 text-white/90">•</span> : null}
          <span className={part.accent ? "text-[#F5B84A]" : undefined}>{part.label}</span>
        </span>
      ))}
    </p>
  );
}

function HeroPriceBanner({
  text,
  variant = "mobile",
  className,
}: Readonly<{
  text: string;
  variant?: "mobile" | "desktop";
  className?: string;
}>) {
  return (
    <p
      className={cn(
        "w-full bg-[#E10600] py-2.5 text-center font-['Poppins',sans-serif] font-extrabold leading-tight text-white",
        "whitespace-nowrap",
        variant === "mobile"
          ? "-mx-5 mt-3 w-[calc(100%+2.5rem)] px-3 text-[15px] sm:text-base"
          : "mt-3 px-4 text-lg xl:text-xl",
        className,
      )}
    >
      {text}
    </p>
  );
}

function ParisCompactDevisForm({
  config,
  variant = "desktop",
}: Readonly<{ config: LandingHeroConfig; variant?: "desktop" | "mobile" }>) {
  const isMobile = variant === "mobile";
  const fieldId = (name: string) =>
    isMobile ? `${config.fieldSlug}-m-${name}` : `${config.fieldSlug}-${name}`;
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    tel_portable: "",
    email: "",
    adresse_depart: "",
    cp_depart: "",
    etage_depart: "",
    ascenseur_depart: "",
    adresse_arrivee: "",
    cp_arrivee: "",
    etage_arrivee: "",
    ascenseur_arrivee: "",
    volume: "",
    superficie: "",
    date_demenagement: "",
    info_complementaire: "",
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const fieldErrors = showErrors ? getParisCompactDevisFieldErrors(form) : {};
  const err = (field: ParisCompactDevisFieldKey) => !!fieldErrors[field];
  const fieldClass = (field: ParisCompactDevisFieldKey, base = fieldCls) => cn(base, err(field) && fieldErrorCls);
  const placeholder = (field: ParisCompactDevisFieldKey, base: string) => (err(field) ? "obligatoire" : base);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = getParisCompactDevisFieldErrors(form);
    if (hasParisCompactDevisFieldErrors(errors)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setSubmitting(true);
    try {
      const ascenseurMap: Record<string, string> = {
        Non: "Non",
        "Oui 2 personnes": "2-3 personnes",
        "Oui 4 personnes": "3-4 personnes",
        "Oui 6 personnes": "4-6 personnes",
      };
      const pathname = (
        config.entryPage?.trim() ||
        (typeof window !== "undefined" ? window.location.pathname : "") ||
        ""
      ).trim();

      const payload = {
        nom: form.nom,
        prenom: "",
        email: form.email,
        phone: form.tel_portable,
        date_demenagement: form.date_demenagement,
        adresse_depart: form.adresse_depart,
        cp_depart: form.cp_depart,
        etage_depart: form.etage_depart || "RDC",
        ascenseur_depart: ascenseurMap[form.ascenseur_depart] || "Non",
        adresse_arrivee: form.adresse_arrivee,
        cp_arrivee: form.cp_arrivee,
        etage_arrivee: form.etage_arrivee || "RDC",
        ascenseur_arrivee: ascenseurMap[form.ascenseur_arrivee] || "Non",
        options_depart: {
          info_complementaire: form.info_complementaire,
          volume: form.volume,
          superficie: form.superficie,
          type_client: "Particulier",
          cp_depart: form.cp_depart,
        },
        options_arrivee: {
          cp_arrivee: form.cp_arrivee,
        },
        ...(pathname ? { entry_page: pathname } : {}),
      };

      const res = await fetch("/api/demenagement/client-info/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        const clientId = data?.data?.id;
        if (clientId) {
          FormDataManager.markFormSubmitted(clientId, data?.access_token);
        } else {
          FormDataManager.markFormSubmitted(undefined, data?.access_token);
        }
        navigate(DEVIS_CONFIRMATION_PATH);
      } else {
        alert(data?.message || "Une erreur est survenue.");
      }
    } catch {
      alert("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full bg-white",
        isMobile
          ? "px-4 pb-6 pt-4"
          : "rounded-2xl border border-slate-100 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.12)] xl:p-9",
      )}
    >
      <h2
        className={cn(
          "text-center font-['Poppins',sans-serif] font-extrabold leading-snug text-[#1C3957]",
          isMobile ? "text-[1.2rem]" : "text-[1.5rem] xl:text-[1.65rem]",
        )}
      >
        {config.formTitle}
      </h2>
      <p
        className={cn(
          "mt-0.5 text-center font-['Poppins',sans-serif] font-extrabold text-[#CC922F]",
          isMobile ? "text-[1.2rem]" : "text-[1.5rem] xl:text-[1.65rem]",
        )}
      >
        immédiatement
      </p>

      <div className={cn("space-y-3", isMobile ? "mt-5" : "mt-6")}>
        <div className={cn("grid grid-cols-2 gap-3", isMobile && "[&>*]:min-w-0")}>
          <IconField icon={User} showObligatoire={err("nom") && !form.nom}>
            <input
              id={fieldId("nom")}
              type="text"
              value={form.nom}
              onChange={set("nom")}
              placeholder={placeholder("nom", "Nom")}
              className={fieldClass("nom")}
              aria-invalid={err("nom")}
            />
          </IconField>
          <IconField icon={Phone} showObligatoire={err("tel_portable") && !form.tel_portable}>
            <input
              id={fieldId("tel")}
              type="tel"
              value={form.tel_portable}
              onChange={set("tel_portable")}
              placeholder={placeholder("tel_portable", "Téléphone")}
              className={fieldClass("tel_portable")}
              aria-invalid={err("tel_portable")}
            />
          </IconField>
        </div>

        <div className={cn("grid grid-cols-2 gap-3", isMobile && "[&>*]:min-w-0")}>
          <IconField icon={Mail} showObligatoire={err("email") && !form.email}>
            <input
              id={fieldId("mail")}
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder={placeholder("email", "Mail")}
              className={fieldClass("email")}
              autoComplete="email"
              aria-invalid={err("email")}
            />
          </IconField>
          <IconField icon={Calendar} showObligatoire={err("date_demenagement") && !form.date_demenagement}>
            <input
              id={fieldId("date")}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.date_demenagement}
              onChange={set("date_demenagement")}
              className={fieldClass(
                "date_demenagement",
                dateFieldCls(!!form.date_demenagement, isMobile),
              )}
              style={{ colorScheme: "light" }}
              aria-label="Date prévue de déménagement"
              aria-invalid={err("date_demenagement")}
            />
          </IconField>
        </div>

        <IconField icon={MapPin} showObligatoire={err("adresse_depart") && !form.adresse_depart}>
          <input
            id={fieldId("adr-dep")}
            type="text"
            value={form.adresse_depart}
            onChange={set("adresse_depart")}
            placeholder={placeholder("adresse_depart", "Adresse de départ")}
            className={fieldClass("adresse_depart")}
            aria-invalid={err("adresse_depart")}
          />
        </IconField>

        <IconField icon={Hash} showObligatoire={err("cp_depart") && !form.cp_depart}>
          <input
            id={fieldId("cp-dep")}
            type="text"
            inputMode="numeric"
            value={form.cp_depart}
            onChange={set("cp_depart")}
            placeholder={placeholder("cp_depart", "Code postal de départ")}
            className={fieldClass("cp_depart")}
            autoComplete="postal-code"
            aria-invalid={err("cp_depart")}
          />
        </IconField>

        <div className="grid grid-cols-2 gap-3">
          <IconField icon={Building2} showObligatoire={err("etage_depart") && !form.etage_depart}>
            <select
              id={fieldId("etage-dep")}
              value={form.etage_depart}
              onChange={set("etage_depart")}
              className={cn(
                fieldClass("etage_depart"),
                "appearance-none",
                !form.etage_depart && !err("etage_depart") && "text-slate-400",
              )}
              aria-invalid={err("etage_depart")}
            >
              <option value="" disabled>
                Étage
              </option>
              {ETAGE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o === "RDC" ? "RDC" : `Étage ${o}`}
                </option>
              ))}
            </select>
          </IconField>
          <IconField icon={ArrowUpDown} showObligatoire={err("ascenseur_depart") && !form.ascenseur_depart}>
            <select
              id={fieldId("asc-dep")}
              value={form.ascenseur_depart}
              onChange={set("ascenseur_depart")}
              className={cn(
                fieldClass("ascenseur_depart"),
                "appearance-none",
                !form.ascenseur_depart && !err("ascenseur_depart") && "text-slate-400",
              )}
              aria-invalid={err("ascenseur_depart")}
            >
              <option value="" disabled>
                Ascenseur
              </option>
              {ASCENSEUR_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </IconField>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
          <IconField icon={Package} showObligatoire={err("volume") && !form.volume}>
            <input
              id={fieldId("volume")}
              type="text"
              value={form.volume}
              onChange={set("volume")}
              placeholder={placeholder("volume", "Volume (m3)")}
              className={fieldClass("volume")}
              aria-invalid={err("volume")}
            />
          </IconField>
          <span className="font-['Poppins',sans-serif] text-sm font-semibold text-slate-400">ou</span>
          <IconField icon={Layers} showObligatoire={err("superficie") && !form.superficie}>
            <input
              id={fieldId("superficie")}
              type="text"
              value={form.superficie}
              onChange={set("superficie")}
              placeholder={placeholder("superficie", "Superficie (m2)")}
              className={fieldClass("superficie")}
              aria-invalid={err("superficie")}
            />
          </IconField>
        </div>

        <IconField icon={MapPin} showObligatoire={err("adresse_arrivee") && !form.adresse_arrivee}>
          <input
            id={fieldId("adr-arr")}
            type="text"
            value={form.adresse_arrivee}
            onChange={set("adresse_arrivee")}
            placeholder={placeholder("adresse_arrivee", "Adresse d'arrivée")}
            className={fieldClass("adresse_arrivee")}
            aria-invalid={err("adresse_arrivee")}
          />
        </IconField>

        <IconField icon={Hash} showObligatoire={err("cp_arrivee") && !form.cp_arrivee}>
          <input
            id={fieldId("cp-arr")}
            type="text"
            inputMode="numeric"
            value={form.cp_arrivee}
            onChange={set("cp_arrivee")}
            placeholder={placeholder("cp_arrivee", "Code postal d'arrivée")}
            className={fieldClass("cp_arrivee")}
            autoComplete="postal-code"
            aria-invalid={err("cp_arrivee")}
          />
        </IconField>

        <div className="grid grid-cols-2 gap-3">
          <IconField icon={Building2} showObligatoire={err("etage_arrivee") && !form.etage_arrivee}>
            <select
              id={fieldId("etage-arr")}
              value={form.etage_arrivee}
              onChange={set("etage_arrivee")}
              className={cn(
                fieldClass("etage_arrivee"),
                "appearance-none",
                !form.etage_arrivee && !err("etage_arrivee") && "text-slate-400",
              )}
              aria-invalid={err("etage_arrivee")}
            >
              <option value="" disabled>
                Étage
              </option>
              {ETAGE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o === "RDC" ? "RDC" : `Étage ${o}`}
                </option>
              ))}
            </select>
          </IconField>
          <IconField icon={ArrowUpDown} showObligatoire={err("ascenseur_arrivee") && !form.ascenseur_arrivee}>
            <select
              id={fieldId("asc-arr")}
              value={form.ascenseur_arrivee}
              onChange={set("ascenseur_arrivee")}
              className={cn(
                fieldClass("ascenseur_arrivee"),
                "appearance-none",
                !form.ascenseur_arrivee && !err("ascenseur_arrivee") && "text-slate-400",
              )}
              aria-invalid={err("ascenseur_arrivee")}
            >
              <option value="" disabled>
                Ascenseur
              </option>
              {ASCENSEUR_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </IconField>
        </div>

        <IconField icon={NotebookPen}>
          <textarea
            id={fieldId("info")}
            value={form.info_complementaire}
            onChange={set("info_complementaire")}
            placeholder="Informations complémentaires"
            rows={3}
            className={cn(fieldCls, "resize-none py-3")}
          />
        </IconField>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "w-full rounded-xl bg-[#CC922F] px-4 font-['Poppins',sans-serif] font-extrabold text-[#1C3957] shadow-[0_10px_28px_rgba(204,146,47,0.35)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60",
          isMobile ? "mt-5 py-3.5 text-[15px] leading-snug" : "mt-6 py-4 text-base",
        )}
      >
        {submitting ? "Envoi en cours..." : isMobile ? config.formCtaMobile : config.formCtaDesktop}
      </button>
    </form>
  );
}

function ParisHeroTrustCard() {
  return (
    <div className="w-full max-w-[720px] rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:p-7 xl:p-8">
      <div className="flex items-center justify-center gap-8 border-b border-slate-100 pb-6 sm:gap-12">
        <a
          href={PARIS_GOOGLE_REVIEWS_URL}
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

function ParisHeroTrustCardMobile() {
  return (
    <div className="mt-4 mb-2 rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-[0_6px_24px_rgba(15,23,42,0.08)]">
      <div className="flex items-stretch justify-center">
        <a
          href={PARIS_GOOGLE_REVIEWS_URL}
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

function ParisMobileBenefitsBar() {
  return (
    <div className="border-t border-slate-100 bg-white px-3 py-5">
      <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-4">
        {MOBILE_FOOTER_BENEFITS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-9 w-9 items-center justify-center text-[#1C3957]">
              <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="font-['Poppins',sans-serif] text-[11px] font-semibold leading-tight text-[#1C3957] sm:text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mobile hero — stacked layout (regional LP mockup). */
export function ParisLandingHeroMobile({ config }: Readonly<{ config: LandingHeroConfig }>) {
  const showPriceBanner =
    config.showPriceBanner !== false && config.mobilePriceBanner.trim().length > 0;

  return (
    <div className="lg:hidden">
      <ParisLpHeaderMobile />

      <section className="relative min-h-[min(34vh,260px)] overflow-hidden">
        <img
          src="/gallery/hero.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[70%_40%]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="absolute inset-0 bg-[#1C3957]/28" aria-hidden />

        <div className="relative z-10 flex min-h-[min(34vh,260px)] flex-col items-center justify-center px-5 py-6 text-center">
          <h1
            className={cn(
              "font-['Poppins',sans-serif] text-[1.65rem] font-extrabold leading-tight text-white sm:text-[1.85rem]",
              HERO_TEXT_SHADOW,
            )}
          >
            {config.heroLine1Prefix}
            <span className={cn("text-[#F5B84A]", HERO_TEXT_SHADOW)}>{config.heroLine1Accent}</span>
          </h1>
          {showPriceBanner && !config.mobilePriceBannerAfterDevis ? (
            <HeroPriceBanner text={config.mobilePriceBanner} variant="mobile" />
          ) : null}
          <p
            className={cn(
              showPriceBanner && config.mobilePriceBannerAfterDevis ? "mt-3" : "mt-2",
              "font-['Poppins',sans-serif] text-[1.75rem] font-extrabold leading-tight text-white sm:text-[2rem]",
              HERO_TEXT_SHADOW,
            )}
          >
            Devis gratuit <span className={cn("text-[#F5B84A]", HERO_TEXT_SHADOW)}>immédiat</span>
          </p>
          {showPriceBanner && config.mobilePriceBannerAfterDevis ? (
            <HeroPriceBanner text={config.mobilePriceBanner} variant="mobile" />
          ) : null}
          <MobileLocationLine parts={config.mobileLocationParts} />
        </div>
      </section>

      <ParisCompactDevisForm config={config} variant="mobile" />

      <ParisMobileBenefitsBar />

      <div className="bg-white px-4 pt-5 sm:px-5">
        <ParisHeroTrustCardMobile />
      </div>
    </div>
  );
}

/** Desktop hero — split image + compact devis form (regional LP mockup). */
export function ParisLandingHeroDesktop({ config }: Readonly<{ config: LandingHeroConfig }>) {
  const showPriceBanner =
    config.showPriceBanner !== false && config.mobilePriceBanner.trim().length > 0;

  return (
    <div className="hidden lg:block">
      <ParisLpHeader />
      <section className="flex min-h-[calc(100vh-84px)]">
        <div className="relative flex min-h-full min-w-0 flex-[1.05] items-center justify-center overflow-hidden px-8 py-8 xl:px-14 xl:py-10">
          <img
            src="/gallery/hero.jpeg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div className="absolute inset-0 bg-[#1C3957]/28" aria-hidden />

          <div className="relative z-10 flex w-full max-w-[680px] flex-col items-center justify-center gap-8 xl:gap-10">
            <div className="flex w-full flex-col items-center self-stretch text-center">
              <h1
                className={cn(
                  "font-['Poppins',sans-serif] text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-white xl:text-[3rem]",
                  HERO_TEXT_SHADOW,
                )}
              >
                {config.heroLine1Prefix}
                <span className={cn("text-[#F5B84A]", HERO_TEXT_SHADOW)}>{config.heroLine1Accent}</span>
              </h1>
              {showPriceBanner && !config.mobilePriceBannerAfterDevis ? (
                <HeroPriceBanner text={config.mobilePriceBanner} variant="desktop" className="self-stretch" />
              ) : null}
              <p
                className={cn(
                  showPriceBanner && config.mobilePriceBannerAfterDevis ? "mt-3" : "mt-1",
                  "font-['Poppins',sans-serif] text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-white xl:text-[3rem]",
                  HERO_TEXT_SHADOW,
                )}
              >
                Devis gratuit <span className={cn("text-[#F5B84A]", HERO_TEXT_SHADOW)}>immédiat</span>
              </p>
              {showPriceBanner && config.mobilePriceBannerAfterDevis ? (
                <HeroPriceBanner text={config.mobilePriceBanner} variant="desktop" className="self-stretch" />
              ) : null}
            </div>

            <div className="flex w-full flex-col items-center self-stretch text-center">
              <p
                className={cn(
                  "font-['Poppins',sans-serif] text-[13px] font-bold uppercase tracking-[0.22em] text-[#F5B84A]",
                  HERO_TEXT_SHADOW,
                )}
              >
                Pourquoi nous choisir
              </p>
              <h2
                className={cn(
                  "mt-2 font-['Poppins',sans-serif] text-[1.75rem] font-extrabold text-white xl:text-[2rem]",
                  HERO_TEXT_SHADOW,
                )}
              >
                {config.moverTitle}
              </h2>
              <p
                className={cn(
                  "mt-3 mx-auto max-w-[34rem] text-center font-['Poppins',sans-serif] text-[17px] font-semibold leading-snug text-white whitespace-pre-line",
                  HERO_TEXT_SHADOW,
                )}
              >
                {config.moverDescription}
              </p>

              <ul className="mt-6 mx-auto w-full max-w-[22rem] space-y-3.5 sm:max-w-[24rem]">
                {HERO_BENEFITS.map(({ icon: Icon, label }) => (
                  <li key={label} className="grid grid-cols-[2.5rem_1fr] items-center gap-3 text-left">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-black/25 text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-[2px]">
                      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </span>
                    <span
                      className={cn(
                        "font-['Poppins',sans-serif] text-base font-semibold text-white",
                        HERO_TEXT_SHADOW,
                      )}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full justify-center">
              <ParisHeroTrustCard />
            </div>
          </div>
        </div>

        <div className="flex min-h-full w-[min(50%,680px)] shrink-0 items-center justify-center bg-[#EEF1F5] px-7 py-8 xl:w-[min(48%,720px)] xl:px-10 xl:py-10">
          <ParisCompactDevisForm config={config} />
        </div>
      </section>
    </div>
  );
}
