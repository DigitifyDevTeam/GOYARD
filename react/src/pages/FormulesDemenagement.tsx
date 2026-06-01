import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CuboidIcon as Cube,
  MapPin,
  ShieldCheck,
  Truck,
  Building,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
  Lightbulb,
  CalendarCheck,
  Scissors,
  Clock,
  Box,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import {
  gradientCtaActionsClass,
  gradientCtaOutlineButtonClass,
  gradientCtaPrimaryButtonClass,
} from "../components/gradientCtaStyles";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const pricingData = [
  { type: "Studio / Chambre", volume: "10 – 15 m³", budget: "450 € – 850 €" },
  { type: "Appartement T2 / T3", volume: "20 – 30 m³", budget: "800 € – 1 600 €" },
  { type: "Appartement T4 / T5", volume: "35 – 45 m³", budget: "1 400 € – 2 400 €" },
  { type: "Maison familiale", volume: "50 m³ et +", budget: "Sur devis" },
];

const pillars = [
  {
    icon: Cube,
    title: "Le volume total (m³)",
    desc: "C'est le facteur n°1. Il détermine la taille du camion et le nombre de déménageurs requis.",
  },
  {
    icon: MapPin,
    title: "La distance (km)",
    desc: "Inclut le carburant, les péages et le temps de trajet des équipes.",
  },
  {
    icon: Building,
    title: "Les accès et étages",
    desc: "L'absence d'ascenseur ou un portage long augmente le temps de travail.",
  },
  {
    icon: Sparkles,
    title: "La formule choisie",
    desc: "Du simple transport (Éco) au service tout-compris (Luxe).",
  },
];

const tips = [
  { icon: CalendarCheck, text: "Déménager en milieu de semaine ou de mois" },
  { icon: Box, text: "Opter pour une formule « Économique » et faire vos cartons" },
  { icon: Scissors, text: "Faire un tri drastique avant l'estimation" },
  { icon: Clock, text: "Réserver 2 mois à l'avance pour bloquer le tarif" },
];

interface FAQItem {
  q: string;
  a: string;
}

const faqItems: FAQItem[] = [
  {
    q: "La visite technique est-elle payante ?",
    a: "Non, la visite technique à votre domicile est entièrement gratuite et sans engagement. Elle nous permet d'évaluer précisément le volume de votre déménagement et de vous fournir un devis au plus juste.",
  },
  {
    q: "Le prix du devis peut-il changer le jour J ?",
    a: "Non. Le devis que nous vous remettons est un devis ferme et définitif. Aucun supplément ne vous sera facturé, sauf si vous ajoutez des prestations ou du volume supplémentaire le jour du déménagement.",
  },
  {
    q: "L'assurance est-elle un coût supplémentaire ?",
    a: "Non, une assurance de base est incluse dans toutes nos prestations. Des options d'assurance complémentaire « tous risques » sont disponibles pour une protection renforcée de vos biens les plus précieux.",
  },
];

