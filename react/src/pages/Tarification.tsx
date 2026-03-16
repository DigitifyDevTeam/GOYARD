import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import TarificationSection from "../components/TarificationSection";

export default function Tarification() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]">
              Tarification
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
Votre déménagement simple & intelligent : choisissez la formule qui vous correspond.            </p>
          </div>
        </section>

        <TarificationSection />
      </main>

      <Footer />
    </div>
  );
}
