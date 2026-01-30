'use client';

import Image from 'next/image';
import React from 'react';

type Props = {
  images: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  title?: string;
};

export default function ImageGallery({
  images,
  selectedIndex,
  onSelect,
  onPrev,
  onNext,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  title,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-colors">
      {images.length > 0 ? (
        <>
          <div
            className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={images[selectedIndex] || images[0]}
              alt={title || 'Property image'}
              fill
              className="object-cover"
              quality={80}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />

            {images.length > 1 && (
              <>
                {selectedIndex > 0 && (
                  <button
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-full shadow-lg transition-all z-10"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {selectedIndex < images.length - 1 && (
                  <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-full shadow-lg transition-all z-10"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all ${
                      selectedIndex === index ? 'ring-2 ring-red-500' : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      quality={70}
                      sizes="(max-width: 768px) 25vw, 120px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}
