import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Timer, Truck } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ZoneIleDeFrance() {
  const navigate = useNavigate();

  const primaryCta = () => navigate("/tunnel/mes-coordonnees");

  return (
    <div className="min-h-screen bg-white">
      <Header onGetQuote={primaryCta} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_20%,rgba(204,146,47,0.22),transparent_60%),radial-gradient(900px_500px_at_85%_10%,rgba(25,25,25,0.10),transparent_55%)]" />
          <div className="relative w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-[90px] xl:px-[210px] py-12 sm:py-14 lg:py-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700">
                  <MapPin className="h-4 w-4 text-[#CC922F]" />
                  Île-de-France • Déménagement local & régional
                </div>
                <h1 className="mt-4 font-['Poppins',sans-serif] font-extrabold tracking-tight text-[#191919] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Déménagement en Île-de-France, sans stress.
                </h1>
                <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Une équipe réactive autour de Paris pour des déménagements efficaces, soignés et parfaitement organisés. Devis
                  rapide, dates flexibles, protection premium.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "Intervention rapide (Paris & banlieue)",
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
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-['Poppins',sans-serif] font-semibold text-[#191919] hover:bg-slate-50 transition"
                  >
                    Parler à un conseiller
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-white shadow-[0px_14px_45px_rgba(15,23,42,0.10)] border border-slate-100 p-6 sm:p-7">
                  <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg">
                    Ce que vous obtenez
                  </p>
                  <div className="mt-4 grid gap-3">
                    {[
                      { icon: <Truck className="h-5 w-5" />, title: "Transport sécurisé", desc: "Camions adaptés, arrimage et protections." },
                      { icon: <ShieldCheck className="h-5 w-5" />, title: "Assurance & sérénité", desc: "Options claires selon la valeur de vos biens." },
                      { icon: <Timer className="h-5 w-5" />, title: "Créneaux flexibles", desc: "Interventions tôt, tard ou week-end selon dispo." },
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
                      Astuce Île-de-France
                    </p>
                    <p className="mt-1 text-xs sm:text-[13px] text-white/80 leading-relaxed">
                      Accès étroits, étages, stationnement… Donnez-nous les détails et on prévoit le bon matériel (sangles,
                      protections, monte-meubles si besoin).
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                  Zone couverte
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Intervention sur toute l’Île-de-France : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91),
                  Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d’Oise (95).
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
                <div className="rounded-3xl bg-white border border-slate-100 shadow-[0px_14px_40px_rgba(15,23,42,0.08)] p-6 sm:p-7">
                  <p className="font-['Poppins',sans-serif] font-bold text-[#191919] text-lg">
                    Prêt à déménager en Île-de-France ?
                  </p>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Lancez votre devis en 2 minutes. Vous pouvez affiner ensuite (options, accès, dates).
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
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
                      onClick={() => navigate("/contact")}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-['Poppins',sans-serif] font-semibold text-[#191919] hover:bg-slate-50 transition"
                    >
                      Être rappelé
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Réponse rapide • Devis clair • Équipe pro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

