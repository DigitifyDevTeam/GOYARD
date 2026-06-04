import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Building2,
  Calendar,
  Clock,
  Layers,
  Mail,
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

const DEVIS_CONFIRMATION_PATH = "/tunnel/devis/confirmation";

const PARIS_GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?hl=fr-TN&gl=tn&q=Guivarche+D%C3%A9m%C3%A9nagement,+25+Rue+de+C%C3%AEteaux,+75012+Paris,+France&ludocid=449127112689032564&lsig=AB86z5WRT9msHEVSPtou8m9KcU8X#lrd=0x47e67304c6ac24e3:0x63b9ebabad39d74,3";

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/guivarchedemenagement.fr";

const ETAGE_OPTIONS = ["RDC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const ASCENSEUR_OPTIONS = ["Non", "Oui 2 personnes", "Oui 4 personnes", "Oui 6 personnes"];

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
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className={cn("relative", className)}>
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#1C3957]/60"
        aria-hidden
      />
      {children}
    </div>
  );
}

const fieldCls =
  "w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-3.5 text-[15px] text-[#1C3957] placeholder:text-slate-400 focus:border-[#CC922F] focus:outline-none focus:ring-2 focus:ring-[#CC922F]/20 font-['Poppins',sans-serif] transition";

function ParisCompactDevisForm({ entryPage }: Readonly<{ entryPage?: string }>) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    tel_portable: "",
    email: "",
    adresse_depart: "",
    etage_depart: "",
    ascenseur_depart: "",
    adresse_arrivee: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nom ||
      !form.tel_portable ||
      !form.email ||
      !form.adresse_depart ||
      !form.adresse_arrivee ||
      !form.date_demenagement
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSubmitting(true);
    try {
      const ascenseurMap: Record<string, string> = {
        Non: "Non",
        "Oui 2 personnes": "2-3 personnes",
        "Oui 4 personnes": "3-4 personnes",
        "Oui 6 personnes": "4-6 personnes",
      };
      const pathname = (
        entryPage?.trim() ||
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
        etage_depart: form.etage_depart || "RDC",
        ascenseur_depart: ascenseurMap[form.ascenseur_depart] || "Non",
        adresse_arrivee: form.adresse_arrivee,
        etage_arrivee: form.etage_arrivee || "RDC",
        ascenseur_arrivee: ascenseurMap[form.ascenseur_arrivee] || "Non",
        options_depart: {
          info_complementaire: form.info_complementaire,
          volume: form.volume,
          superficie: form.superficie,
          type_client: "Particulier",
        },
        options_arrivee: {},
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
          FormDataManager.markFormSubmitted(clientId);
        } else {
          FormDataManager.markFormSubmitted();
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
      className="w-full rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.12)] xl:p-9"
    >
      <h2 className="text-center font-['Poppins',sans-serif] text-[1.5rem] font-extrabold leading-snug text-[#1C3957] xl:text-[1.65rem]">
        Recevoir mon devis de déménagement à Paris
      </h2>
      <p className="mt-1 text-center font-['Poppins',sans-serif] text-[1.5rem] font-extrabold text-[#CC922F] xl:text-[1.65rem]">
        immédiatement
      </p>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <IconField icon={User}>
            <input
              id="paris-nom"
              type="text"
              required
              value={form.nom}
              onChange={set("nom")}
              placeholder="Nom"
              className={fieldCls}
            />
          </IconField>
          <IconField icon={Phone}>
            <input
              id="paris-tel"
              type="tel"
              required
              value={form.tel_portable}
              onChange={set("tel_portable")}
              placeholder="Téléphone"
              className={fieldCls}
            />
          </IconField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <IconField icon={Mail}>
            <input
              id="paris-mail"
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="Mail"
              className={fieldCls}
            />
          </IconField>
          <IconField icon={Calendar}>
            <input
              id="paris-date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={form.date_demenagement}
              onChange={set("date_demenagement")}
              className={cn(fieldCls, "text-slate-500")}
              style={{ colorScheme: "light" }}
            />
          </IconField>
        </div>

        <IconField icon={MapPin}>
          <input
            id="paris-adr-dep"
            type="text"
            required
            value={form.adresse_depart}
            onChange={set("adresse_depart")}
            placeholder="Adresse de départ"
            className={fieldCls}
          />
        </IconField>

        <div className="grid grid-cols-2 gap-3">
          <IconField icon={Building2}>
            <select
              id="paris-etage-dep"
              value={form.etage_depart}
              onChange={set("etage_depart")}
              className={cn(fieldCls, "appearance-none", !form.etage_depart && "text-slate-400")}
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
          <IconField icon={ArrowUpDown}>
            <select
              id="paris-asc-dep"
              value={form.ascenseur_depart}
              onChange={set("ascenseur_depart")}
              className={cn(fieldCls, "appearance-none", !form.ascenseur_depart && "text-slate-400")}
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
          <IconField icon={Package}>
            <input
              id="paris-volume"
              type="text"
              value={form.volume}
              onChange={set("volume")}
              placeholder="Volume (m3)"
              className={fieldCls}
            />
          </IconField>
          <span className="font-['Poppins',sans-serif] text-sm font-semibold text-slate-400">ou</span>
          <IconField icon={Layers}>
            <input
              id="paris-superficie"
              type="text"
              value={form.superficie}
              onChange={set("superficie")}
              placeholder="Superficie (m2)"
              className={fieldCls}
            />
          </IconField>
        </div>

        <IconField icon={MapPin}>
          <input
            id="paris-adr-arr"
            type="text"
            required
            value={form.adresse_arrivee}
            onChange={set("adresse_arrivee")}
            placeholder="Adresse d'arrivée"
            className={fieldCls}
          />
        </IconField>

        <div className="grid grid-cols-2 gap-3">
          <IconField icon={Building2}>
            <select
              id="paris-etage-arr"
              value={form.etage_arrivee}
              onChange={set("etage_arrivee")}
              className={cn(fieldCls, "appearance-none", !form.etage_arrivee && "text-slate-400")}
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
          <IconField icon={ArrowUpDown}>
            <select
              id="paris-asc-arr"
              value={form.ascenseur_arrivee}
              onChange={set("ascenseur_arrivee")}
              className={cn(fieldCls, "appearance-none", !form.ascenseur_arrivee && "text-slate-400")}
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
            id="paris-info"
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
        className="mt-6 w-full rounded-xl bg-[#CC922F] px-4 py-4 font-['Poppins',sans-serif] text-base font-extrabold text-[#1C3957] shadow-[0_10px_28px_rgba(204,146,47,0.35)] transition hover:brightness-95 disabled:opacity-60"
      >
        {submitting ? "Envoi en cours..." : "Recevoir mon devis gratuit à Paris"}
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

/** Desktop hero — split image + compact devis form (Paris LP mockup). */
export function ParisLandingHeroDesktop({ entryPage }: Readonly<{ entryPage?: string }>) {
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
            <div className="flex w-full flex-col items-center text-center">
              <h1
                className={cn(
                  "font-['Poppins',sans-serif] text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-white xl:text-[3rem]",
                  HERO_TEXT_SHADOW,
                )}
              >
                Déménagement à <span className={cn("text-[#F5B84A]", HERO_TEXT_SHADOW)}>Paris</span>
              </h1>
              <p
                className={cn(
                  "mt-1 font-['Poppins',sans-serif] text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-white xl:text-[3rem]",
                  HERO_TEXT_SHADOW,
                )}
              >
                Devis gratuit <span className={cn("text-[#F5B84A]", HERO_TEXT_SHADOW)}>immédiat</span>
              </p>
            </div>

            <div className="flex w-full flex-col items-end self-stretch pr-0 text-right sm:pr-2 xl:pr-4">
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
                Votre déménageur à Paris
              </h2>
              <p
                className={cn(
                  "mt-3 max-w-md font-['Poppins',sans-serif] text-[17px] font-semibold leading-relaxed text-white",
                  HERO_TEXT_SHADOW,
                )}
              >
                Une équipe fiable, claire et réactive pour votre déménagement à Paris.
              </p>

              <ul className="mt-6 ml-auto w-full max-w-[22rem] space-y-3.5 sm:max-w-[24rem]">
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
          <ParisCompactDevisForm entryPage={entryPage} />
        </div>
      </section>
    </div>
  );
}
