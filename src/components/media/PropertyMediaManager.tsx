'use client';

import { useState } from 'react';
import MediaSelector from './MediaSelector';

interface PropertyMedia {
  images: string[];
  videos: string[];
  floorPlan: string;
  virtualTour: string;
}

interface PropertyMediaManagerProps {
  media: PropertyMedia;
  onMediaChange: (media: PropertyMedia) => void;
  className?: string;
}

export default function PropertyMediaManager({
  media,
  onMediaChange,
  className = ''
}: PropertyMediaManagerProps) {
  const [activeSection, setActiveSection] = useState<'images' | 'videos' | 'floorplan' | 'tour'>('images');

  const handleImagesChange = (imageUrls: string[]) => {
    onMediaChange({
      ...media,
      images: imageUrls
    });
  };

  const handleVideosChange = (videoUrls: string[]) => {
    onMediaChange({
      ...media,
      videos: videoUrls
    });
  };

  const handleFloorPlanChange = (floorPlanUrl: string) => {
    onMediaChange({
      ...media,
      floorPlan: floorPlanUrl
    });
  };

  const handleVirtualTourChange = (tourUrl: string) => {
    onMediaChange({
      ...media,
      virtualTour: tourUrl
    });
  };

  const sections = [
    { id: 'images', name: 'Photos', count: media.images.length, icon: '📷' },
    { id: 'videos', name: 'Videos', count: media.videos.length, icon: '🎥' },
    { id: 'floorplan', name: 'Floor Plan', count: media.floorPlan ? 1 : 0, icon: '📐' },
    { id: 'tour', name: 'Virtual Tour', count: media.virtualTour ? 1 : 0, icon: '🏠' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Property Media</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
          Add photos, videos, and other media to showcase your property
        </p>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 transition-colors">
        <nav className="-mb-px flex space-x-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.name}</span>
              {section.count > 0 && (
                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full transition-colors ${
                  activeSection === section.id ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="min-h-[400px]">
        {activeSection === 'images' && (
          <MediaSelector
            selectedMedia={media.images}
            onMediaChange={handleImagesChange}
            maxSelection={10}
          />
        )}

        {activeSection === 'videos' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 transition-colors">Video Upload</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 transition-colors">
                    Video uploads are coming soon. For now, you can add video URLs manually.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                Video URLs (one per line)
              </label>
              <textarea
                value={media.videos.join('\n')}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter(url => url.trim());
                  handleVideosChange(urls);
                }}
                rows={4}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="https://example.com/video1.mp4&#10;https://example.com/video2.mp4"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                Enter video URLs (YouTube, Vimeo, or direct video links)
              </p>
            </div>
          </div>
        )}

        {activeSection === 'floorplan' && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-colors">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100 transition-colors">Floor Plan</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1 transition-colors">
                    Upload a floor plan to help tenants understand the layout
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                Floor Plan URL
              </label>
              <input
                type="url"
                value={media.floorPlan}
                onChange={(e) => handleFloorPlanChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="https://example.com/floorplan.jpg"
              />
              
              {media.floorPlan && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Preview:</p>
                  <img
                    src={media.floorPlan}
                    alt="Floor Plan"
                    className="max-w-md h-auto border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'tour' && (
          <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 transition-colors">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 transition-colors">Virtual Tour</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1 transition-colors">
                    Add a 360° virtual tour or interactive walkthrough
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                Virtual Tour URL
              </label>
              <input
                type="url"
                value={media.virtualTour}
                onChange={(e) => handleVirtualTourChange(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="https://example.com/virtual-tour"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                Supports Matterport, 360° photo platforms, or custom virtual tour links
              </p>
              
              {media.virtualTour && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Virtual Tour Link:</p>
                  <a
                    href={media.virtualTour}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm break-all transition-colors"
                  >
                    {media.virtualTour}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Media Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">Media Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors">{media.images.length}</div>
            <div className="text-gray-600 dark:text-gray-400 transition-colors">Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors">{media.videos.length}</div>
            <div className="text-gray-600 dark:text-gray-400 transition-colors">Videos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-colors">{media.floorPlan ? 1 : 0}</div>
            <div className="text-gray-600 dark:text-gray-400 transition-colors">Floor Plan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors">{media.virtualTour ? 1 : 0}</div>
            <div className="text-gray-600 dark:text-gray-400 transition-colors">Virtual Tour</div>
          </div>
        </div>
      </div>
    </div>
  );
}