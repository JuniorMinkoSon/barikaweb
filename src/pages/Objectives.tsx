import React, { useEffect, useState, useRef } from 'react'

// Importer les images via URL pour Vite
const imgTravaux = new URL('../../assets/images/bat-moderne-1.jpg', import.meta.url).href
const imgImmobilier = new URL('../../assets/images/Immobilier-foncier-sécurisé-2.jpg', import.meta.url).href
const imgFinitions = new URL('../../assets/images/chantier.jpg', import.meta.url).href

const keyObjectives = [
  {
    title: 'Travaux publics & génie civil',
    description: 'Construction, routes, aménagements et verdissement pour des infrastructures durables.',
    image: imgTravaux,
    number: 120 // Exemple de chiffre à animer
  },
  {
    title: 'Immobilier & foncier sécurisé',
    description: 'Location, vente de parcelles, lotissements et aménagements de terrains.',
    image: imgImmobilier,
    number: 80
  },
  {
    title: 'Finitions & aménagements',
    description: 'Vitrerie, menuiserie, carrelage, peinture et décoration pour un rendu moderne et soigné.',
    image: imgFinitions,
    number: 60
  }
]

type AnimatedNumberProps = {
  value: number
  suffix?: string
  duration?: number // en ms
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, suffix = '', duration = 1200 }) => {
  const [display, setDisplay] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let start = 0
    const increment = value / (duration / 20)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [visible, value, duration])

  return <span ref={ref}>{display}{suffix}</span>
}

const Objectives = () => (
  <main className="bg-white text-black font-sans">
    {/* Bannière / message fort */}
    <section className="relative h-[360px] sm:h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden mb-16 rounded-b-3xl shadow-xl">
      <img
        src={imgFinitions}
        alt="Chantier Barikaweb"
        className="absolute inset-0 w-full h-full object-cover brightness-90 transition-transform duration-[12s] ease-linear hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,140,0,0.7)] via-black/20 to-black/30"></div>
      <div className="relative text-center px-4">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg animate-slide-in-left">
          Construisons ensemble votre patrimoine en toute confiance
        </h1>
      </div>
    </section>

    {/* Header page */}
    <header className="text-center mb-12 px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[rgb(255,140,0)]">
        BARIKA ENTREPRISE
      </h2>
      <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[rgb(255,140,0)]" />
      <p className="mt-4 text-gray-700 text-base sm:text-lg max-w-2xl mx-auto">
        Barikaweb s’engage à offrir un accompagnement fiable et sécurisé pour vos projets immobiliers et travaux publics.
      </p>
    </header>

    {/* 3 points clés en cards */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {keyObjectives.map((item, index) => (
        <article
          key={item.title}
          className="bg-white rounded-3xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl duration-500 group"
        >
          <div className="h-56 w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-[rgb(255,140,0)]">{item.title}</h3>
            <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>
            <p className="mt-4 text-2xl font-extrabold text-[rgb(255,140,0)]">
              <AnimatedNumber value={item.number} suffix="+" />
            </p>
          </div>
        </article>
      ))}
    </section>

    {/* Objectifs détaillés et statistiques */}
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {/* Objectifs */}
      <article className="bg-white rounded-3xl shadow-lg p-8 ring-1 ring-gray-200 hover:shadow-2xl transition transform hover:-translate-y-1">
        <h3 className="text-2xl font-bold mb-2 text-[rgb(255,140,0)]">Nos Objectifs</h3>
        <ul className="space-y-2 text-gray-700 list-disc list-inside text-base">
          <li>Sécuriser les acquisitions foncières avec l’ACD</li>
          <li>Offrir un accompagnement personnalisé</li>
          <li>Faciliter l’accès à l’immobilier pour la diaspora et les jeunes actifs</li>
          <li>Construire un patrimoine durable et sûr</li>
        </ul>
      </article>

      {/* Témoignages & Statistiques */}
      <article className="bg-white rounded-3xl shadow-lg p-8 ring-1 ring-gray-200 hover:shadow-2xl transition transform hover:-translate-y-1">
        <h3 className="text-2xl font-bold mb-6 text-[rgb(255,140,0)]">Témoignages & Statistiques</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-orange-50 p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition">
            <p className="text-3xl font-extrabold text-[rgb(255,140,0)]">
              <AnimatedNumber value={50} suffix="+" />
            </p>
            <p className="mt-2 text-gray-700 text-sm">Projets réalisés</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition">
            <p className="text-3xl font-extrabold text-[rgb(255,140,0)]">
              <AnimatedNumber value={100} suffix="+" />
            </p>
            <p className="mt-2 text-gray-700 text-sm">Parcelles sécurisées</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition">
            <p className="text-3xl font-extrabold text-[rgb(255,140,0)]">
              <AnimatedNumber value={95} suffix="%" />
            </p>
            <p className="mt-2 text-gray-700 text-sm">Satisfaction clients</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition">
            <p className="text-3xl font-extrabold text-[rgb(255,140,0)]">
              <AnimatedNumber value={10} suffix="+" />
            </p>
            <p className="mt-2 text-gray-700 text-sm">Années d’expérience</p>
          </div>
        </div>
      </article>
    </section>
  </main>
)

export default Objectives
