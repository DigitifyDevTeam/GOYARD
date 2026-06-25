import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CuboidIcon as Cube,
  MapPin,
  Route,
  ShieldCheck,
  Timer,
  Truck,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import {
  gradientCtaActionsClass,
  gradientCtaOutlineClass,
  gradientCtaPrimaryClass,
} from "../components/gradientCtaStyles";
import { InterventionMapNational } from "../components/intervention-map";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { DestinationFaqSection } from "../components/destination/DestinationFaqSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import { DEVIS_FORM_PATH } from "../constants/parisLp";

const LONGUE_DISTANCE_PRICING_ROWS = [
  { type: "Studio / Chambre", volume: "10 – 15 m³", budget: "800 € – 1 500 €" },
  { type: "Appartement T2 / T3", volume: "20 – 30 m³", budget: "1 400 € – 2 800 €" },
  { type: "Appartement T4 / T5", volume: "35 – 45 m³", budget: "2 500 € – 4 500 €" },
  { type: "Maison familiale", volume: "50 m³ et +", budget: "Sur devis" },
] as const;

const LONGUE_DISTANCE_PRICING_STATS = [
  {
    icon: Cube,
    label: "Prix au m³",
    value: "40 € – 90 € / m³",
    desc: "Selon la formule, le volume et la distance parcourue.",
  },
  {
    icon: Route,
    label: "Frais kilométriques",
    value: "1,20 € – 1,80 € / km",
    desc: "Tarif dégressif sur les très longues distances.",
  },
  {
    icon: ShieldCheck,
    label: "Assurance incluse",
    value: "Garantie contractuelle",
    desc: "Protection renforcée pour le transport longue distance.",
  },
] as const;

const LONGUE_DISTANCE_FAQ = [
  {
    question:
      "Combien coûte un déménagement longue distance en France, et quels facteurs influencent le prix final ?",
    answer:
      "Pour un déménagement longue distance en France métropolitaine, comptez entre 800 € et 4 500 € selon le volume (studio à appartement familial), la distance (ex. Paris–Lyon, Paris–Marseille), la formule choisie (Éco, Standard ou Luxe) et les contraintes d'accès. Les frais kilométriques pèsent davantage que sur un trajet local : le devis intègre la distance, le temps de transport et les protections renforcées. Guivarche établit un devis ferme et gratuit sous 24 h, sans frais cachés.",
  },
  {
    question:
      "Combien de temps dure un déménagement longue distance, du chargement à la livraison ?",
    answer:
      "Un déménagement longue distance s'étale généralement sur 2 à 4 jours selon la distance et le volume : chargement le jour J à l'adresse de départ, transport (souvent avec une nuit sur la route pour les trajets de plus de 500 km), puis livraison et installation à destination. Nous vous communiquons un planning précis dès la validation du devis, avec des créneaux de livraison cadrés.",
  },
  {
    question:
      "Proposez-vous une solution de garde-meubles ou de stockage temporaire entre deux dates de déménagement longue distance ?",
    answer:
      "Oui, Guivarche propose des solutions de garde-meubles et de stockage temporaire pour vos biens lors d'un déménagement longue distance : box sécurisés, accès sur rendez-vous et durée flexible (quelques jours à plusieurs mois). Idéal si vos dates de sortie et d'entrée ne coïncident pas, ou si vous souhaitez déstocker progressivement dans votre nouveau logement.",
  },
  {
    question:
      "Quelles régions et grandes villes de France desservez-vous pour un déménagement longue distance ?",
    answer:
      "Nous couvrons l'ensemble de la France métropolitaine : Paris et Île-de-France, Lyon, Marseille, Bordeaux, Toulouse, Lille, Nantes, Strasbourg, Nice, et toutes les grandes agglomérations. Que vous partiez du Nord vers le Sud, de l'Est vers l'Ouest ou inversement, nos équipes organisent le transport avec un itinéraire optimisé et un suivi de bout en bout.",
  },
  {
    question:
      "Comment sont protégés mes meubles et objets fragiles pendant un transport longue distance ?",
    answer:
      "Pour les longues distances, nous appliquons des protections renforcées : couvertures épaisses, films bulles, cartons adaptés, arrimage professionnel dans le camion et calage anti-mouvement. Les objets fragiles (vaisselle, miroirs, œuvres d'art) bénéficient d'un emballage spécifique. Chaque chargement est contrôlé avant le départ et à l'arrivée.",
  },
  {
    question:
      "Est-il possible de regrouper mon déménagement avec un autre trajet pour réduire les coûts ?",
    answer:
      "Oui, nous proposons des options de transport groupé lorsque plusieurs déménagements partagent un même axe géographique (ex. Paris–Sud, Lyon–Bordeaux). En mutualisant le camion, vous pouvez économiser jusqu'à 30-40 % sur les frais de transport. Contactez-nous avec votre ville de départ et d'arrivée pour vérifier les disponibilités.",
  },
  {
    question:
      "Quelle formule de déménagement — Économique, Standard ou Luxe — est la plus adaptée pour un trajet longue distance ?",
    answer:
      "Pour un déménagement longue distance, la formule Standard convient à la plupart des ménages : emballage des objets fragiles, démontage-remontage des meubles et transport sécurisé sur plusieurs centaines de kilomètres. La formule Économique est adaptée si vous préparez vos cartons vous-même. La formule Luxe inclut l'emballage intégral et une prise en charge clé en main — recommandée pour les trajets complexes ou les biens de valeur.",
  },
] as const;

