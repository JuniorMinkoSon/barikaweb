import React, { useState, useEffect } from 'react'
import Banner from '../components/Banner'
import ServiceCard from '../components/ServiceCard'
import imgTP from '../../assets/images/Travaux-publics-génie-civil-2.jpg'
import imgImm from '../../assets/images/Immobilier-foncier-sécurisé-1.jpg'
import imgBat1 from '../../assets/images/bat-moderne-1.jpg'
import imgBat2 from '../../assets/images/bat-moderne-2.jpg'
import About from './About'
import Objectives from './Objectives'

const services = [
  {
    title: 'Travaux publics & génie civil',
    description: 'Construction, routes, aménagements, verdissement.',
    image: imgTP
  },
  {
    title: 'Immobilier & foncier sécurisé',
    description: 'Location, vente de parcelles, lotissements, aménagements de terrains.',
    image: imgImm
  },
  {
    title: 'Finitions & aménagements',
    description: 'Vitrerie, menuiserie, carrelage, peinture, décoration.',
    image: imgBat1
  }
]

// Carousel images pour la première bannière
const carouselImages = [imgBat2, imgTP, imgImm]

const customerComments = [
  { name: 'Alice D.', comment: 'Travail de qualité, délai respecté, équipe très professionnelle.' },
  { name: 'Marc L.', comment: 'Accompagnement personnalisé et rassurant tout au long du projet.' },
  { name: 'Sophie K.', comment: 'Barika a sécurisé mon acquisition foncière avec efficacité.' },
]

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Carousel automatique toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main>
      <Objectives />

      {/* Carousel principal */}
      <section className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden flex items-center justify-center mb-12 rounded-2xl shadow-lg">
        <img
          src={carouselImages[currentIndex]}
          alt="BARIKA"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--accent)/0.6)] via-black/30 to-black/50"></div>
        <div className="relative text-center px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Construisons ensemble votre patrimoine en toute confiance
          </h1>
        </div>
        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {carouselImages.map((_, idx) => (
            <span
              key={idx}
              className={`block w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-orange-500 scale-125' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex items-end justify-between gap-4 animate-fade-in-up mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--accent))]">Nos services</h2>
            <p className="mt-1 text-sm text-gray-700">Des solutions complètes pour vos projets.</p>
          </div>
        </header>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="animate-fade-in-up bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 duration-500"
              style={{ animationDelay: `${index * 250}ms` }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                image={service.image}
              />
              <div className="p-4 text-center">
                <button className="bg-orange-500 text-white px-4 py-2 rounded-md shadow hover:bg-orange-600 hover:scale-105 transition transform duration-300">
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commentaires clients */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--accent))] text-center mb-8">Ce que disent nos clients</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerComments.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 hover:shadow-md transition duration-300"
            >
              <p className="text-gray-700 text-sm mb-4">"{c.comment}"</p>
              <p className="text-gray-900 font-semibold text-sm text-right">- {c.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="mt-16 mb-0">
        <div className="rounded-1xl bg-gradient-to-r from-[rgb(var(--brand-strong))] to-[rgb(var(--brand))] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Prêt à démarrer votre projet ?</h3>
            <p className="text-white/90 text-sm sm:text-base">Parlons de vos objectifs et des prochaines étapes.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center rounded-md bg-white text-[rgb(var(--brand-strong))] px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-gray-50 hover:scale-110 transition-all duration-700 transform hover:-translate-y-1"
            >
              Nous contacter
            </a>
            <a
              href="#services"
              className="inline-flex items-center rounded-md bg-[rgb(var(--accent))] text-white px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-[rgb(var(--accent))]/90 hover:scale-110 transition-all duration-700 transform hover:-translate-y-1"
            >
              Voir nos services
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
