// ─── TYPES PARTAGÉS ───────────────────────────────────────────────────────────

export interface ColorOption {
  label: string;
  hex: string;
}

export interface CoachingSession {
  date: string;
  time: string;
  mode: string;
  duration: string;
  spotsLeft?: number;
}

interface BaseProduct {
  id: number;
  name: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  location: string;
  tags: string[];
  images: string[];
  description?: string;
}

export interface VetementProduct extends BaseProduct {
  category: 'Vêtements';
  sizes: string[];
  unavailableSizes?: string[];
  colors: ColorOption[];
}

export interface ChaussureProduct extends BaseProduct {
  category: 'Chaussures';
  pointures: number[];
  unavailablePointures?: number[];
  colors: ColorOption[];
}

export interface VoitureProduct extends BaseProduct {
  category: 'Voiture';
  durees: string[];
  options: string[];
}

export interface ResidenceProduct extends BaseProduct {
  category: 'Résidence';
  sejours: string[];
  services: string[];
}

export interface CoachingProduct extends BaseProduct {
  category: 'Coaching';
  formats: string[];
  sessions: CoachingSession[];
}

export interface MaterielProduct extends BaseProduct {
  category: 'Matériel';
  durees: string[];
  options: string[];
}

export interface ExperienceProduct extends BaseProduct {
  category: 'Expérience';
  durees: string[];
  inclus: string[];
}

export type Product =
  | VetementProduct
  | ChaussureProduct
  | VoitureProduct
  | ResidenceProduct
  | CoachingProduct
  | MaterielProduct
  | ExperienceProduct;

// ─── ENRICHISSEMENT mock → Product typé ──────────────────────────────────────

export interface MockProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  location: string;
  tags: string[];
  image: string;
}

export function toDetailProduct(p: MockProduct): Product {
  const images = [
    p.image.replace('w=600', 'w=800'),
    p.image.replace('w=600', 'w=800'),
    p.image.replace('w=600', 'w=800'),
  ];

  const base = {
    id: p.id,
    name: p.name,
    price: p.price,
    unit: p.unit,
    rating: p.rating,
    reviews: p.reviews,
    location: p.location,
    tags: p.tags,
    images,
  };

  switch (p.category) {
    case 'Voiture':
      return {
        ...base,
        category: 'Voiture',
        description: 'Véhicule disponible à la location avec ou sans chauffeur. Kilométrage illimité inclus.',
        durees: ['1 jour', '3 jours', '1 semaine', '1 mois'],
        options: ['Chauffeur', 'Transfert aéroport', 'Siège bébé', 'Assurance tous risques'],
      };

    case 'Résidence':
      return {
        ...base,
        category: 'Résidence',
        description: 'Logement meublé et équipé, disponible à la nuitée ou à la semaine.',
        sejours: ['1 nuit', '2 nuits', '3 nuits', '1 semaine'],
        services: ['Ménage quotidien', 'Petit-déjeuner', 'Chef cuisinier', 'Transfert', 'Gardien 24h'],
      };

    case 'Vendeur':
      return {
        ...base,
        category: 'Vêtements',
        description: 'Articles de mode disponibles sur commande. Wax, prêt-à-porter et sur-mesure.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        unavailableSizes: [],
        colors: [
          { label: 'Terracotta', hex: '#D4622A' },
          { label: 'Indigo', hex: '#2B5E9E' },
          { label: 'Noir', hex: '#1a1a1a' },
          { label: 'Naturel', hex: '#C8A882' },
        ],
      };

    case 'Matériel':
      return {
        ...base,
        category: 'Matériel',
        description: 'Matériel professionnel disponible à la location avec livraison possible sur Abidjan.',
        durees: ['1 jour', '2 jours', '1 semaine'],
        options: ['Livraison incluse', 'Installation sur place', 'Technicien inclus'],
      };

    case 'Expérience':
      return {
        ...base,
        category: 'Expérience',
        description: 'Expérience unique encadrée par des professionnels locaux. Solo, duo ou groupe.',
        durees: ['Demi-journée', 'Journée complète', 'Week-end'],
        inclus: ['Guide professionnel', 'Transport', 'Repas inclus', 'Matériel fourni'],
      };

    case 'Coaching':
      return {
        ...base,
        category: 'Coaching',
        description: 'Séances de coaching personnalisées avec un professionnel certifié.',
        formats: ['Individuel', 'Groupe (4–8 pers.)', 'Entreprise'],
        sessions: [
          { date: 'Lundi 7 avril', time: '10h00', mode: 'En ligne', duration: '1h' },
          { date: 'Mercredi 9 avril', time: '14h30', mode: 'Présentiel', duration: '1h30' },
          { date: 'Vendredi 11 avril', time: '09h00', mode: 'En ligne', duration: '1h', spotsLeft: 1 },
        ],
      };

    default:
      return {
        ...base,
        category: 'Matériel',
        description: 'Article disponible à la location ou à la vente.',
        durees: ['1 jour', '1 semaine'],
        options: [],
      };
  }
}