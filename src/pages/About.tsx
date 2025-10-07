const About = () => (
  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0">
    {/* Héros visuel */}
    <section className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden flex items-center justify-center">
      <img
        src={new URL('../../assets/images/chantier.jpg', import.meta.url).href}
        alt="Chantier"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[12s] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--accent)/0.7)] via-black/40 to-black/70" />
      <div className="relative text-center px-4">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight animate-slide-in-left">
          À propos de TIF
        </h1>
        <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-white/90 text-sm sm:text-base animate-slide-in-right">
          Travaux publics, immobilier sécurisé et aménagements: des solutions fiables et durables.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 animate-fade-in-up">
          <a href="#mission" className="inline-flex items-center rounded-md bg-white text-[rgb(var(--accent))] px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-gray-100 hover:scale-110 transition-all duration-700 transform hover:-translate-y-1">Notre mission</a>
          <a href="#contact" className="inline-flex items-center rounded-md bg-[rgb(var(--brand-strong))] text-white px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-[rgb(var(--brand))] hover:scale-110 transition-all duration-700 transform hover:-translate-y-1">Nous contacter</a>
        </div>
      </div>
      <div className="absolute -bottom-8 left-0 right-0 h-16 bg-white/0 backdrop-blur-sm" />
    </section>

    {/* Stats */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white ring-1 ring-black/5 p-5 shadow-sm hover:shadow-md transition-all text-center">
          <p className="text-3xl font-bold text-[rgb(var(--brand-strong))]">10+ </p>
          <p className="text-sm text-gray-600">Années d’expérience cumulée</p>
        </div>
        <div className="rounded-xl bg-white ring-1 ring-black/5 p-5 shadow-sm hover:shadow-md transition-all text-center">
          <p className="text-3xl font-bold text-[rgb(var(--brand-strong))]">50+ </p>
          <p className="text-sm text-gray-600">Projets livrés</p>
        </div>
        <div className="rounded-xl bg-white ring-1 ring-black/5 p-5 shadow-sm hover:shadow-md transition-all text-center">
          <p className="text-3xl font-bold text-[rgb(var(--brand-strong))]">100% </p>
          <p className="text-sm text-gray-600">Conformité & ACD sécurisés</p>
        </div>
      </div>
    </section>

    {/* Mission / Vision / Valeurs */}
    <section id="mission" className="mt-4 sm:mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-md transition animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--brand))/0.1] text-[rgb(var(--brand-strong))] ring-1 ring-[rgb(var(--brand))/0.2]">
              {/* Icône cible */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2a1 1 0 011 1v1.055A8.001 8.001 0 0120.945 11H22a1 1 0 110 2h-1.055A8.001 8.001 0 0113 20.945V22a1 1 0 11-2 0v-1.055A8.001 8.001 0 013.055 13H2a1 1 0 110-2h1.055A8.001 8.001 0 0111 3.055V2a1 1 0 011-1zm0 4a6 6 0 100 12A6 6 0 0012 6zm0 2a4 4 0 110 8 4 4 0 010-8z"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Notre mission</h3>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Concevoir et livrer des infrastructures durables et des solutions immobilières sécurisées,
            au service du développement et du bien‑être des communautés.
          </p>
        </article>
        <article className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-md transition animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--accent))/0.08] text-[rgb(var(--accent))] ring-1 ring-[rgb(var(--accent))/0.15]">
              {/* Icône œil */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Notre vision</h3>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Devenir un partenaire de référence en Afrique de l’Ouest pour la qualité,
            l’innovation et la confiance dans la réalisation de projets.
          </p>
        </article>
        <article className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-md transition animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--brand))/0.1] text-[rgb(var(--brand-strong))] ring-1 ring-[rgb(var(--brand))/0.2]">
              {/* Icône étoile */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.73L5.82 21z"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Nos valeurs</h3>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li>• Transparence & éthique</li>
            <li>• Exigence & sécurité (ACD, conformité)</li>
            <li>• Proximité avec la diaspora et les jeunes actifs</li>
          </ul>
        </article>
      </div>
    </section>

    {/* Timeline */}
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Étapes clés</h2>
      <ol className="mt-6 relative border-s border-gray-200">
        <li className="ms-4 mb-10">
          <div className="absolute w-3 h-3 bg-emerald-600 ring-4 ring-emerald-100 rounded-full -start-1.5 mt-2.5" />
          <time className="text-xs text-gray-500">2018</time>
          <h3 className="text-base font-semibold text-gray-900">Création & premiers chantiers</h3>
          <p className="text-sm text-gray-600">Démarrage des activités en génie civil et aménagements.</p>
        </li>
        <li className="ms-4 mb-10">
          <div className="absolute w-3 h-3 bg-emerald-600 ring-4 ring-emerald-100 rounded-full -start-1.5 mt-2.5" />
          <time className="text-xs text-gray-500">2021</time>
          <h3 className="text-base font-semibold text-gray-900">Pôle immobilier & ACD</h3>
          <p className="text-sm text-gray-600">Formalisation du foncier sécurisé (ACD) et lotissements.</p>
        </li>
        <li className="ms-4">
          <div className="absolute w-3 h-3 bg-emerald-600 ring-4 ring-emerald-100 rounded-full -start-1.5 mt-2.5" />
          <time className="text-xs text-gray-500">Aujourd’hui</time>
          <h3 className="text-base font-semibold text-gray-900">Croissance & innovation</h3>
          <p className="text-sm text-gray-600">Renforcement de l’exécution, qualité et accompagnement sur mesure.</p>
        </li>
      </ol>
    </section>

    {/* CTA */}
    <section className="mt-16 mb-12">
      <div className="rounded-2xl bg-gradient-to-r from-[rgb(var(--brand-strong))] to-[rgb(var(--brand))] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Prêt à démarrer votre projet ?</h3>
          <p className="text-white/90 text-sm sm:text-base">Parlons de vos objectifs et des prochaines étapes.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="#contact" className="inline-flex items-center rounded-md bg-white text-[rgb(var(--brand-strong))] px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-gray-50 hover:scale-110 transition-all duration-700 transform hover:-translate-y-1">Nous contacter</a>
          <a href="#services" className="inline-flex items-center rounded-md bg-[rgb(var(--accent))] text-white px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-[rgb(var(--accent))]/90 hover:scale-110 transition-all duration-700 transform hover:-translate-y-1">Voir nos services</a>
        </div>
      </div>
    </section>
  </main>
)

export default About