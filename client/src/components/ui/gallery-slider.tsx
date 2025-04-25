import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type GalleryImage } from "@shared/schema";

interface GallerySliderProps {
  images: GalleryImage[];
}

const GallerySlider = ({ images }: GallerySliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = images.length;
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const updateGallery = (newSlide: number) => {
    // Ensure the slide index is within bounds
    if (newSlide < 0) {
      setCurrentSlide(totalSlides - 1);
    } else if (newSlide >= totalSlides) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(newSlide);
    }
  };

  const nextSlide = () => {
    updateGallery(currentSlide + 1);
  };

  const prevSlide = () => {
    updateGallery(currentSlide - 1);
  };

  // Auto play functionality
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide]);

  // Pause auto play when user interacts with slider
  const handleInteraction = (action: () => void) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    action();
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  return (
    <div className="relative" id="gallery-slider">
      {/* Gallery Navigation Buttons */}
      <button 
        onClick={() => handleInteraction(prevSlide)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-r-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={() => handleInteraction(nextSlide)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-l-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Gallery Images Container */}
      <div className="overflow-hidden" id="gallery-container">
        <div 
          className="flex transition-transform duration-500" 
          id="gallery-track" 
          style={{ transform: `translateX(${currentSlide * -100}%)` }}
        >
          {images.map((image, index) => (
            <div key={image.id} className="min-w-full px-2">
              <img 
                src={image.image} 
                alt={image.alt} 
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Gallery Indicators */}
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <button 
            key={index}
            onClick={() => handleInteraction(() => setCurrentSlide(index))}
            className={`w-3 h-3 rounded-full mx-1 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default GallerySlider;
