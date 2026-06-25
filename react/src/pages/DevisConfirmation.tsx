import { useNavigate } from "react-router-dom";
import { Phone, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import Footer from "../components/layout/Footer";

const TUNNEL_SUPPORT_PHONE_HREF = "tel:+33189703324";
const TUNNEL_SUPPORT_PHONE_DISPLAY = "+33 1 89 70 33 24";

/** Post-submit confirmation after Paris LP devis form (`/tunnel/devis/confirmation`). */
export default function DevisConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              <img
                src="/logo.svg"
                alt="Guivarche Déménagement"
                className="h-16 sm:h-24 lg:h-32 w-auto"
              />
            </button>
          </div>
          <a
            href={TUNNEL_SUPPORT_PHONE_HREF}
            className="inline-flex items-center bg-[#1c3957] text-white px-4 py-2 rounded-full no-underline hover:bg-[#2a4f6b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2"
            aria-label={`Appeler au ${TUNNEL_SUPPORT_PHONE_DISPLAY}`}
          >
            <Phone className="w-4 h-4 mr-2" style={{ color: "#CC922F" }} />
            <span className="text-sm font-medium">{TUNNEL_SUPPORT_PHONE_DISPLAY}</span>
            <span className="text-xs ml-2 opacity-90">Numéro non surtaxé</span>
          </a>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 px-6 py-8 sm:px-10 sm:py-12 text-center max-w-xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
            Votre demande de devis a bien été envoyée
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mb-6">
            Merci de votre confiance. Un conseiller vous contactera très prochainement pour finaliser votre
            déménagement.
          </p>
          <Button
            className="w-full sm:w-auto bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
            onClick={() => navigate("/")}
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
