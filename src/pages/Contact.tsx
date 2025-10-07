const Contact = () => (
  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <header className="text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[rgb(var(--accent))]">Contact</h1>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[rgb(var(--brand))]" />
      <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">Nous répondons sous 24h. Dites‑nous en plus sur votre projet.</p>
    </header>

    <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Coordonnées */}
      <aside className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[rgb(var(--accent))]">Coordonnées</h2>
        <ul className="mt-3 space-y-1 text-sm text-gray-700">
          <li>• Adresse : Cocody Angré</li>
          <li>• Téléphone : 00 00 00 00</li>
          <li>• WhatsApp : 00 00 00 00</li>
          <li>• Email : contact@tif.ci</li>
        </ul>
        <div className="mt-4 rounded-lg bg-[rgb(var(--accent))/0.05] h-40 flex items-center justify-center text-xs text-gray-500">
          Google Maps (à intégrer)
        </div>
      </aside>

      {/* Formulaire */}
      <form className="lg:col-span-2 rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]" type="text" placeholder="Votre nom" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]" type="email" placeholder="vous@example.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sujet</label>
          <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]" type="text" placeholder="Votre projet" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 h-32 resize-y focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]" placeholder="Décrivez votre besoin"></textarea>
        </div>
        <div className="pt-2">
          <button type="submit" className="inline-flex items-center rounded-md bg-[rgb(var(--brand-strong))] text-white px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-[rgb(var(--brand))] hover:scale-105 transition-all duration-700">Envoyer</button>
        </div>
      </form>
    </section>
  </main>
)

export default Contact