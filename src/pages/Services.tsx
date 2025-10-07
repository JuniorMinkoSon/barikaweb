import ServiceCard from '../components/ServiceCard'
import imgTP from '../../assets/images/Travaux-publics-génie-civil-2.jpg'
import imgImm from '../../assets/images/Immobilier-foncier-sécurisé-1.jpg'
import imgFin from '../../assets/images/bat-moderne-3.jpg'

const services = [
  {
    title: 'Travaux publics et génie civil',
    description: 'Construction, routes, aménagements, verdissement.',
    image: imgTP
  },
  {
    title: 'Services immobiliers et fonciers',
    description: 'Location, vente de parcelles, lotissements, aménagements de terrains.',
    image: imgImm
  },
  {
    title: 'Finitions et aménagements intérieurs',
    description: 'Vitrerie, menuiserie, carrelage, peinture, décoration.',
    image: imgFin
  }
]

const Services = () => (
  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <header className="text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[rgb(var(--accent))]">Nos services</h1>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[rgb(var(--brand))]" />
      <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
        Des solutions complètes et sécurisées pour vos projets.
      </p>
    </header>
    <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCard
          key={service.title}
          title={service.title}
          description={service.description}
          image={service.image}
        />
      ))}
    </section>
  </main>
)

export default Services