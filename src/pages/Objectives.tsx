
const Objectives = () => (
  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <header className="text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[rgb(var(--accent))]">Nos objectifs & missions</h1>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[rgb(var(--brand))]" />
      <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">Des engagements clairs pour un accompagnement fiable et sécurisé.</p>
    </header>

    <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <article className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-md transition hover-lift">
        <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Objectifs</h3>
        <ul className="mt-3 space-y-1 text-sm text-gray-700">
          <li>• Sécuriser les acquisitions foncières (ACD)</li>
          <li>• Offrir un accompagnement personnalisé</li>
          <li>• Faciliter l’accès à l’immobilier pour la diaspora et les jeunes actifs</li>
          <li>• Construire un patrimoine durable et sûr</li>
        </ul>
      </article>
      <article className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-md transition hover-lift">
        <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Témoignages & Statistiques</h3>
        <ul className="mt-3 space-y-1 text-sm text-gray-700">
          <li>• 50+ projets réalisés</li>
          <li>• 100+ parcelles sécurisées</li>
          <li>• 95% de satisfaction clients</li>
        </ul>
      </article>
    </section>
  </main>
)

export default Objectives