import { useState } from 'react';

interface GalleryProps {
  images: { thumb: string; full: string }[];
}

export default function ImageGallery({ images }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
      {/* Blurred Placeholder underlying concept (could use placeholder CSS, but we use the thumb stretched) */}
      <img 
        src={images[currentIndex].thumb} 
        alt="Placeholder content" 
        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110"
      />
      
      {/* Main Image with srcSet for performance */}
      <img
        src={images[currentIndex].full}
        srcSet={`${images[currentIndex].thumb} 400w, ${images[currentIndex].full} 1200w`}
        sizes="(max-width: 600px) 400px, 1200px"
        alt={`Gallery ${currentIndex}`}
        className="relative z-10 w-full h-full object-contain"
        loading="lazy"
      />

      {/* Swipe Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
