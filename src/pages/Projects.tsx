
const Projects = () => (
  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <header className="text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[rgb(var(--accent))]">Projets / Réalisations</h1>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[rgb(var(--brand))]" />
      <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">Avant / Après, lotissements et chantiers emblématiques.</p>
    </header>

    <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3,4,5,6].map(i => (
        <article key={i} className="group rounded-xl bg-white ring-1 ring-black/5 overflow-hidden shadow-sm hover:shadow-md transition hover-lift">
          <div className="aspect-[16/9] bg-[rgb(var(--accent))/0.05]" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Projet #{i}</h3>
            <p className="mt-1 text-sm text-gray-700">Description courte du projet et résultats obtenus.</p>
          </div>
        </article>
      ))}
    </section>

    <section className="mt-12">
      <h2 className="text-xl font-bold text-[rgb(var(--accent))]">Étude de cas</h2>
      <div className="mt-4 rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
        <p className="text-sm text-gray-700">
          Une famille de la diaspora a sécurisé un terrain grâce à notre accompagnement (ACD),
          puis a lancé la construction d’une maison durable dans les délais.
        </p>
      </div>
    </section>
  </main>
)

export default Projects