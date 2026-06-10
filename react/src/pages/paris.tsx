
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormDataManager } from "../utils/formDataManager";

const DEVIS_CONFIRMATION_PATH = "/tunnel/devis/confirmation";
import { RegionalLandingPage } from "../components/paris/RegionalLandingPage";
import { PARIS_LANDING_CONFIG } from "../components/paris/landingHeroConfig";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import { cn } from "../lib/utils";
import { PAGE_META } from "../seo/pageMeta";
import { EXTERNAL_LINK_REL } from "../constants/externalLink";

const PARIS_GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?hl=fr-TN&gl=tn&q=Guivarche+D%C3%A9m%C3%A9nagement,+25+Rue+de+C%C3%AEteaux,+75012+Paris,+France&ludocid=449127112689032564&lsig=AB86z5WRT9msHEVSPtou8m9KcU8X#lrd=0x47e67304c6ac24e3:0x63b9ebabad39d74,3";

const PARIS_TRUST_PILL_CLASS =
  "inline-flex h-12 items-center justify-center gap-2 px-6 rounded-full shadow-lg backdrop-blur-sm shrink-0";

function ParisGoogleReviewsPill({ className }: Readonly<{ className?: string }>) {
  return (
    <a
      href={PARIS_GOOGLE_REVIEWS_URL}
      target="_blank"
      rel={EXTERNAL_LINK_REL}
      className={cn(
        PARIS_TRUST_PILL_CLASS,
        "bg-[#111827]/90 text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2",
        className,
      )}
      aria-label="Voir les avis Google — note 5 sur 5, 70 avis"
    >
      <span className="flex shrink-0 items-center gap-0.5 text-[#FBBF24] text-[15px]" aria-hidden="true">
        ★★★★★
      </span>
      <span className="font-['Poppins',sans-serif] font-bold text-[15px] leading-none tracking-tight">5/5</span>
      <span className="font-['Poppins',sans-serif] font-medium text-[14px] leading-none text-white/80 whitespace-nowrap">
        70 avis Google
      </span>
    </a>
  );
}

function ParisDevisSous24hPill({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn(PARIS_TRUST_PILL_CLASS, "bg-[#111827]/85 text-white", className)}>
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400 text-xs text-emerald-400">
        ✓
      </span>
      <span className="font-['Poppins',sans-serif] font-semibold text-[15px] leading-none whitespace-nowrap">
        Devis sous 24h
      </span>
    </div>
  );
}

/** Trust row: avis + devis; animated hero phone only on Paris LP when enabled. */
function ParisTrustBadgesStack({
  className,
  showAnimatedPhone = false,
}: Readonly<{ className?: string; showAnimatedPhone?: boolean }>) {
  return (
    <div className={cn("mt-5 flex w-full flex-col gap-3", className)}>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <ParisGoogleReviewsPill className="w-full" />
        <ParisDevisSous24hPill className="w-full" />
      </div>
      {showAnimatedPhone ? (
        <ContactPhoneLink
          variant="hero"
          className="h-12 w-full justify-center gap-2.5 px-6 py-0 sm:px-6 sm:py-0"
        />
      ) : null}
    </div>
  );
}

export function ParisHeroServicePitch({
  className,
  showAnimatedPhone = false,
}: Readonly<{ className?: string; showAnimatedPhone?: boolean }>) {
  return (
    <div className={className}>
      <p className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl lg:text-[2.2rem] lg:leading-tight tracking-tight">
        L'exigence des grands déménageurs
      </p>
      <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
        Une structure solide, des équipes 100 % salariées, aucun recours à la sous-traitance et une logistique parfaitement maîtrisée
      </p>

      <ParisTrustBadgesStack showAnimatedPhone={showAnimatedPhone} />
    </div>
  );
}

export function ParisDevisTrustAside({
  className,
  showAnimatedPhone = false,
}: Readonly<{ className?: string; showAnimatedPhone?: boolean }>) {
  return (
    <div className={`text-center ${className ?? ""}`}>
       <p className="mx-auto mt-4 max-w-2xl text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
                Indiquez votre adresse de départ et recevez un devis personnalisé en quelques minutes.
              </p>

      <ParisTrustBadgesStack className="mt-8" showAnimatedPhone={showAnimatedPhone} />
    </div>
  );
}

