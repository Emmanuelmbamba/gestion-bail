import { useState } from "react";
import { FaExpand, FaImages } from "react-icons/fa";

export default function Gallery({ images = [] }) {
  const [active, setActive] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = active && images.includes(active) ? active : images[0];

  const getImageUrl = (path) => {
    if (!path) return "/images/default-house.jpg";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `https://gestion-bail-backend.onrender.com${cleanPath}`;
  };

  if (!images || !images.length) {
    return (
      <div className="h-80 bg-slate-100 flex flex-col items-center justify-center rounded-3xl border border-slate-200/60 text-slate-400 gap-2">
        <FaImages className="text-4xl text-slate-300" />
        <span className="font-semibold text-xs text-slate-500">Aucune photo disponible pour ce bien</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Showcase */}
      <div className="relative group overflow-hidden rounded-3xl shadow-md border border-slate-100 bg-slate-900">
        <img
          crossOrigin="anonymous"
          src={getImageUrl(currentImage)}
          alt="Vue principale du bien"
          className="w-full h-80 sm:h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
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
            {images.indexOf(currentImage) + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActive(img)}
              className={`relative rounded-2xl overflow-hidden h-20 border-2 transition-all duration-200 cursor-pointer ${
                currentImage === img
                  ? "border-blue-600 ring-2 ring-blue-600/30 scale-95 shadow-md"
                  : "border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400"
              }`}
            >
              <img
                crossOrigin="anonymous"
                src={getImageUrl(img)}
                alt={`Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-slate-300 font-bold cursor-pointer"
          >
            ✕
          </button>
          <img
            crossOrigin="anonymous"
            src={getImageUrl(currentImage)}
            alt="Plein écran"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}