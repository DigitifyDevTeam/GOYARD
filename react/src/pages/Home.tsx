import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue sur BrasenPlus
            </h1>
            <p className="text-lg text-gray-600">
              Votre déménagement simplifié
            </p>
          </header>

          {/* Main Content */}
          <main className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Page d'accueil
              </h2>
              <p className="text-gray-600 mb-8">
                Cette page est prête pour votre contenu personnalisé.
              </p>
              
              {/* Placeholder content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Section 1
                  </h3>
                  <p className="text-gray-600">
                    Contenu de la première section
                  </p>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Section 2
                  </h3>
                  <p className="text-gray-600">
                    Contenu de la deuxième section
                  </p>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Section 3
                  </h3>
                  <p className="text-gray-600">
                    Contenu de la troisième section
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center mt-8 text-gray-500">
            <p>&copy; 2025 BrasenPlus. Tous droits réservés.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