const ETAGE_OPTIONS = ["RDC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const ASCENSEUR_OPTIONS = ["Non", "Oui 2 personnes", "Oui 4 personnes", "Oui 6 personnes"];

type DevisFormState = {
  nom: string;
  prenom: string;
  tel_portable: string;
  email: string;
  adresse_depart: string;
  cp_depart: string;
  ville_depart: string;
  etage_depart: string;
  adresse_arrivee: string;
  cp_arrivee: string;
  ville_arrivee: string;
  etage_arrivee: string;
  volume: string;
  superficie: string;
  date_demenagement: string;
};

type DevisFormFieldKey = keyof DevisFormState;

function getDevisFormFieldErrors(form: DevisFormState): Partial<Record<DevisFormFieldKey, boolean>> {
  const hasText = (value: string) => value.trim() !== "";
  const volumeSuperficieMissing = !hasText(form.volume) && !hasText(form.superficie);

  return {
    nom: !hasText(form.nom),
    prenom: !hasText(form.prenom),
    tel_portable: !hasText(form.tel_portable),
    email: !hasText(form.email),
    adresse_depart: !hasText(form.adresse_depart),
    cp_depart: !hasText(form.cp_depart),
    ville_depart: !hasText(form.ville_depart),
    etage_depart: form.etage_depart === "",
    adresse_arrivee: !hasText(form.adresse_arrivee),
    cp_arrivee: !hasText(form.cp_arrivee),
    ville_arrivee: !hasText(form.ville_arrivee),
    etage_arrivee: form.etage_arrivee === "",
    volume: volumeSuperficieMissing,
    superficie: volumeSuperficieMissing,
    date_demenagement: form.date_demenagement === "",
  };
}

function hasDevisFormFieldErrors(errors: Partial<Record<DevisFormFieldKey, boolean>>): boolean {
  return Object.values(errors).some(Boolean);
}

const devisFieldErrorCls = "border-red-500 placeholder:text-red-500";

export function DevisForm(props?: Readonly<{ entryPage?: string }>) {
  const { entryPage } = props ?? {};
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState({
    type: "Particulier",
    nom: "",
    prenom: "",
    tel_fixe: "",
    tel_portable: "",
    email: "",
    adresse_depart: "",
    cp_depart: "",
    ville_depart: "",
    etage_depart: "RDC",
    ascenseur_depart: "Non",
    info_depart: "",
    adresse_arrivee: "",
    cp_arrivee: "",
    ville_arrivee: "",
    etage_arrivee: "RDC",
    ascenseur_arrivee: "Non",
    info_arrivee: "",
    volume: "",
    superficie: "",
    date_demenagement: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#191919] placeholder:text-slate-400 focus:border-[#CC922F] focus:ring-2 focus:ring-[#CC922F]/20 focus:outline-none transition font-['Poppins',sans-serif]";
  const selectCls = `${inputCls} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8`;
  const labelCls = "block text-sm font-medium text-[#191919] mb-1.5 font-['Poppins',sans-serif]";
  const sectionHeadCls = "font-['Poppins',sans-serif] font-bold text-[#191919] text-lg sm:text-xl uppercase tracking-wide mb-5";

  const fieldErrors = showErrors ? getDevisFormFieldErrors(form) : {};
  const err = (field: DevisFormFieldKey) => !!fieldErrors[field];
  const fieldClass = (field: DevisFormFieldKey, base = inputCls) => cn(base, err(field) && devisFieldErrorCls);
  const placeholder = (field: DevisFormFieldKey, base: string) => (err(field) ? "obligatoire" : base);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = getDevisFormFieldErrors(form);
    if (hasDevisFormFieldErrors(errors)) {
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

      const pathname = (entryPage?.trim() || (typeof window !== "undefined" ? window.location.pathname : "") || "").trim();

      const payload = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        phone: form.tel_portable || form.tel_fixe,
        date_demenagement: form.date_demenagement,
        adresse_depart: form.adresse_depart,
        cp_depart: form.cp_depart,
        ville_depart: form.ville_depart,
        etage_depart: form.etage_depart,
        ascenseur_depart: ascenseurMap[form.ascenseur_depart] || "Non",
        adresse_arrivee: form.adresse_arrivee,
        cp_arrivee: form.cp_arrivee,
        ville_arrivee: form.ville_arrivee,
        etage_arrivee: form.etage_arrivee,
        ascenseur_arrivee: ascenseurMap[form.ascenseur_arrivee] || "Non",
        options_depart: {
          info_complementaire: form.info_depart,
          volume: form.volume,
          superficie: form.superficie,
          type_client: form.type,
          cp_depart: form.cp_depart,
          ville_depart: form.ville_depart,
        },
        options_arrivee: {
          info_complementaire: form.info_arrivee,
          cp_arrivee: form.cp_arrivee,
          ville_arrivee: form.ville_arrivee,
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
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-100 shadow-[0px_10px_30px_rgba(15,23,42,0.06)] p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto">
      {/* INFORMATIONS */}
      <h3 className={sectionHeadCls}>Informations</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="dv-type" className={labelCls}>Vous êtes un</label>
          <select id="dv-type" value={form.type} onChange={set("type")} className={selectCls}>
            <option>Particulier</option>
            <option>Professionnel</option>
          </select>
        </div>
        <div>
          <label htmlFor="dv-nom" className={labelCls}>Nom *</label>
          <input id="dv-nom" type="text" value={form.nom} onChange={set("nom")} placeholder={placeholder("nom", "Nom")} className={fieldClass("nom")} aria-invalid={err("nom")} />
        </div>
        <div>
          <label htmlFor="dv-prenom" className={labelCls}>Prénom *</label>
          <input id="dv-prenom" type="text" value={form.prenom} onChange={set("prenom")} placeholder={placeholder("prenom", "Prénom")} className={fieldClass("prenom")} aria-invalid={err("prenom")} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="dv-tel-fixe" className={labelCls}>Téléphone Fixe</label>
          <input id="dv-tel-fixe" type="tel" value={form.tel_fixe} onChange={set("tel_fixe")} placeholder="Téléphone Fixe" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-tel-portable" className={labelCls}>Téléphone Portable *</label>
          <input id="dv-tel-portable" type="tel" value={form.tel_portable} onChange={set("tel_portable")} placeholder={placeholder("tel_portable", "Téléphone Portable")} className={fieldClass("tel_portable")} aria-invalid={err("tel_portable")} />
        </div>
        <div>
          <label htmlFor="dv-email" className={labelCls}>Votre email *</label>
          <input id="dv-email" type="email" value={form.email} onChange={set("email")} placeholder={placeholder("email", "Votre email")} className={fieldClass("email")} aria-invalid={err("email")} />
        </div>
      </div>

      <hr className="my-8 border-slate-100" />

      {/* INFORMATIONS DE DÉPART */}
      <h3 className={sectionHeadCls}>Informations de départ</h3>
      <div>
        <label htmlFor="dv-adr-dep" className={labelCls}>Adresse de départ *</label>
        <input id="dv-adr-dep" type="text" value={form.adresse_depart} onChange={set("adresse_depart")} placeholder={placeholder("adresse_depart", "Adresse de départ")} className={fieldClass("adresse_depart")} aria-invalid={err("adresse_depart")} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="dv-cp-dep" className={labelCls}>Code Postal *</label>
          <input id="dv-cp-dep" type="text" inputMode="numeric" value={form.cp_depart} onChange={set("cp_depart")} placeholder={placeholder("cp_depart", "Code Postal")} className={fieldClass("cp_depart")} autoComplete="postal-code" aria-invalid={err("cp_depart")} />
        </div>
        <div>
          <label htmlFor="dv-ville-dep" className={labelCls}>Ville *</label>
          <input id="dv-ville-dep" type="text" value={form.ville_depart} onChange={set("ville_depart")} placeholder={placeholder("ville_depart", "Ville")} className={fieldClass("ville_depart")} aria-invalid={err("ville_depart")} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="dv-etage-dep" className={labelCls}>Nombre d'étages *</label>
          <select id="dv-etage-dep" value={form.etage_depart} onChange={set("etage_depart")} className={fieldClass("etage_depart", selectCls)} aria-invalid={err("etage_depart")}>
            {ETAGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="dv-asc-dep" className={labelCls}>Ascenseur</label>
          <select id="dv-asc-dep" value={form.ascenseur_depart} onChange={set("ascenseur_depart")} className={selectCls}>
            {ASCENSEUR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="dv-info-dep" className={labelCls}>Informations complémentaires</label>
        <textarea
          id="dv-info-dep"
          value={form.info_depart}
          onChange={set("info_depart")}
          placeholder="Informations complémentaires pour votre déménagement: exemple: volume, démontage, Piano"
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <hr className="my-8 border-slate-100" />

      {/* INFORMATIONS D'ARRIVÉE */}
      <h3 className={sectionHeadCls}>Informations d'arrivée</h3>
      <div>
        <label htmlFor="dv-adr-arr" className={labelCls}>Adresse d'arrivée *</label>
        <input id="dv-adr-arr" type="text" value={form.adresse_arrivee} onChange={set("adresse_arrivee")} placeholder={placeholder("adresse_arrivee", "Adresse d'arrivée")} className={fieldClass("adresse_arrivee")} aria-invalid={err("adresse_arrivee")} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="dv-cp-arr" className={labelCls}>Code Postal *</label>
          <input id="dv-cp-arr" type="text" inputMode="numeric" value={form.cp_arrivee} onChange={set("cp_arrivee")} placeholder={placeholder("cp_arrivee", "Code Postal")} className={fieldClass("cp_arrivee")} autoComplete="postal-code" aria-invalid={err("cp_arrivee")} />
        </div>
        <div>
          <label htmlFor="dv-ville-arr" className={labelCls}>Ville *</label>
          <input id="dv-ville-arr" type="text" value={form.ville_arrivee} onChange={set("ville_arrivee")} placeholder={placeholder("ville_arrivee", "Ville")} className={fieldClass("ville_arrivee")} aria-invalid={err("ville_arrivee")} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="dv-etage-arr" className={labelCls}>Nombre d'étages *</label>
          <select id="dv-etage-arr" value={form.etage_arrivee} onChange={set("etage_arrivee")} className={fieldClass("etage_arrivee", selectCls)} aria-invalid={err("etage_arrivee")}>
            {ETAGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="dv-asc-arr" className={labelCls}>Ascenseur</label>
          <select id="dv-asc-arr" value={form.ascenseur_arrivee} onChange={set("ascenseur_arrivee")} className={selectCls}>
            {ASCENSEUR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="dv-info-arr" className={labelCls}>Informations complémentaires</label>
        <textarea
          id="dv-info-arr"
          value={form.info_arrivee}
          onChange={set("info_arrivee")}
          placeholder="Informations complémentaires pour votre déménagement: exemple: volume, démontage, Piano"
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <hr className="my-8 border-slate-100" />

      {/* VOLUME / SUPERFICIE / DATE */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dv-volume" className={labelCls}>Volume (m3) *</label>
          <input id="dv-volume" type="text" value={form.volume} onChange={set("volume")} placeholder={placeholder("volume", "Volume (m3)")} className={fieldClass("volume")} aria-invalid={err("volume")} />
        </div>
        <div>
          <label htmlFor="dv-superficie" className={labelCls}>Ou Superficie du logement m2 *</label>
          <input id="dv-superficie" type="text" value={form.superficie} onChange={set("superficie")} placeholder={placeholder("superficie", "Ou Superficie du logement m2")} className={fieldClass("superficie")} aria-invalid={err("superficie")} />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="dv-date" className={labelCls}>Date Prévue de déménagement *</label>
        <div className="relative">
          {err("date_demenagement") && !form.date_demenagement ? (
            <span className="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 font-['Poppins',sans-serif] text-sm text-red-500">
              obligatoire
            </span>
          ) : null}
          <input
            id="dv-date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.date_demenagement}
            onChange={set("date_demenagement")}
            className={fieldClass("date_demenagement")}
            style={{ colorScheme: "light" }}
            aria-invalid={err("date_demenagement")}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full rounded-xl bg-[#CC922F] px-8 py-4 font-['Poppins',sans-serif] font-bold text-white text-base sm:text-lg shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Envoi en cours..." : "Envoyer ma demande de devis"}
      </button>

      <p className="mt-3 text-center text-[11px] text-slate-500">Données protégées — aucun démarchage</p>
    </form>
  );
}

export default function Paris() {
  return <RegionalLandingPage config={PARIS_LANDING_CONFIG} meta={PAGE_META.lpParis} />;
}

