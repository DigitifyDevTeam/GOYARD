import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 font-['Poppins',sans-serif]">
              Mentions légales
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
              Informations légales et conditions d'utilisation du site Goyard Déménagement
            </p>
          </div>
        </section>

        {/* Legal Content */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
          
          <div className="space-y-8 text-gray-700">
            {/* Éditeur Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Éditeur</h2>
              <div className="space-y-2">
                <p className="text-lg font-medium">Goyard Déménagement</p>
                <p>Adresse : [Adresse de l'entreprise]</p>
                <p>Téléphone : +33 76 65 87 98 76</p>
                <p>Email : contact@goyard-demenagement.fr</p>
              </div>
            </section>

            {/* Hébergement Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Hébergement</h2>
              <div className="space-y-2">
                <p>Ce site est hébergé par [Nom de l'hébergeur]</p>
                <p>Adresse : [Adresse de l'hébergeur]</p>
              </div>
            </section>

            {/* Propriété intellectuelle Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Propriété intellectuelle</h2>
              <p className="leading-relaxed">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. 
                La reproduction de tout ou partie de ce site sur un support électronique ou autre quel qu'il soit, est formellement interdite sauf autorisation expresse 
                du directeur de la publication. Les marques citées sur ce site sont déposées par les sociétés qui en sont propriétaires.
              </p>
            </section>

            {/* Responsabilité Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Responsabilité</h2>
              <p className="leading-relaxed">
                Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois 
                contenir des inexactitudes, des omissions ou des lacunes. Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, 
                merci de bien vouloir le signaler par email à l'adresse{" "}
                <a href="mailto:contact@goyard-demenagement.fr" className="text-[#CC922F] hover:underline">
                  contact@goyard-demenagement.fr
                </a>, en décrivant le problème de la manière la plus précise possible 
                (page posant problème, action déclenchante, type d'ordinateur et de navigateur utilisé, etc.).
              </p>
              <p className="leading-relaxed mt-4">
                Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. En conséquence, Goyard Déménagement 
                ne saurait être tenu responsable d'un quelconque dommage subi par l'ordinateur de l'utilisateur ou d'une quelconque perte de données 
                consécutive au téléchargement.
              </p>
            </section>

            {/* Protection des données personnelles Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Protection des données personnelles</h2>
              <p className="leading-relaxed">
                Conformément aux dispositions de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, 
                vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données qui vous concernent. 
                Pour exercer ce droit, vous pouvez nous contacter par email à l'adresse{" "}
                <a href="mailto:contact@goyard-demenagement.fr" className="text-[#CC922F] hover:underline">
                  contact@goyard-demenagement.fr
                </a>.
              </p>
            </section>

            {/* Cookies Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Cookies</h2>
              <p className="leading-relaxed">
                Le site peut être amené à vous demander l'acceptation des cookies pour des besoins de statistiques et d'affichage. 
                Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez. Il contient plusieurs données 
                qui sont stockées sur votre ordinateur dans un simple fichier texte auquel un serveur accède pour lire et enregistrer des informations.
              </p>
            </section>

            {/* Droit applicable Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Droit applicable et juridiction compétente</h2>
              <p className="leading-relaxed">
                Tout litige en relation avec l'utilisation du site{" "}
                <span className="font-medium">www.goyard-demenagement.fr</span> est soumis au droit français. 
                Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
              </p>
            </section>
          </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

