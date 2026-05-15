import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { InterventionMapParis75 } from "../components/intervention-map";
import { LightboxImageDialog, type LightboxImage } from "../components/lightbox-image-dialog";

const PARIS_GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?hl=fr-TN&gl=tn&q=Guivarche+D%C3%A9m%C3%A9nagement,+25+Rue+de+C%C3%AEteaux,+75012+Paris,+France&ludocid=449127112689032564&lsig=AB86z5WRT9msHEVSPtou8m9KcU8X#lrd=0x47e67304c6ac24e3:0x63b9ebabad39d74,3";

function ParisGoogleReviewsPill({ className }: Readonly<{ className?: string }>) {
  return (
    <a
      href={PARIS_GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[#111827]/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2 ${className ?? ""}`}
      aria-label="Voir les avis Google — note 5 sur 5, 70 avis"
    >
      <span className="flex shrink-0 items-center gap-0.5 text-[#FBBF24] text-[15px] sm:text-base" aria-hidden="true">
        ★★★★★
      </span>
      <span className="font-['Poppins',sans-serif] font-bold text-[15px] tracking-tight">5/5</span>
      <span className="font-['Poppins',sans-serif] font-medium text-[14px] text-white/80">70 avis Google</span>
    </a>
  );
}

export function ParisHeroServicePitch({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={className}>
      <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl lg:text-[2.2rem] lg:leading-tight tracking-tight">
        L'exigence des grands déménageurs
      </h2>
      <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
        Une structure solide, des équipes 100 % salariées, aucun recours à la sous-traitance et une logistique parfaitement maîtrisée
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <ParisGoogleReviewsPill />
        <div className="flex items-center gap-2 bg-[#111827]/85 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 text-xs text-emerald-400">
            ✓
          </span>
          <span className="font-['Poppins',sans-serif] font-semibold text-[15px] whitespace-nowrap">Devis sous 24h</span>
        </div>
      </div>
    </div>
  );
}

export function ParisDevisTrustAside({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={`text-center ${className ?? ""}`}>
       <p className="mx-auto mt-4 max-w-2xl text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed">
                Indiquez votre adresse de départ et recevez un devis personnalisé en quelques minutes.
              </p>

      <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
        <ParisGoogleReviewsPill />
                <div className="flex items-center gap-2 bg-[#111827]/85 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 text-xs text-emerald-400">
                    ✓
                  </span>
                  <span className="font-['Poppins',sans-serif] font-semibold text-[15px] whitespace-nowrap">
                    Devis sous 24h
                  </span>
        </div>
      </div>
    </div>
  );
}

const ETAGE_OPTIONS = ["RDC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const ASCENSEUR_OPTIONS = ["Non", "Oui 2 personnes", "Oui 4 personnes", "Oui 6 personnes"];

export function DevisForm(props?: Readonly<{ entryPage?: string }>) {
  const { entryPage } = props ?? {};
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.tel_portable || !form.email || !form.adresse_depart || !form.adresse_arrivee || !form.date_demenagement) {
      alert("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }
    setSubmitting(true);
    try {
      const fullAdresseDepart = [form.adresse_depart, form.cp_depart, form.ville_depart].filter(Boolean).join(", ");
      const fullAdresseArrivee = [form.adresse_arrivee, form.cp_arrivee, form.ville_arrivee].filter(Boolean).join(", ");

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
        adresse_depart: fullAdresseDepart,
        etage_depart: form.etage_depart,
        ascenseur_depart: ascenseurMap[form.ascenseur_depart] || "Non",
        adresse_arrivee: fullAdresseArrivee,
        etage_arrivee: form.etage_arrivee,
        ascenseur_arrivee: ascenseurMap[form.ascenseur_arrivee] || "Non",
        options_depart: { info_complementaire: form.info_depart, volume: form.volume, superficie: form.superficie, type_client: form.type },
        options_arrivee: { info_complementaire: form.info_arrivee },
        ...(pathname ? { entry_page: pathname } : {}),
      };

      const res = await fetch("/api/demenagement/client-info/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        setSubmitted(true);
        if (data?.data?.id) localStorage.setItem("clientId", String(data.data.id));
      } else {
        alert(data?.message || "Une erreur est survenue.");
      }
    } catch {
      alert("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white border border-slate-100 shadow-[0px_10px_30px_rgba(15,23,42,0.06)] p-8 sm:p-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-5">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="font-['Poppins',sans-serif] font-bold text-[#191919] text-2xl">Demande envoyée !</h3>
        <p className="mt-3 text-slate-600">Nous avons bien reçu votre demande de devis. Notre équipe vous recontactera sous 24h.</p>
      </div>
    );
  }

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
          <input id="dv-nom" type="text" required value={form.nom} onChange={set("nom")} placeholder="Nom" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-prenom" className={labelCls}>Prénom *</label>
          <input id="dv-prenom" type="text" required value={form.prenom} onChange={set("prenom")} placeholder="Prénom" className={inputCls} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="dv-tel-fixe" className={labelCls}>Téléphone Fixe</label>
          <input id="dv-tel-fixe" type="tel" value={form.tel_fixe} onChange={set("tel_fixe")} placeholder="Téléphone Fixe" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-tel-portable" className={labelCls}>Téléphone Portable *</label>
          <input id="dv-tel-portable" type="tel" required value={form.tel_portable} onChange={set("tel_portable")} placeholder="Téléphone Portable" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-email" className={labelCls}>Votre email *</label>
          <input id="dv-email" type="email" required value={form.email} onChange={set("email")} placeholder="Votre email" className={inputCls} />
        </div>
      </div>

      <hr className="my-8 border-slate-100" />

      {/* INFORMATIONS DE DÉPART */}
      <h3 className={sectionHeadCls}>Informations de départ</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="dv-adr-dep" className={labelCls}>Adresse de départ *</label>
          <input id="dv-adr-dep" type="text" required value={form.adresse_depart} onChange={set("adresse_depart")} placeholder="Adresse de départ" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-cp-dep" className={labelCls}>Code Postal *</label>
          <input id="dv-cp-dep" type="text" value={form.cp_depart} onChange={set("cp_depart")} placeholder="Code Postal" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-ville-dep" className={labelCls}>Ville *</label>
          <input id="dv-ville-dep" type="text" value={form.ville_depart} onChange={set("ville_depart")} placeholder="Ville" className={inputCls} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="dv-etage-dep" className={labelCls}>Nombre d'étages *</label>
          <select id="dv-etage-dep" value={form.etage_depart} onChange={set("etage_depart")} className={selectCls}>
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
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="dv-adr-arr" className={labelCls}>Adresse d'arrivée *</label>
          <input id="dv-adr-arr" type="text" required value={form.adresse_arrivee} onChange={set("adresse_arrivee")} placeholder="Adresse d'arrivée" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-cp-arr" className={labelCls}>Code Postal *</label>
          <input id="dv-cp-arr" type="text" value={form.cp_arrivee} onChange={set("cp_arrivee")} placeholder="Code Postal" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-ville-arr" className={labelCls}>Ville *</label>
          <input id="dv-ville-arr" type="text" value={form.ville_arrivee} onChange={set("ville_arrivee")} placeholder="Ville" className={inputCls} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="dv-etage-arr" className={labelCls}>Nombre d'étages *</label>
          <select id="dv-etage-arr" value={form.etage_arrivee} onChange={set("etage_arrivee")} className={selectCls}>
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
          <label htmlFor="dv-volume" className={labelCls}>Volume (m3)</label>
          <input id="dv-volume" type="text" value={form.volume} onChange={set("volume")} placeholder="Volume (m3)" className={inputCls} />
        </div>
        <div>
          <label htmlFor="dv-superficie" className={labelCls}>Ou Superficie du logement m2</label>
          <input id="dv-superficie" type="text" value={form.superficie} onChange={set("superficie")} placeholder="Ou Superficie du logement m2" className={inputCls} />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="dv-date" className={labelCls}>Date Prévue de déménagement *</label>
        <input
          id="dv-date"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={form.date_demenagement}
          onChange={set("date_demenagement")}
          className={inputCls}
          style={{ colorScheme: "light" }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full rounded-xl bg-[#CC922F] px-8 py-4 font-['Poppins',sans-serif] font-bold text-white text-base sm:text-lg shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition disabled:opacity-60"
      >
        {submitting ? "Envoi en cours..." : "Envoyer ma demande de devis"}
      </button>

      <p className="mt-3 text-center text-[11px] text-slate-500">Données protégées — aucun démarchage</p>
    </form>
  );
}

export default function Paris() {
  const navigate = useNavigate();
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const primaryCta = () => {
    sessionStorage.setItem("cameFromHome", "true");
    navigate("/tunnel/mes-coordonnees");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={primaryCta} />

      <main>
        {/* Devis complet — full quote form */}
        <section className="w-full bg-slate-50/60 py-16 sm:py-20 lg:py-24 border-y border-slate-200/80">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight tracking-tight">
                Confiez-nous votre projet de déménagement
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
                Confiez votre déménagement à nos équipes. Nous proposons les tarifs les moins élevés d'Île-de-France.
              </p>
            </div>

            <DevisForm />
          </div>
        </section>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(204,146,47,0.22),transparent_60%),radial-gradient(900px_500px_at_85%_10%,rgba(25,25,25,0.10),transparent_55%)]" />
          <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  Paris 75 • Déménagement pro
                </div>
                <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-[#191919] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Déménagement à Paris 75, sans stress.
                </h1>
                <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Une équipe réactive pour des déménagements efficaces, soignés et parfaitement organisés dans Paris (75).
                  Devis rapide, dates flexibles, protection premium.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Intervention rapide (Paris 75)",
                    "Protection mobilier & accès difficiles",
                    "Équipe expérimentée et ponctuelle",
                    "Suivi simple, clair, transparent",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#CC922F] mt-0.5" />
                      <span className="text-sm sm:text-[15px] text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={primaryCta}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.25)] hover:brightness-95 transition"
                  >
                    Obtenir mon devis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => (globalThis.location.href = "tel:+33189703324")}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-['Poppins',sans-serif] font-semibold text-[#191919] hover:bg-slate-50 transition"
                  >
                    Parler à un conseiller
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white/70 backdrop-blur-sm shadow-[0px_14px_45px_rgba(15,23,42,0.10)] border border-slate-100 p-6 sm:p-7">
                  <ParisHeroServicePitch />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Paris 75 — carte & zone */}
        <section className="mt-0">
          <InterventionMapParis75 />
        </section>

        {/* À propos – visual showcase */}
        <section className="w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px]">
            {/* Top: heading + quote */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              <div>
                <span className="inline-block font-['Poppins',sans-serif] text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                  À Propos
                </span>
                <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
                  L'excellence au service
                  <br className="hidden sm:block" /> de votre déménagement.
                </h2>
              </div>
              <div className="flex gap-4 lg:gap-5 items-start lg:pt-6">
                <svg
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 text-slate-200"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.5 28.8c0-5.1 3.3-9.7 8.3-11.3l-.8-3.5C13.6 16 9 21.7 9 28.8c0 5.2 3.2 8.7 7.2 8.7 3.4 0 5.8-2.6 5.8-5.7 0-3-2.2-5.4-5.3-5.4-1.5 0-2.8.6-3.6 1.5-.2-4.5 2.4-8.6 6.5-10.2l-.8-3.5C13.4 16 9.2 21.4 9.2 28.2c0 .2 0 .4.1.6h3.2zm18.7 0c0-5.1 3.3-9.7 8.3-11.3l-.8-3.5c-6.4 2-11 7.7-11 14.8 0 5.2 3.2 8.7 7.2 8.7 3.4 0 5.8-2.6 5.8-5.7 0-3-2.2-5.4-5.3-5.4-1.5 0-2.8.6-3.6 1.5-.2-4.5 2.4-8.6 6.5-10.2l-.8-3.5C32.1 16 27.9 21.4 27.9 28.2c0 .2 0 .4.1.6h3.2z" />
                </svg>
                <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed max-w-lg">
                  <span className="font-semibold text-slate-800">
                    Nous accompagnons chaque projet avec rigueur et bienveillance.
                  </span>{" "}
                  De la préparation au dernier carton posé, notre équipe met son
                  savoir-faire au service d'un déménagement fluide, ponctuel et
                  soigné — partout à Paris (75).
                </p>
              </div>
            </div>

            {/* Gallery row */}
            <div className="mt-12 sm:mt-14 lg:mt-16">
              {/* Mobile: simple 2x2 */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
                {[
                  { src: "/gallery/hero.jpeg", alt: "Équipe de déménagement en action"},
                  { src: "/gallery/monte_meuble.jpeg", alt: "Garde-meubles : caisses de stockage dans l'entrepôt" },
                  { src: "/gallery/1.jpeg", alt: "Protection et chargement soigné" },
                  {
                    src: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.55.jpeg",
                    alt: "Caisses  professionnelles empilées pour le déménagement",
                  },
                ].map((img) => (
                  <button
                    key={img.src}
                    type="button"
                    className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[3/4] sm:aspect-[4/5] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#CC922F] focus:ring-offset-2"
                    onClick={() => setLightboxImage(img)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </button>
                ))}
              </div>

              {/* Desktop: staggered heights like your reference */}
              <div className="hidden lg:flex items-end gap-4">
                {(() => {
                  return [
                    { src: "/gallery/hero.jpeg", alt: "Équipe devant l'agence et la flotte de camions" },
                    { src: "/gallery/monte_meuble.jpeg", alt: "Garde-meubles : caisses de stockage dans l'entrepôt" },
                    { src: "/gallery/1.jpeg", alt: "Protection et chargement soigné" },
                    {
                      src: "/gallery/WhatsApp%20Image%202026-03-18%20at%2001.03.55.jpeg",
                      alt: "Caisses plastiques professionnelles empilées pour le déménagement",
                    },
                  ].map((img) => {
                    return (
                      <button
                        key={img.src}
                        type="button"
                        className="relative flex-1 overflow-hidden rounded-2xl sm:rounded-3xl h-[320px] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#CC922F] focus:ring-offset-2"
                        onClick={() => setLightboxImage(img)}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            <LightboxImageDialog image={lightboxImage} onClose={() => setLightboxImage(null)} />
          </div>
        </section>



        {/* Process */}
        <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14">
          <div className="flex flex-col gap-2">
            <p className="font-['Poppins',sans-serif] font-semibold text-xs uppercase tracking-[0.18em] text-slate-500">
              Comment ça se passe
            </p>
            <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
              Un déroulé simple, maîtrisé, pro.
            </h2>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Devis rapide",
                desc: "Vous décrivez votre déménagement (volume, accès, dates). On vous répond vite, sans blabla.",
              },
              {
                step: "02",
                title: "Préparation",
                desc: "On planifie le jour J, les protections, le stationnement, et les options (emballage, démontage).",
              },
              {
                step: "03",
                title: "Jour J",
                desc: "Chargement, transport, livraison. Votre mobilier est protégé et tout est cadré.",
              },
            ].map((x) => (
              <div key={x.step} className="rounded-3xl border border-slate-100 bg-white shadow-[0px_10px_30px_rgba(15,23,42,0.06)] p-6">
                <div className="flex items-center justify-between">
                  <span className="font-['Poppins',sans-serif] font-extrabold text-[#CC922F]">
                    {x.step}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#CC922F]" aria-hidden="true" />
                </div>
                <div className="mt-3 font-['Poppins',sans-serif] font-bold text-[#191919]">
                  {x.title}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {x.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage + CTA */}
        <section className="bg-slate-50/60 border-y border-slate-100">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7">
                <h2 className="font-['Poppins',sans-serif] font-extrabold text-[#191919] text-2xl sm:text-3xl">
                  Paris 75
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Intervention sur Paris et le département 75 : tous arrondissements, du centre aux quartiers périphériques,
                  avec une organisation adaptée aux accès, aux étages et au stationnement.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    "Déménagement appartement / maison",
                    "Transfert bureaux / commerces",
                    "Accès difficiles & étages",
                    "Options d’emballage & démontage",
                  ].map((x) => (
                    <div key={x} className="flex items-start gap-2 rounded-2xl bg-white border border-slate-100 p-4">
                      <CheckCircle2 className="h-5 w-5 text-[#CC922F] mt-0.5" />
                      <span className="text-sm text-slate-700">{x}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white shadow-[0px_14px_45px_rgba(15,23,42,0.10)] border border-slate-100 p-6 sm:p-7">
                  <ParisDevisTrustAside />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Desktop: section title + Google Reviews widget */}
        <div className="hidden lg:block w-full max-w-[1920px] bg-white pt-20 pb-12">
          <div className="text-center section-px">
            <h2 className="font-['Poppins',_sans-serif] font-[600] text-3xl lg:text-4xl xl:text-[51px] xl:leading-[62px] text-black">
              Ce que nos clients disent de nous !
            </h2>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="elfsight-app-402ccb84-5c20-4877-9afd-70877cb72277" data-elfsight-app-lazy />
          </div>
        </div>
        {/* Mobile: section title + Google Reviews widget */}
        <div className="lg:hidden w-full bg-white pt-16 pb-10 sm:pt-20 sm:pb-12 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-['Poppins',_sans-serif] font-[600] text-2xl sm:text-3xl text-black">
              Ce que nos clients disent de nous !
            </h2>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="elfsight-app-402ccb84-5c20-4877-9afd-70877cb72277 w-full" data-elfsight-app-lazy />
          </div>
        </div>
        {/* CTA final */}
        <section className="w-full bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]">
                Prêt à déménager en toute sérénité ?
              </h2>

              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Rejoignez des milliers de clients qui ont déjà fait confiance à Guivarche. Obtenez votre devis
                gratuit maintenant !
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={primaryCta}
                  className="inline-flex items-center justify-center bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-base sm:text-lg font-['Poppins',sans-serif] transition-colors"
                >
                  Obtenir un devis gratuit
                </button>

                <a
                  href="/contact"
                  className="inline-flex items-center justify-center border border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-base sm:text-lg font-['Poppins',sans-serif] transition-colors"
                >
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

