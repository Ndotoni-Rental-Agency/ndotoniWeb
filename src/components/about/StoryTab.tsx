'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPANY_INFO } from '@/config/company';

export default function StoryTab() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const milestones = [
    {
      year: '2016',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize property rentals in Tanzania'
    },
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'Launched our digital platform for better user experience'
    },
    {
      year: '2024',
      title: 'Market Leader',
      description: 'Became Tanzania\'s leading property rental platform'
    }
  ];

  return (
    <div 
      ref={ref}
      className={`space-y-12 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Story Header */}
      <div className="space-y-6">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
          {t('about.story.title')}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200 rounded-full"></div>
      </div>
      
      {/* Story Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p className="text-xl dark:text-gray-300">
              {t('about.story.paragraph1')}
            </p>
            <p className="dark:text-gray-300">
              {t('about.story.paragraph2')}
            </p>
            <p className="dark:text-gray-300">
              {t('about.story.paragraph3')}
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Our Mission
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {COMPANY_INFO.mission}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Our Vision
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {COMPANY_INFO.vision}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Journey</h3>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} milestone={milestone} delay={100 + index * 100} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, delay }: { milestone: any; delay: number }) {
  const { ref, isVisible } = useFadeIn({ delay });

  return (
    <div
      ref={ref}
      className={`flex items-start space-x-4 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm">
        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{milestone.year}</span>
      </div>
      <div className="flex-1 space-y-2">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          {milestone.title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {milestone.description}
        </p>
      </div>
    </div>
  );
}

