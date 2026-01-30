'use client';

import { useState } from 'react';

export function PropertyImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  return (
    <div>
      <img
        src={images[index]}
        alt={title}
        className="w-full h-[400px] object-cover rounded-lg"
      />

      <div className="flex gap-2 mt-2 overflow-x-auto">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setIndex(i)}
            className={`h-20 w-20 object-cover rounded cursor-pointer ${
              i === index ? 'ring-2 ring-black' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
