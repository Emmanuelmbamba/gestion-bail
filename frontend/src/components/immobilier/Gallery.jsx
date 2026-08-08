import { useState, useEffect } from "react";
import { FaExpand, FaImages, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export default function Gallery({ images = [] }) {
  const [active, setActive] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80";

  const currentIndex = active && images.includes(active) ? images.indexOf(active) : 0;
  const currentImage = images[currentIndex] || fallbackImage;

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return fallbackImage;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const apiBase = import.meta.env.VITE_API_URL || "https://gestion-bail-backend.onrender.com/api";
    const serverUrl = apiBase.replace(/\/api\/?$/, "").replace(/\/$/, "");

    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${serverUrl}${cleanPath}`;
  };

  const handleNext = () => {
    if (!images || images.length <= 1) return;
    const nextIdx = (currentIndex + 1) % images.length;
    setActive(images[nextIdx]);
  };

  const handlePrev = () => {
    if (!images || images.length <= 1) return;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setActive(images[prevIdx]);
  };

  // Support swipe mobile (glisser à gauche/droite)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Raccourcis clavier pour le mode Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentIndex, images]);

  if (!images || !images.length) {
    return (
      <div className="h-80 bg-slate-100 flex flex-col items-center justify-center rounded-3xl border border-slate-200/60 text-slate-400 gap-2">
        <FaImages className="text-4xl text-slate-300" />
        <span className="font-semibold text-xs text-slate-500">Aucune photo disponible pour ce bien</span>
      </div>
    );
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
  };

  return (
    <div className="space-y-4">
      {/* Main Image Showcase */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative group overflow-hidden rounded-3xl shadow-md border border-slate-100 bg-slate-900 select-none"
      >
        <img
          src={getImageUrl(currentImage)}
          alt="Vue principale du bien"
          onError={handleImageError}
          className="w-full h-80 sm:h-[450px] object-cover transition-all duration-300 group-hover:scale-102"
        />

        {/* Flèches Navigation (Visibles sur Hover et Mobile) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
              title="Photo précédente"
            >
              <FaChevronLeft className="text-sm sm:text-base" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
              title="Photo suivante"
            >
              <FaChevronRight className="text-sm sm:text-base" />
            </button>
          </>
        )}

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="p-3 bg-slate-900/60 backdrop-blur-md text-white rounded-2xl hover:bg-slate-900/90 transition shadow-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <FaExpand /> Agrandir
          </button>
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-4 left-4 bg-slate-900/75 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/10">
          <FaImages className="text-blue-400" />
          <span>
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(img)}
              className={`relative rounded-2xl overflow-hidden h-20 border-2 transition-all duration-200 cursor-pointer ${
                currentIndex === index
                  ? "border-blue-600 ring-2 ring-blue-600/30 scale-95 shadow-md"
                  : "border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400"
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Miniature ${index + 1}`}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-2xl p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer z-10"
            title="Fermer"
          >
            <FaTimes />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition shadow-2xl hover:scale-110 cursor-pointer z-10"
                title="Photo précédente"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition shadow-2xl hover:scale-110 cursor-pointer z-10"
                title="Photo suivante"
              >
                <FaChevronRight className="text-xl" />
              </button>
            </>
          )}

          <img
            src={getImageUrl(currentImage)}
            alt="Plein écran"
            onError={handleImageError}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
          />

          <div className="absolute bottom-6 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10">
            {currentIndex + 1} sur {images.length}
          </div>
        </div>
      )}
    </div>
  );
}