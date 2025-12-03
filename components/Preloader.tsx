'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Generate positions: small cluster at center, then random scattered positions
const generateImagePositions = (count: number, images: string[]) => {
  const positions = [];

  for (let i = 0; i < count; i++) {
    // Random scattered position for final state (blast target)
    const finalTop = Math.random() * 85 + 5; // 5-90%
    const finalLeft = Math.random() * 85 + 5; // 5-90%

    // Initial position: small cluster around center
    const angle = Math.random() * Math.PI * 2;
    const clusterRadius = Math.random() * 5 + 2; // 2-7% radius cluster
    const initialTop = 50 + Math.sin(angle) * clusterRadius;
    const initialLeft = 50 + Math.cos(angle) * clusterRadius;

    positions.push({
      initialTop,
      initialLeft,
      top: finalTop,
      left: finalLeft,
      delay: Math.random() * 0.2,
      image: images[i % images.length],
    });
  }

  return positions;
};

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [slide, setSlide] = useState(1);
  const [fadeOut, setFadeOut] = useState(false);
  const [imagePositions, setImagePositions] = useState<Array<{initialTop: number, initialLeft: number, top: number, left: number, delay: number, image: string}>>([]);
  const [mounted, setMounted] = useState(false);
  const [profileImages, setProfileImages] = useState<string[]>([]);

  useEffect(() => {
    // Fetch random profile images from API
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/profiles?limit=60&status=published`);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          const images = result.data
            .map((p: any) => p.image_url)
            .filter((url: string) => url && !url.includes('default.png'))
            .map((url: string) => {
              // Convert relative URLs to absolute
              if (url.startsWith('/uploads/')) {
                return `http://localhost:5001${url}`;
              }
              return url;
            });

          if (images.length > 0) {
            setProfileImages(images);
            setImagePositions(generateImagePositions(60, images));
          }
        }
      } catch (error) {
        console.error('Error fetching profile images:', error);
        // Fallback to empty state if API fails
        setProfileImages([]);
      } finally {
        setMounted(true);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timings = [
      { slide: 1, duration: 2000 },  // Initial centered text
      { slide: 2, duration: 1500 },  // Text splits, Becometry fades in
      { slide: 3, duration: 500 },   // Hide text, show ~10 images clustered at center
      { slide: 4, duration: 800 },   // Blast all 60 images outward to scattered positions
      { slide: 5, duration: 600 },   // Images start fading out
      { slide: 6, duration: 400 },   // Complete fade to black
    ];

    let currentIndex = 0;

    const advanceSlide = () => {
      if (currentIndex < timings.length - 1) {
        currentIndex++;
        setSlide(timings[currentIndex].slide);
        setTimeout(advanceSlide, timings[currentIndex].duration);
      } else {
        // After images fade out, transition to main app
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => onComplete(), 500);
        }, 200);
      }
    };

    const timer = setTimeout(advanceSlide, timings[0].duration);
    return () => clearTimeout(timer);
  }, [onComplete, mounted]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#141414] flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Slide 1 & 2: Animated text transition */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
        slide >= 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Upper line - slides to left */}
          <p className={`absolute text-white text-2xl font-medium font-['Poppins',sans-serif] transition-all duration-1000 ease-in-out ${
            slide === 1
              ? 'top-1/2 -translate-y-8 left-1/2 -translate-x-1/2 opacity-100'
              : 'top-[348px] left-8 translate-x-0 translate-y-0 opacity-100'
          }`}>
            Your next mentor is just
          </p>

          {/* Lower line - slides to right */}
          <p className={`absolute text-white text-2xl font-medium font-['Poppins',sans-serif] transition-all duration-1000 ease-in-out ${
            slide === 1
              ? 'top-1/2 translate-y-2 left-1/2 -translate-x-1/2 opacity-100'
              : slide === 2
              ? 'top-[384px] right-8 translate-x-0 translate-y-0 text-right opacity-100'
              : 'opacity-0'
          }`}>
            a few seconds away
          </p>

          {/* Becometry - fades in center */}
          <p className={`text-white text-4xl font-medium font-['Poppins',sans-serif] transition-all duration-1000 ease-in-out ${
            slide >= 2 && slide < 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}>
            Becometry
          </p>
        </div>
      </div>

      {/* Slide 3-4: Images blasting out from center - stay visible */}
      <div className={`absolute inset-0 ${
        slide >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="relative w-full h-full">
          {mounted && imagePositions.map((pos, index) => {
            const showInSlide3 = slide === 3 && index < 10;
            const showInSlide4 = slide >= 4;
            const shouldShow = showInSlide3 || showInSlide4;

            if (!shouldShow) return null;

            // Determine current position based on slide
            let currentTop, currentLeft, currentOpacity;

            if (slide === 3) {
              // Clustered at center
              currentTop = pos.initialTop;
              currentLeft = pos.initialLeft;
              currentOpacity = 1;
            } else if (slide === 4) {
              // Blasted outward
              currentTop = pos.top;
              currentLeft = pos.left;
              currentOpacity = 1;
            } else if (slide === 5) {
              // Starting to fade
              currentTop = pos.top;
              currentLeft = pos.left;
              currentOpacity = 0.4;
            } else {
              // Fully faded
              currentTop = pos.top;
              currentLeft = pos.left;
              currentOpacity = 0;
            }

            return (
              <div
                key={index}
                className="absolute w-[51px] h-[63px] rounded-[4px] overflow-hidden shadow-xl"
                style={{
                  top: `${currentTop}%`,
                  left: `${currentLeft}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: slide === 4
                    ? `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${pos.delay}s`
                    : slide >= 5
                    ? `opacity 0.5s ease-out`
                    : 'none',
                  opacity: currentOpacity,
                  zIndex: 60 - index,
                }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={pos.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
