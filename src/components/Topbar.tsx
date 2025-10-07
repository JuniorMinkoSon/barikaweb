const Topbar = () => (
  <div className="h-16 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur border-b border-black/10">
    <div className="flex items-center gap-3">
      <button className="md:hidden inline-flex items-center justify-center rounded-md border border-black/10 px-2.5 py-1.5 text-sm">Menu</button>
      <input placeholder="Rechercher…" className="hidden sm:block rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]" />
    </div>
    <div className="flex items-center gap-3">
      <button className="rounded-full w-9 h-9 bg-[rgb(var(--accent))] text-white text-sm">N</button>
    </div>
  </div>
)

export default Topbar


