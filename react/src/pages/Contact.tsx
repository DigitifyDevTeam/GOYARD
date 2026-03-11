import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GlobeFeatureSection from "../components/ui/globe-feature-section";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]">
              Contactez-nous
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
              Une question ? Un projet de déménagement ? Notre équipe est là pour vous accompagner.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C3957] mb-6 sm:mb-8 font-['Poppins',sans-serif]">
                    Contactez nous
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 font-['Poppins',sans-serif]">
                    N'hésitez pas à nous contacter par téléphone, email ou via le formulaire ci-contre. 
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Phone */}
                  <div className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#CC922F] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">Téléphone</h3>
                      <a href="tel:+33746326678" className="text-gray-600 text-lg hover:text-[#CC922F] transition-colors font-['Poppins',sans-serif]">
                        +33 7 46 32 66 78
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#CC922F] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">Email</h3>
                      <a href="mailto:contact@guivarchedemenagement.fr" className="text-gray-600 text-lg break-all hover:text-[#CC922F] transition-colors font-['Poppins',sans-serif]">
                        contact@guivarchedemenagement.fr
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#CC922F] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">Adresse</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">
                      25 Rue de Cîteaux, 75012 Paris, France<br />
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#CC922F] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">Horaires</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">
                        Lundi - Vendredi: 8h - 18h<br />
                        Samedi: 9h - 17h
                      </p>
                    </div>
                  </div>

                  {/* Facebook */}
                  <a href="https://www.facebook.com/profile.php?id=61587408931997" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow hover:opacity-90">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">Facebook</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">Community Chat</p>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a href="https://www.instagram.com/guivarche_demenagement/" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow hover:opacity-90">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">Instagram</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">Visual Stories</p>
                    </div>
                  </a>

                  {/* LinkedIn - no link for now */}
                  <div className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl transition-shadow opacity-75">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#0A66C2] rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">LinkedIn</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">Professional Network</p>
                    </div>
                  </div>

                  {/* YouTube */}
                  <a href="https://www.youtube.com/@Guivarchedem" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow hover:opacity-90">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#FF0000] rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">YouTube</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">Vidéos & Tutoriels</p>
                    </div>
                  </a>

                  {/* TikTok */}
                  <a href="https://www.tiktok.com/@guivarche_demenagement" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow hover:opacity-90">
                    <div className="flex-shrink-0 w-14 h-14 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">TikTok</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">@guivarche_demenagement</p>
                    </div>
                  </a>

                  {/* Pages Jaunes */}
                  <a href="https://www.pagesjaunes.fr/pros/64768014" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 sm:space-x-5 p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-md transition-shadow hover:opacity-90">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#FFD700] rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#333]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C3957] mb-2 text-lg font-['Poppins',sans-serif]">Pages Jaunes</h3>
                      <p className="text-gray-600 text-lg font-['Poppins',sans-serif]">Annuaire professionnel</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg font-['Poppins',sans-serif]">
                    ✓ Votre message a été envoyé avec succès ! Nous vous contacterons bientôt.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-3 font-['Poppins',sans-serif]">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC922F] focus:border-transparent outline-none transition-all font-['Poppins',sans-serif]"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-3 font-['Poppins',sans-serif]">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC922F] focus:border-transparent outline-none transition-all font-['Poppins',sans-serif]"
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-3 font-['Poppins',sans-serif]">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC922F] focus:border-transparent outline-none transition-all font-['Poppins',sans-serif]"
                        placeholder="+33 6 00 00 00 00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-base font-semibold text-gray-700 mb-3 font-['Poppins',sans-serif]">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC922F] focus:border-transparent outline-none transition-all font-['Poppins',sans-serif]"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="devis">Demande de devis</option>
                      <option value="info">Demande d'information</option>
                      <option value="reclamation">Réclamation</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-3 font-['Poppins',sans-serif]">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-5 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC922F] focus:border-transparent outline-none transition-all resize-none font-['Poppins',sans-serif]"
                      placeholder="Décrivez votre projet ou votre demande..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1C3957] text-white py-5 px-8 rounded-lg font-semibold hover:bg-[#2a4f6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Poppins',sans-serif] text-lg shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Globe Feature Section */}
        <section className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1600px] mx-auto">
            <GlobeFeatureSection />
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-[#1C3957] to-[#2a4f6b] py-10 sm:py-12 lg:py-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center text-white">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#CC922F] mb-2 font-['Poppins',sans-serif]">23+</div>
                <div className="text-white/90 font-['Poppins',sans-serif]">Ans d'expérience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#CC922F] mb-2 font-['Poppins',sans-serif]">780</div>
                <div className="text-white/90 font-['Poppins',sans-serif]">Déménagements/mois</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#CC922F] mb-2 font-['Poppins',sans-serif]">22</div>
                <div className="text-white/90 font-['Poppins',sans-serif]">Camions disponibles</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#CC922F] mb-2 font-['Poppins',sans-serif]">500+</div>
                <div className="text-white/90 font-['Poppins',sans-serif]">Avis positifs</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

