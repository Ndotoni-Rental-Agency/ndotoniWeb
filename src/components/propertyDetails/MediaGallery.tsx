'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

type Props = {
  images: string[];
  videos?: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  title?: string;
};

export default function MediaGallery({
  images,
  videos = [],
  selectedIndex,
  onSelect,
  onPrev,
  onNext,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  title,
}: Props) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  // Combine images and videos into a single media array
  const mediaItems: MediaItem[] = [
    ...images.map(url => ({ type: 'image' as const, url })),
    ...videos.map(url => ({ type: 'video' as const, url })),
  ];

  const hasMedia = mediaItems.length > 0;
  const currentMedia = mediaItems[selectedIndex];

  const handleVideoClick = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {hasMedia ? (
          <>
            {/* Hero media */}
            <div
              className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900 group touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {currentMedia.type === 'image' ? (
                <Image
                  src={currentMedia.url}
                  alt={title || 'Property image'}
                  fill
                  priority
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  className="object-cover"
                />
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => handleVideoClick(currentMedia.url)}
                >
                  <video
                    src={currentMedia.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="w-12 h-12 text-red-600" fill="currentColor" />
                    </div>
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Navigation */}
              {mediaItems.length > 1 && (
                <>
                  {selectedIndex > 0 && (
                    <NavButton side="left" onClick={onPrev}>
                      <ChevronLeft />
                    </NavButton>
                  )}

                  {selectedIndex < mediaItems.length - 1 && (
                    <NavButton side="right" onClick={onNext}>
                      <ChevronRight />
                    </NavButton>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium">
                    {selectedIndex + 1} / {mediaItems.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="p-4">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {mediaItems.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => onSelect(index)}
                      className={`relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden transition ${
                        selectedIndex === index
                          ? 'ring-2 ring-red-500'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {media.type === 'image' ? (
                        <Image
                          src={media.url}
                          alt={`Media ${index + 1}`}
                          fill
                          quality={60}
                          className="object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          {/* Video indicator */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-6 h-6 text-white" fill="currentColor" />
                          </div>
                        </div>
                      )}
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

      {/* Video Modal */}
      {isVideoModalOpen && currentVideoUrl && (
        <VideoModal videoUrl={currentVideoUrl} onClose={closeVideoModal} title={title} />
      )}
    </>
  );
}

/* ---------- Video Modal ---------- */

function VideoModal({ 
  videoUrl, 
  onClose, 
  title 
}: { 
  videoUrl: string; 
  onClose: () => void; 
  title?: string;
}) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close video"
      >
        <X className="w-8 h-8" />
      </button>

      <div 
        className="relative w-full max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full rounded-lg"
          aria-label={title || 'Property video'}
        >
          Your browser does not support the video tag.
        </video>
      </div>
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
      aria-label={`${side} media`}
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
