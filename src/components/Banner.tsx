import React from 'react'

interface BannerProps {
  slogan: string
  image: string
}

const Banner: React.FC<BannerProps> = ({ slogan, image }) => (

  <section className="relative w-full h-[380px] sm:h-[440px] overflow-hidden flex items-center justify-center group">
    <img
      src={image}
      alt="Bannière"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[12s] ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--accent)/0.7)] via-black/30 to-black/70" />
    <div className="relative z-10 mx-auto px-4 text-center animate-fade-in-up">
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md animate-slide-in-left">
        {slogan}
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-white/90 text-sm sm:text-base animate-slide-in-right delay-300">
        Expertise, qualité et respect des délais pour vos projets.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3 animate-fade-in-up delay-500">
        {/* Bouton principal */}
        <a
          href="#services"
          className="inline-flex items-center rounded-md bg-white text-[rgb(var(--accent))] px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-gray-100 hover:scale-110 transition-all duration-700 transform hover:-translate-y-1"
        >
          Découvrir nos services
        </a>

        {/* Bouton rouge/orange avec texte blanc */}
        <a
          href="#contact"
          className="inline-flex items-center text-white rounded-md bg-white px-4 py-2 text-sm font-medium shadow hover:bg-orange-600 hover:text-gray-100 hover:scale-110 transition-all duration-700 transform hover:-translate-y-1 border border-orange-600"
        >
          Nous contacter
        </a>
      </div>
    </div>
  </section>


)

export default Banner