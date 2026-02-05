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
  const hasImages = images.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
      {hasImages ? (
        <>
          {/* Hero image */}
          <div
            className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900 group touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={images[selectedIndex]}
              alt={title || 'Property image'}
              fill
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              className="object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                {selectedIndex > 0 && (
                  <NavButton side="left" onClick={onPrev}>
                    <ChevronLeft />
                  </NavButton>
                )}

                {selectedIndex < images.length - 1 && (
                  <NavButton side="right" onClick={onNext}>
                    <ChevronRight />
                  </NavButton>
                )}

                {/* Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="p-4">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(index)}
                    className={`relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden transition ${
                      selectedIndex === index
                        ? 'ring-2 ring-emerald-500'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Photo ${index + 1}`}
                      fill
                      quality={60}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

/* ---------- Small Components ---------- */

function NavButton({
  side,
  onClick,
  children,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`${side} image`}
      className={`absolute ${
        side === 'left' ? 'left-4' : 'right-4'
      } top-1/2 -translate-y-1/2 z-10
      bg-white/90 dark:bg-gray-800/90
      text-gray-800 dark:text-white
      p-2 rounded-full shadow-md
      opacity-100 md:opacity-0 md:group-hover:opacity-100
      transition`}
    >
      {children}
    </button>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="aspect-[4/3] flex items-center justify-center bg-gray-200 dark:bg-gray-700">
      <svg
        className="w-16 h-16 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}