function FAQAccordion({ items }: Readonly<{ items: FAQItem[] }>) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <motion.div
            key={item.q}
            className="border border-slate-200 rounded-xl overflow-hidden bg-white"
            initial={false}
          >
            <button
              className="w-full flex items-center justify-between px-6 py-5 text-left group"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <span className="font-['Poppins',sans-serif] font-semibold text-[#1C3957] text-base sm:text-lg pr-4">
                {item.q}
              </span>
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#CC922F]/10 flex items-center justify-center group-hover:bg-[#CC922F]/20 transition-colors">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#CC922F]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#CC922F]" />
                )}
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-slate-600 font-['Poppins',sans-serif] text-sm sm:text-base leading-relaxed">
                {item.a}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function FormulesDemenagement() {
  usePageMeta(PAGE_META.formulesDemenagement);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-['Poppins',sans-serif] font-medium px-4 py-2 rounded-full mb-6">
                <Truck className="w-4 h-4" />
                Formules & Tarifs 2025
              </span>
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-['Poppins',sans-serif] leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Formules de déménagement :{" "}
              <span className="text-[#CC922F]">estimez votre budget.</span>
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/85 max-w-3xl mx-auto font-['Poppins',sans-serif] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Découvrez comment est calculé le prix d'un déménagement professionnel.
              De l'estimation au m³ aux frais kilométriques, nous jouons la carte
              de la transparence totale.
            </motion.p>
          </div>
        </section>

        {/* ─── Stat Cards ─── */}
        <section className="relative -mt-12 sm:-mt-14 z-10 px-4 sm:px-6">
          <motion.div
            className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Cube,
                label: "Prix au m³",
                value: "35 € – 75 € / m³",
                desc: "Selon la formule et la complexité des accès.",
              },
              {
                icon: MapPin,
                label: "Frais kilométriques",
                value: "1,50 € – 2,20 € / km",
                desc: "Pour les trajets longue distance.",
              },
              {
                icon: ShieldCheck,
                label: "Assurance incluse",
                value: "Garantie contractuelle",
                desc: "Protection de votre patrimoine incluse.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                variants={fadeUp}
                custom={i}
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
                <p className="font-['Poppins',sans-serif] text-slate-500 text-sm">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── Pricing Table ─── */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-10 sm:mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl mb-3">
                Prix moyens par volume
              </h2>
              <p className="font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
                Tarifs indicatifs pour un déménagement local (moins de 50 km).
              </p>
            </motion.div>

            <motion.div
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <table className="w-full text-left">
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
                  {pricingData.map((row, i) => (
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
            </motion.div>

            <div className="text-center mt-8">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="bg-[#CC922F] hover:bg-[#b5821f] text-white font-['Poppins',sans-serif] font-semibold px-8 py-3 rounded-full text-base"
                  onClick={() => navigate("/tunnel/mes-coordonnees")}
                >
                  Calculer mon volume exact
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── 4 Pillars ─── */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl mb-3">
                Les 4 piliers du{" "}
                <span className="text-[#CC922F]">coût final</span>.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  custom={i}
                  className="flex gap-5 p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] flex items-center justify-center flex-shrink-0 group-hover:from-[#CC922F] group-hover:to-[#b5821f] transition-all duration-300">
                    <p.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Poppins',sans-serif] font-semibold text-[#1C3957] text-lg mb-1">
                      {p.title}
                    </h3>
                    <p className="font-['Poppins',sans-serif] text-slate-500 text-sm leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Tips ─── */}
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-[#CC922F]/20 flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-[#CC922F]" />
                </div>
                <h2 className="font-['Poppins',sans-serif] font-bold text-white text-2xl sm:text-3xl mb-2">
                  Comment économiser ?
                </h2>
                <p className="font-['Poppins',sans-serif] text-white/70 text-sm sm:text-base max-w-sm">
                  Quelques astuces pour optimiser votre budget déménagement.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {tips.map((tip, i) => (
                  <motion.div
                    key={tip.text}
                    className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#CC922F] flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-['Poppins',sans-serif] text-white text-sm sm:text-base leading-relaxed">
                      {tip.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-10 sm:mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-['Poppins',sans-serif] font-bold text-[#1C3957] text-2xl sm:text-3xl lg:text-4xl mb-3">
                Questions sur les prix
              </h2>
              <p className="font-['Poppins',sans-serif] text-slate-500 text-base sm:text-lg">
                Clarifiez vos doutes avant de demander votre chiffrage.
              </p>
            </motion.div>

            <FAQAccordion items={faqItems} />
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center">
              <motion.div
                className="inline-flex items-center gap-2 mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-8 h-8" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]">
                Votre devis ferme sous 24 heures.
              </h2>

              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Ne restez pas dans le flou. Obtenez une estimation précise et
                personnalisée pour votre prochain changement d'adresse.
              </p>

              <div className={gradientCtaActionsClass}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className={gradientCtaPrimaryButtonClass}
                    onClick={() => navigate("/tunnel/mes-coordonnees")}
                  >
                    Demander mon devis gratuit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className={gradientCtaOutlineButtonClass}
                    onClick={() => navigate("/contact")}
                  >
                    Nous contacter
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ContactPhoneLink variant="cta" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
