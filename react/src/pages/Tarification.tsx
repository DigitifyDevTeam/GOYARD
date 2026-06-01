import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ContactPhoneLink } from "../components/ContactPhoneLink";
import {
  gradientCtaActionsClass,
  gradientCtaOutlineButtonClass,
  gradientCtaPrimaryButtonClass,
} from "../components/gradientCtaStyles";
import TarificationSection from "../components/TarificationSection";
import WhyUs from "../components/WhyUs";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";

export default function Tarification() {
  usePageMeta(PAGE_META.tarif);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]">
              Tarifs de Déménagement : Estimez le Coût de Votre Projet
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
              Votre déménagement simple & intelligent : choisissez la formule qui vous correspond.
            </p>
          </div>
        </section>

        <TarificationSection />

        <WhyUs />

        {/* CTA Section (copied from Solution page) */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#CC922F] to-[#1C3957] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center">
              <motion.div
                className="inline-flex items-center gap-2 mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-8 h-8" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-['Poppins',sans-serif]">
                Prêt à déménager en toute sérénité ?
              </h2>

              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                Rejoignez des milliers de clients qui ont déjà fait confiance à Guivarche.
                Obtenez votre devis gratuit maintenant !
              </p>

              <div className={gradientCtaActionsClass}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className={gradientCtaPrimaryButtonClass}
                    onClick={() => (window.location.href = "/tunnel/mes-coordonnees")}
                  >
                    Obtenir un devis gratuit
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className={gradientCtaOutlineButtonClass}
                    onClick={() => (window.location.href = "/contact")}
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
