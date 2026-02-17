import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Rgpd() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6 font-['Poppins',sans-serif]">
              Politique de Protection des Données (RGPD)
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
              Vos données personnelles sont protégées conformément au Règlement Général sur la Protection des Données
            </p>
          </div>
        </section>

        {/* RGPD Content */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
          
          <div className="space-y-8 text-gray-700">
            {/* Responsable du traitement Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Responsable du traitement</h2>
              <p className="leading-relaxed">
                <span className="font-medium">Guivarche Déménagement</span> est responsable du traitement des données personnelles collectées sur ce site web.
                Pour toute question concernant la protection de vos données, vous pouvez nous contacter à l'adresse{" "}
                <a href="mailto:contact@guivarche-demenagement.fr" className="text-[#CC922F] hover:underline">
                  contact@guivarche-demenagement.fr
                </a>.
              </p>
            </section>

            {/* Données collectées Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Données collectées</h2>
              <p className="leading-relaxed mb-4">
                Nous collectons les données suivantes lors de votre utilisation de notre site et de nos services :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Adresses de déménagement (départ et arrivée)</li>
                <li>Informations relatives à votre demande de devis (volume, date, services souhaités)</li>
                <li>Données de navigation (cookies, adresse IP, pages visitées)</li>
              </ul>
            </section>

            {/* Finalité du traitement Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Finalité du traitement</h2>
              <p className="leading-relaxed mb-4">
                Vos données personnelles sont collectées et traitées pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Répondre à vos demandes de devis et d'information</li>
                <li>Vous contacter concernant nos services de déménagement</li>
                <li>Gérer et suivre votre dossier de déménagement</li>
                <li>Améliorer notre site web et nos services</li>
                <li>Réaliser des analyses statistiques</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>

            {/* Base légale Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Base légale du traitement</h2>
              <p className="leading-relaxed">
                Le traitement de vos données personnelles est fondé sur :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li><span className="font-medium">Votre consentement</span> lors de la soumission de formulaires</li>
                <li><span className="font-medium">L'exécution du contrat</span> de prestation de services de déménagement</li>
                <li><span className="font-medium">Le respect d'obligations légales</span> auxquelles nous sommes soumis</li>
                <li><span className="font-medium">Notre intérêt légitime</span> à améliorer nos services et à communiquer avec nos clients</li>
              </ul>
            </section>

            {/* Conservation des données Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Conservation des données</h2>
              <p className="leading-relaxed">
                Vos données personnelles sont conservées pendant une durée maximale de <span className="font-medium">3 ans</span> à compter 
                de leur collecte ou du dernier contact de votre part. Au-delà de cette période, vos données seront supprimées ou anonymisées, 
                sauf obligation légale de conservation plus longue (par exemple, pour les documents comptables et fiscaux).
              </p>
            </section>

            {/* Vos droits Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Vos droits</h2>
              <p className="leading-relaxed mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-[#1C3957]">• Droit d'accès :</span> Vous pouvez obtenir la confirmation que vos données sont traitées et accéder à ces données
                </li>
                <li>
                  <span className="font-medium text-[#1C3957]">• Droit de rectification :</span> Vous pouvez demander la correction de données inexactes ou incomplètes
                </li>
                <li>
                  <span className="font-medium text-[#1C3957]">• Droit à l'effacement :</span> Vous pouvez demander la suppression de vos données dans certaines conditions
                </li>
                <li>
                  <span className="font-medium text-[#1C3957]">• Droit à la limitation du traitement :</span> Vous pouvez demander la limitation du traitement de vos données
                </li>
                <li>
                  <span className="font-medium text-[#1C3957]">• Droit à la portabilité :</span> Vous pouvez recevoir vos données dans un format structuré et lisible par machine
                </li>
                <li>
                  <span className="font-medium text-[#1C3957]">• Droit d'opposition :</span> Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière
                </li>
                <li>
                  <span className="font-medium text-[#1C3957]">• Droit de retirer votre consentement :</span> Lorsque le traitement est fondé sur votre consentement
                </li>
              </ul>
              <p className="leading-relaxed mt-6">
                Pour exercer ces droits, contactez-nous à :{" "}
                <a href="mailto:contact@guivarche-demenagement.fr" className="text-[#CC922F] hover:underline font-medium">
                  contact@guivarche-demenagement.fr
                </a>
              </p>
              <p className="leading-relaxed mt-4 text-sm">
                Vous disposez également du droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) 
                si vous estimez que le traitement de vos données constitue une violation de la réglementation en vigueur.
              </p>
            </section>

            {/* Sécurité Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Sécurité</h2>
              <p className="leading-relaxed">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre 
                tout accès non autorisé, modification, divulgation ou destruction. Ces mesures comprennent notamment :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Le chiffrement des données sensibles</li>
                <li>Des contrôles d'accès stricts</li>
                <li>Des sauvegardes régulières</li>
                <li>La formation de notre personnel à la protection des données</li>
                <li>Des audits de sécurité réguliers</li>
              </ul>
            </section>

            {/* Partage des données Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Partage des données</h2>
              <p className="leading-relaxed">
                Vos données personnelles peuvent être partagées avec :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Nos sous-traitants et prestataires de services (uniquement dans le cadre de l'exécution de leurs missions)</li>
                <li>Les autorités compétentes lorsque la loi l'exige</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Nous ne vendons ni ne louons vos données personnelles à des tiers à des fins marketing.
              </p>
            </section>

            {/* Cookies Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Cookies et technologies similaires</h2>
              <p className="leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser l'utilisation du site. 
                Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur. Pour plus d'informations, 
                consultez notre page{" "}
                <a href="/mentions-legales" className="text-[#CC922F] hover:underline">
                  Mentions légales
                </a>.
              </p>
            </section>

            {/* Modifications Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[#1C3957] mb-4">Modifications de la politique</h2>
              <p className="leading-relaxed">
                Nous nous réservons le droit de modifier cette politique de protection des données à tout moment. 
                Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à consulter 
                régulièrement cette page pour rester informé de la manière dont nous protégeons vos données.
              </p>
              <p className="leading-relaxed mt-4">
                <span className="font-medium">Dernière mise à jour :</span> Janvier 2025
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

