import React from 'react'

interface ServiceCardProps {
  title: string
  description: string
  image: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, image }) => (
  <article className="group bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden transition-all duration-1000 hover:shadow-2xl hover:-translate-y-3 hover:ring-[rgb(var(--brand))] hover:ring-2 animate-fade-in-up">
    <div className="aspect-[16/9] overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-1200 group-hover:scale-115" 
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[rgb(var(--brand-strong))] transition-colors duration-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-700">{description}</p>
      <div className="mt-3">
        <a 
          href="#contact" 
          className="text-[rgb(var(--brand-strong))] hover:text-[rgb(var(--brand))] text-sm font-medium transition-all duration-700 hover:translate-x-2 hover:scale-105 inline-block"
        >
          En savoir plus →
        </a>
      </div>
    </div>
  </article>
)

export default ServiceCard