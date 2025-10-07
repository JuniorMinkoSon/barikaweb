import Banner from '../components/Banner'
import ServiceCard from '../components/ServiceCard'
import imgTP from '../../assets/images/Travaux-publics-génie-civil-2.jpg'
import imgImm from '../../assets/images/Immobilier-foncier-sécurisé-1.jpg'
import imgBat1 from '../../assets/images/bat-moderne-1.jpg'
import imgBat2 from '../../assets/images/bat-moderne-2.jpg'

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

const Home = () => (
  <main>
    <Banner
      slogan="Construisons ensemble votre patrimoine en toute confiance"
      image={imgBat2}
    />
    <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="flex items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--accent))]">Nos services</h2>
          <p className="mt-1 text-sm text-gray-700">Des solutions complètes pour vos projets.</p>
        </div>
      </header>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div 
            key={service.title}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 250}ms` }}
          >
            <ServiceCard
              title={service.title}
              description={service.description}
              image={service.image}
            />
          </div>
        ))}
      </div>
    </section>
  </main>
)

export default Home