export default function LongueDistanceSeo() {
  usePageMeta(PAGE_META.longueDistance);

  const navigate = useNavigate();

  const primaryCta = () => navigate(DEVIS_FORM_PATH);

  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={primaryCta} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[560px] lg:min-h-[620px]">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/gallery/D%C3%A9m%C3%A9nagement%20longue%20distance.jpeg"
              alt="Camion de déménagement longue distance sur route nationale"
              className="absolute inset-0 h-full w-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/65 via-[#1C3957]/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/75 via-[#0f172a]/20 to-[#0f172a]/30" />
            <div className="absolute inset-y-0 left-0 w-full max-w-[62%] bg-gradient-to-r from-black/55 via-black/25 to-transparent lg:max-w-[58%]" />
          </div>

          <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-14 sm:py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="relative lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-lg">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  France entière • Déménagement longue distance
                </div>
                <h1 className="mt-5 font-['Poppins',sans-serif] font-extrabold tracking-tight text-white text-3xl sm:text-4xl lg:text-5xl leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
                  Déménagement longue distance
                </h1>
                <p className="mt-4 text-[#f1f5f9] text-base sm:text-lg leading-relaxed max-w-2xl font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.65)]">
                  Devis sous 24 h, assurance incluse et tarifs transparents : un accompagnement de bout en bout pour
                  votre déménagement longue distance en France, sans stress et sans mauvaise surprise.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Devis gratuit sous 24 h, sans engagement",
                    "Protection renforcée longue distance",
                    "Équipes salariées Guivarche, zéro sous-traitance",
                    "Transport sécurisé partout en France",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#F5C76E] mt-0.5 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" />
                      <span className="text-sm sm:text-[15px] text-[#f8fafc] font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_10px_rgba(0,0,0,0.6)]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={primaryCta}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3.5 font-['Poppins',sans-serif] font-semibold text-white shadow-[0px_12px_30px_rgba(204,146,47,0.35)] hover:brightness-110 transition"
                  >
                    Demander un devis gratuit
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <ContactPhoneLink
                    variant="cta"
                    className="justify-center w-full sm:w-auto min-h-[3.25rem] py-3.5 text-base"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-[0px_20px_50px_rgba(15,23,42,0.25)] border border-white/40 p-6 sm:p-7">
                  <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg">
                    Ce que vous obtenez
                  </p>
                  <div className="mt-4 grid gap-3">
                    {[
                      { icon: <Truck className="h-5 w-5" />, title: "Transport dédié", desc: "Camions adaptés, arrimage renforcé et contrôle à chaque étape." },
                      { icon: <ShieldCheck className="h-5 w-5" />, title: "Assurance & sérénité", desc: "Protections premium pour les trajets de plusieurs centaines de km." },
                      { icon: <Timer className="h-5 w-5" />, title: "Planning maîtrisé", desc: "Créneaux de chargement et livraison cadrés, suivi en temps réel." },
                    ].map((x) => (
                      <div key={x.title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CC922F]/10 text-[#CC922F]">
                          {x.icon}
                        </div>
                        <div>
                          <div className="font-['Poppins',sans-serif] font-semibold text-[#191919] text-sm">
                            {x.title}
                          </div>
                          <div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                            {x.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#191919] text-white p-5">
                    <p className="font-['Poppins',sans-serif] font-semibold text-sm">
                      Astuce longue distance
                    </p>
                    <p className="mt-1 text-xs sm:text-[13px] text-white/80 leading-relaxed">
                      Plus votre inventaire et vos accès (étages, stationnement) sont précis, plus le devis est juste.
                      Anticipez aussi vos dates de sortie et d'entrée pour éviter les délais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fourchette tarifaire */}
        <section className="bg-white pt-14 sm:pt-16 lg:pt-20 px-4 sm:px-6 pb-14 sm:pb-16 lg:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl">
                Fourchette tarifaire longue distance
              </h2>
              <p className="mt-3 font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
                Tarifs indicatifs pour un déménagement longue distance en France métropolitaine (plus de 100 km).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-14 sm:mb-16">
              {LONGUE_DISTANCE_PRICING_STATS.map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#CC922F]/10 flex items-center justify-center mx-auto mb-4">
                    <card.icon className="w-7 h-7 text-[#CC922F]" />
                  </div>
                  <p className="font-['Poppins',sans-serif] font-semibold text-[#1C3957] text-sm uppercase tracking-wider mb-2">
                    {card.label}
                  </p>
                  <p className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-lg sm:text-xl mb-2">
                    {card.value}
                  </p>
                  <p className="font-['Poppins',sans-serif] text-slate-500 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-10 sm:mb-14">
              <h3 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl mb-3">
                Prix moyens par volume
              </h3>
              <p className="font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
                Tarifs indicatifs pour un déménagement interrégional (plus de 100 km).
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left">
                  <thead>
                    <tr className="bg-[#1C3957] text-white">
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Type de logement
                      </th>
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Volume estimé
                      </th>
                      <th className="font-['Poppins',sans-serif] font-semibold text-sm sm:text-base px-5 sm:px-8 py-4">
                        Budget moyen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {LONGUE_DISTANCE_PRICING_ROWS.map((row, i) => (
                      <tr
                        key={row.type}
                        className={`border-b border-slate-100 ${
                          i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                        } hover:bg-[#CC922F]/5 transition-colors`}
                      >
                        <td className="font-['Poppins',sans-serif] font-medium text-[#1C3957] text-sm sm:text-base px-5 sm:px-8 py-4">
                          {row.type}
                        </td>
                        <td className="font-['Poppins',sans-serif] text-slate-600 text-sm sm:text-base px-5 sm:px-8 py-4">
                          {row.volume}
                        </td>
                        <td className="font-['Poppins',sans-serif] font-semibold text-[#CC922F] text-sm sm:text-base px-5 sm:px-8 py-4">
                          {row.budget}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                type="button"
                onClick={primaryCta}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#CC922F] hover:bg-[#b5821f] text-white font-['Poppins',sans-serif] font-semibold px-8 py-3 text-base transition-colors"
              >
                Calculer mon volume exact
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Zones d'intervention */}
        <section>
          <InterventionMapNational />
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
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "Étape 1",
                title: "Devis en ligne ou par téléphone",
                desc: "Gratuit, sans engagement.",
              },
              {
                step: "Étape 2",
                title: "Visite technique à domicile",
                desc: "Obligatoire au-dessus d'un certain volume.",
              },
              {
                step: "Étape 3",
                title: "Jour J — chargement à l'adresse de départ",
                desc: "Avec l'équipe Guivarche.",
              },
              {
                step: "Étape 4",
                title: "Transport et livraison à destination",
                desc: "Vos meubles sont placés selon vos instructions.",
              },
            ].map((x) => (
              <div key={x.step} className="rounded-3xl border border-slate-100 bg-white shadow-[0px_10px_30px_rgba(15,23,42,0.06)] p-6">
                <div className="flex items-center justify-between">
                  <span className="font-['Poppins',sans-serif] font-extrabold text-[#CC922F] text-sm sm:text-base">
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
                  Partout en France
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Nous couvrons les déménagements interrégionaux et longue distance (Nord, Sud, Est, Ouest) : Paris,
                  Lyon, Marseille, Bordeaux, Toulouse, Lille, Nantes, Strasbourg et toutes les grandes villes de France.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    "Déménagement appartement / maison",
                    "Transfert bureaux / commerces",
                    "Transport groupé sur demande",
                    "Options d'emballage & démontage",
                  ].map((x) => (
                    <div key={x} className="flex items-start gap-2 rounded-2xl bg-white border border-slate-100 p-4">
                      <CheckCircle2 className="h-5 w-5 text-[#CC922F] mt-0.5" />
                      <span className="text-sm text-slate-700">{x}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white border border-slate-100 shadow-[0px_14px_40px_rgba(15,23,42,0.08)] p-6 sm:p-7">
                  <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg">
                    Prêt pour votre déménagement longue distance ?
                  </p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Lancez votre devis en 2 minutes. Vous pouvez affiner ensuite (options, accès, dates).
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={primaryCta}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#CC922F] px-6 py-3 font-['Poppins',sans-serif] font-semibold text-white hover:brightness-95 transition"
                    >
                      Démarrer mon devis
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/contact/")}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-['Poppins',sans-serif] font-semibold text-[#191919] hover:bg-slate-50 transition"
                    >
                      Être rappelé
                    </button>
                    <ContactPhoneLink variant="inline" className="justify-center" />
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Réponse rapide • Devis clair • Équipe pro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <DestinationFaqSection
          title="FAQ spécifique longue distance"
          subtitle="Réponses ciblées sur les déménagements longue distance : tarifs, délais, protections et logistique."
          items={LONGUE_DISTANCE_FAQ}
        />

        <GoogleReviewsSection />

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

              <div className={gradientCtaActionsClass}>
                <button type="button" onClick={primaryCta} className={gradientCtaPrimaryClass}>
                  Obtenir un devis gratuit
                </button>

                <a href="/contact/" className={gradientCtaOutlineClass}>
                  Nous contacter
                </a>

                <ContactPhoneLink variant="cta" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
