import { useState } from "react";

export default function Gallery({ images = [] }) {
  const [active, setActive] = useState(null);

  const currentImage = (active && images.includes(active)) ? active : images[0];

  const getImageUrl = (path) => {
    if (!path) return "/images/default-house.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  if (!images.length) {
    return (
      <div className="h-72 bg-gray-200 flex items-center justify-center rounded-xl">
        Aucune image disponible
      </div>
    );
  }

  return (
    <div>
      <img
        src={getImageUrl(currentImage)}
        alt="bien"
        className="w-full h-96 object-cover rounded-xl border border-slate-100"
      />

      <div className="grid grid-cols-4 gap-3 mt-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={getImageUrl(img)}
            alt={`Aperçu ${index + 1}`}
            onClick={() => setActive(img)}
            className={`h-20 w-full object-cover rounded-lg cursor-pointer border-2 transition-all duration-150 ${
              currentImage === img 
                ? "border-blue-600 shadow-sm scale-95" 
                : "border-slate-200 hover:border-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}