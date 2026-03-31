 {/* ════════════════════════════════════════════════════════════
            SECTION 2 — DÉMÉNAGEMENT PROFESSIONNEL
        ════════════════════════════════════════════════════════════ */}

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center px-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#CC922F]/40 to-transparent" />
          </div>
        </div>

        {/* Hero Professionnel */}
        <section className="relative bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#CC922F] rounded-full blur-3xl" />
            <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Building2 className="h-4 w-4 text-[#CC922F]" />
              <span className="text-sm font-medium text-white font-['Poppins',sans-serif]">
                Déménagement professionnel
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Transfert d'entreprise{" "}
              <span className="text-[#CC922F]">sans interruption</span>{" "}
              d'activité
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8 font-['Poppins',sans-serif]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              PME, grands comptes, administrations — nous gérons la logistique
              complète
            </motion.p>

            {/* Inline Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {proStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[#CC922F] font-['Poppins',sans-serif]">
                    +{stat.value}
                    {stat.suffix}
                  </div>
                  <p className="text-white/80 text-sm mt-1 font-['Poppins',sans-serif]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Domaines d'intervention */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Globe className="h-4 w-4" />}
              pill="Notre expertise"
              pillColor="gold"
              title="Nos domaines d'intervention"
              subtitle="Des solutions spécialisées pour chaque type d'activité"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {proDomaines.map((domaine, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] p-6 sm:p-8 rounded-2xl border border-[#1C3957] text-center group hover:from-[#2a4f6b] hover:to-[#1C3957] hover:shadow-xl shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#CC922F] flex items-center justify-center mx-auto mb-6 text-white group-hover:bg-[#CC922F]/90 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {domaine.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-white font-['Poppins',sans-serif]">
                    {domaine.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed font-['Poppins',sans-serif] text-sm">
                    {domaine.description}
                  </p>
                  <motion.div className="w-10 h-0.5 bg-[#CC922F] mt-6 mx-auto group-hover:w-16 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Offres Entreprises */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Star className="h-4 w-4" />}
              pill="Offres entreprises"
              pillColor="navy"
              title="Nos offres entreprises"
              subtitle="Des formules pensées pour chaque taille d'organisation"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
              {proFormules.map((formule, index) => (
                <PricingCard key={index} index={index} {...formule} />
              ))}
            </div>
          </div>
        </section>

        {/* Notre méthode projet */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Calendar className="h-4 w-4" />}
              pill="Méthode projet"
              pillColor="gold"
              title="Notre méthode projet"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 max-w-4xl mx-auto relative">
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#1C3957]/20 via-[#1C3957] to-[#1C3957]/20" />
              {proSteps.map((step, index) => (
                <StepCard key={index} index={index} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* Engagements */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionHeader
              icon={<Shield className="h-4 w-4" />}
              pill="Nos garanties"
              pillColor="navy"
              title="Nos engagements pour les entreprises"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {proEngagements.map((eng, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:border-[#CC922F]/30 transition-all duration-300"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -3,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-[#CC922F]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#CC922F]">{eng.icon}</span>
                  </div>
                  <p className="text-[#1C3957] font-medium font-['Poppins',sans-serif] text-sm sm:text-base">
                    {eng.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ils nous ont fait confiance */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <SectionHeader
              icon={<Users className="h-4 w-4" />}
              pill="Références"
              pillColor="gold"
              title="Ils nous ont fait confiance"
            />

            <motion.div
              className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {proSectors.map((sector, index) => (
                <motion.span
                  key={index}
                  className="px-5 py-2.5 bg-gradient-to-br from-[#1C3957] to-[#2a4f6b] text-white rounded-full text-sm font-medium font-['Poppins',sans-serif] shadow-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{
                    scale: 1.08,
                    transition: { duration: 0.2 },
                  }}
                >
                  {sector}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Professionnel */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#1C3957] to-[#CC922F] text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white rounded-full blur-2xl" />
              </div>
              <div className="relative z-10">
                <motion.div
                  className="inline-flex items-center gap-2 mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Building2 className="w-8 h-8" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Poppins',sans-serif]">
                  Planifiez votre transfert
                </h2>
                <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto font-['Poppins',sans-serif]">
                  Parlez à un chef de projet en moins de 24h
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-[#1C3957] hover:bg-gray-50 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                      onClick={() => (window.location.href = "/contact")}
                    >
                      Demander un devis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-lg font-['Poppins',sans-serif]"
                      onClick={() => (window.location.href = "/solution")}
                    >
                      Découvrir notre solution
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
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
