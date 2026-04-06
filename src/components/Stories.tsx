// Stories.tsx
import { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { theme } from '../theme';

// Type pour la sécurité TypeScript
interface Story {
  id: number;
  name: string;
  category: string;
  hasNew: boolean;
  image: string;
}

const mockStories: Story[] = [
  { id: 1, name: 'Marie L.', category: 'Coiffure', hasNew: true, image: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 2, name: 'Thomas B.', category: 'Plomberie', hasNew: true, image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 3, name: 'Sophie M.', category: 'Ménage', hasNew: false, image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 4, name: 'Lucas P.', category: 'Électricité', hasNew: true, image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 5, name: 'Emma D.', category: 'Jardinage', hasNew: false, image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 6, name: 'Alex R.', category: 'Peinture', hasNew: true, image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export default function Stories() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Gestion de la lecture automatique et du passage à la story suivante
  useEffect(() => {
    let interval: number;
    if (activeIndex !== null) {
      setProgress(0);
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Logique de switch automatique
            if (activeIndex < mockStories.length - 1) {
              setActiveIndex(activeIndex + 1);
            } else {
              setActiveIndex(null);
            }
            return 0;
          }
          return prev + 1.2; // Vitesse de la barre (environ 4-5 secondes)
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeIndex]);

  const currentStory = activeIndex !== null ? mockStories[activeIndex] : null;

  return (
    <div className="bg-white pt-6 pb-2 font-['DM_Sans']">
      {/* En-tête : Taille ajustée selon ton theme.fontSize */}
      <div className="text-center px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Vos pros du moment,{' '}
          <span style={{ color: theme.colors.primary }}>
            toujours à portée
          </span>
        </h2>
      </div>

      {/* Liste des bulles de Stories */}
      <div className="overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex gap-5 px-5 pb-4 min-w-full justify-start sm:justify-center">
          {mockStories.map((story, index) => (
            <button 
              key={story.id} 
              onClick={() => setActiveIndex(index)}
              className="flex flex-col items-center gap-2 flex-shrink-0 active:scale-95 transition-transform outline-none"
            >
              <div className="relative">
                <div 
                  className={`p-[2.5px] rounded-full transition-all duration-500 ${story.hasNew ? 'bg-gradient-to-tr' : 'bg-gray-200'}`}
                  style={{ 
                    backgroundImage: story.hasNew 
                      ? `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` 
                      : '' 
                  }}
                >
                  <div className="bg-white p-[2px] rounded-full">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    />
                  </div>
                </div>
                {story.hasNew && (
                  <span 
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
              </div>
              <div className="text-center">
                <p className="text-[12px] font-bold text-slate-900 leading-none">{story.name}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">{story.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Vue Plein Écran (Modal Story) */}
      {activeIndex !== null && currentStory && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center touch-none">
          
          {/* Barres de progression multiples (style WhatsApp) */}
          <div className="absolute top-4 left-0 right-0 px-4 flex gap-1.5 z-[1010]">
            {mockStories.map((_, i) => (
              <div key={i} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-none"
                  style={{ 
                    width: i < activeIndex ? '100%' : (i === activeIndex ? `${progress}%` : '0%') 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header du Modal */}
          <div className="absolute top-8 left-0 right-0 px-5 flex items-center justify-between z-[1010]">
            <div className="flex items-center gap-3">
              <img src={currentStory.image} className="w-10 h-10 rounded-full border border-white/30 object-cover" alt="" />
              <div className="text-white">
                <p className="font-bold text-sm leading-none">{currentStory.name}</p>
                <p className="text-[10px] text-white/60 mt-1">{currentStory.category}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveIndex(null)} 
              className="text-white p-2 bg-white/10 rounded-full backdrop-blur-md active:scale-90 transition-transform"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenu de la Story (Image) */}
          <div className="relative w-full h-full max-w-lg flex items-center bg-zinc-900">
             <img 
              src={currentStory.image} 
              className="w-full h-auto max-h-[85vh] object-contain sm:rounded-3xl" 
              alt="story content" 
            />
          </div>

          {/* Bouton de Commande Flottant */}
          <div className="absolute bottom-12 left-0 right-0 px-10 flex justify-center z-[1010]">
            <button 
              className="flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white shadow-2xl transition-all active:scale-90 hover:brightness-110"
              style={{ backgroundColor: theme.colors.primary }}
              onClick={(e) => {
                e.stopPropagation();
                alert(`Commande pour ${currentStory.name} enregistrée !`);
              }}
            >
              <ShoppingBag size={20} />
              <span>Commander {currentStory.category}</span>
            </button>
          </div>

          {/* Zones de navigation tactiles (Gauche / Droite) */}
          <div className="absolute inset-0 flex z-[1005]">
            <div 
              className="w-[30%] h-full cursor-pointer" 
              onClick={() => {
                if (activeIndex > 0) setActiveIndex(activeIndex - 1);
              }} 
            />
            <div 
              className="w-[70%] h-full cursor-pointer" 
              onClick={() => {
                if (activeIndex < mockStories.length - 1) {
                  setActiveIndex(activeIndex + 1);
                } else {
                  setActiveIndex(null);
                }
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}