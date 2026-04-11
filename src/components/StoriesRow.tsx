import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, ZoomIn, ZoomOut, Expand, ArrowRight } from 'lucide-react';
import { haptic } from '../utils/haptics';

const mockStories = [
  { id: 1, name: 'Hôtel Ivoire', isLive: true, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', path: '/residences' },
  { id: 2, name: 'Gaz Express', isLive: true, image: 'https://images.unsplash.com/photo-1548142723-aae7678afd53?w=800&q=80', path: '/shop' },
  { id: 3, name: 'Chauffeur VIP', isLive: true, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80', path: '/cars' },
  { id: 4, name: 'Ménage Pro', isLive: true, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?w=800&q=80', path: '/repairs' },
  { id: 5, name: 'Wax Boutique', isLive: true, image: 'https://images.unsplash.com/photo-1605336040842-870029b352f2?w=800&q=80', path: '/shop' },
];

export default function StoriesRow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const openStory = (story: any) => {
    haptic.medium();
    setActiveStory(story);
    setIsZoomed(false);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.light();
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="py-5 bg-white border-b border-gray-100 shadow-sm overflow-hidden relative">
      <div className="flex gap-5 overflow-x-auto px-6 snap-x pb-2 no-scrollbar">
        
        {/* Adds Your Story */}
        <div className="flex flex-col items-center gap-2 min-w-[76px] cursor-pointer snap-start group">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 p-0.5 relative transition-all group-hover:border-orange-600">
            <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-2xl font-light">
              +
            </div>
            <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white rounded-full p-1 border-2 border-white shadow-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
          </div>
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Ma Story</span>
        </div>

        {/* Stories from suppliers */}
        {mockStories.map(story => (
          <div key={story.id} onClick={() => openStory(story)} className="flex flex-col items-center gap-2 min-w-[76px] cursor-pointer snap-start group">
            <div className={`w-16 h-16 rounded-full p-[2.5px] transition-all group-hover:scale-105 ${story.isLive ? 'bg-gradient-to-tr from-orange-500 via-red-500 to-pink-500 shadow-orange-100 shadow-lg' : 'bg-gray-200'}`}>
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                <img src={story.image} alt={story.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            <span className="text-[11px] text-gray-800 font-bold line-clamp-1 truncate w-16 text-center tracking-tighter">
              {story.name}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal - Premium Zoom Experience */}
      {activeStory && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-500"
          onClick={() => setActiveStory(null)}
        >
          {/* Header Actions */}
          <div className="absolute top-8 left-0 right-0 z-[110] px-8 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-orange-600 p-0.5">
                   <img src={activeStory.image} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                   <h3 className="text-white font-black italic uppercase tracking-tighter text-sm">{activeStory.name}</h3>
                   <p className="text-[8px] text-orange-600 font-bold uppercase tracking-[0.3em]">Live Now</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={toggleZoom}
                  className="w-12 h-12 bg-white/10 hover:bg-orange-600 text-white rounded-2xl flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
                >
                   {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
                </button>
                <button 
                  onClick={() => setActiveStory(null)}
                  className="w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
                >
                   <X size={24} />
                </button>
             </div>
          </div>
          
          <div className="relative w-full h-full max-w-xl mx-auto flex items-center justify-center overflow-hidden">
             {/* Progress Bar */}
             <div className="absolute top-10 left-10 right-10 flex gap-1 z-10">
                <div className="h-0.5 bg-white/20 flex-1 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-full animate-progress"></div>
                </div>
             </div>

             <div className={`w-full aspect-[9/16] max-h-[85vh] transition-all duration-700 ease-out cursor-zoom-in ${isZoomed ? 'scale-[1.8] translate-y-20' : 'scale-100 rounded-[40px] shadow-2xl overflow-hidden'}`} onClick={toggleZoom}>
                <img 
                  src={activeStory.image} 
                  alt={activeStory.name} 
                  className={`w-full h-full object-cover transition-all duration-700 ${isZoomed ? '' : 'rounded-[40px]'}`} 
                />
                
                {/* Overlay Text - Only visible when not zoomed */}
                <div className={`absolute bottom-20 left-10 right-10 transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                   <div className="bg-orange-600 text-white p-2 rounded-xl w-fit mb-4 shadow-lg shadow-orange-600/30">
                      <Expand size={16} />
                   </div>
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none drop-shadow-2xl">{activeStory.name}</h2>
                   <p className="text-orange-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-4 italic mb-8">Exclusive Experience</p>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStory(null);
                        navigate(activeStory.path);
                        haptic.success();
                      }}
                      className="bg-white text-black px-8 py-5 rounded-[20px] font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-all shadow-2xl"
                    >
                      Découvrir l'offre <ArrowRight size={16} />
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 5s linear forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
