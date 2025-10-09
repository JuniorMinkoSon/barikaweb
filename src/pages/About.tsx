import React, { useState, useEffect, useRef } from 'react'

// Images importées
const imgTravaux = new URL('../../assets/images/bat-moderne-1.jpg', import.meta.url).href
const imgImmobilier = new URL('../../assets/images/Immobilier-foncier-sécurisé-2.jpg', import.meta.url).href
const imgFinitions = new URL('../../assets/images/chantier.jpg', import.meta.url).href

const objectives = [
  {
    title: 'Travaux publics & génie civil',
    description: 'Construction, routes, aménagements et verdissement pour des infrastructures durables.',
    image: imgTravaux
  },
  {
    title: 'Immobilier & foncier sécurisé',
    description: 'Location, vente de parcelles, lotissements et aménagements de terrains.',
    image: imgImmobilier
  },
  {
    title: 'Finitions & aménagements',
    description: 'Vitrerie, menuiserie, carrelage, peinture et décoration pour un rendu moderne et soigné.',
    image: imgFinitions
  }
]

const carouselImages = [imgTravaux, imgImmobilier, imgFinitions]

const AnimatedNumber = ({ value, suffix = '', duration = 1200 }) => {
  const [display, setDisplay] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

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

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Changement automatique toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 font-sans">
      {/* Héros visuel */}
      <section className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden flex items-center justify-center mb-16 rounded-b-3xl shadow-xl">
        <img
          src={carouselImages[currentIndex]}
          alt="Chantier Barika"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--accent)/0.7)] via-black/40 to-black/70"></div>
        <div className="relative text-center px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight animate-slide-in-left">
            À propos de BARIKA
          </h1>
          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-white/90 text-sm sm:text-base animate-slide-in-right">
            Travaux publics, immobilier sécurisé et aménagements : des solutions fiables et durables.
          </p>
        </div>
      </section>

      {/* Carousel indicateurs */}
      <div className="flex justify-center items-center gap-2 mb-16">
        {carouselImages.map((_, idx) => (
          <span
            key={idx}
            className={`block w-4 h-4 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-orange-500 scale-125' : 'bg-gray-300'
              }`}
          ></span>
        ))}
      </div>
      {/* Nos objectifs principaux */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[rgb(var(--brand-strong))] text-center mb-8">
          Nos objectifs principaux
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {objectives.map((obj) => (
            <div
              key={obj.title}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 duration-500"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={obj.image}
                  alt={obj.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[rgb(var(--brand-strong))]">{obj.title}</h3>
                <p className="text-gray-700 text-sm">{obj.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white ring-1 ring-black/5 p-5 shadow-sm hover:shadow-md transition-all text-center">
            <p className="text-3xl font-bold text-[rgb(var(--brand-strong))]">
              <AnimatedNumber value={10} suffix="+" />
            </p>
            <p className="text-sm text-gray-600">Années d’expérience cumulée</p>
          </div>
          <div className="rounded-xl bg-white ring-1 ring-black/5 p-5 shadow-sm hover:shadow-md transition-all text-center">
            <p className="text-3xl font-bold text-[rgb(var(--brand-strong))]">
              <AnimatedNumber value={50} suffix="+" />
            </p>
            <p className="text-sm text-gray-600">Projets livrés</p>
          </div>
          <div className="rounded-xl bg-white ring-1 ring-black/5 p-5 shadow-sm hover:shadow-md transition-all text-center">
            <p className="text-3xl font-bold text-[rgb(var(--brand-strong))]">
              <AnimatedNumber value={100} suffix="%" />
            </p>
            <p className="text-sm text-gray-600">Conformité & ACD sécurisés</p>
          </div>
        </div>
      </section>
    </main>
  )
}
export default About
