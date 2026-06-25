import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import { DEVIS_FORM_PATH } from "../constants/parisLp";

export default function EnConstruction() {
  usePageMeta(PAGE_META.enConstruction);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl text-center bg-white rounded-2xl shadow-md px-8 py-10">
          <p className="text-sm font-['Poppins',sans-serif] font-semibold uppercase tracking-[0.2em] text-[#CC922F] mb-3">
            Page en construction
          </p>
          <h1 className="font-['Poppins',sans-serif] font-[700] text-2xl sm:text-3xl text-[#1c3957] mb-4">
            Cette section arrive très bientôt
          </h1>
          <p className="font-['Poppins',sans-serif] text-sm sm:text-base text-slate-600 mb-6">
            Nous finalisons actuellement le contenu de cette page pour vous proposer des informations
            détaillées sur nos zones d&apos;intervention et nos outils. En attendant, vous pouvez demander
            un devis en ligne ou revenir à l&apos;accueil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={DEVIS_FORM_PATH}
              className="inline-flex items-center justify-center rounded-md bg-[#1c3957] px-5 py-2.5 text-sm font-['Poppins',sans-serif] font-semibold text-white hover:bg-[#2a4f6b] transition-colors"
            >
              Demander un devis
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 px-5 py-2.5 text-sm font-['Poppins',sans-serif] font-semibold text-[#1c3957] hover:bg-slate-50 transition-colors"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

