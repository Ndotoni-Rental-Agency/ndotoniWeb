'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamMember {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly initials: string;
  readonly color: string;
  readonly linkedin?: string;
}

interface TeamTabProps {
  teamMembers: readonly TeamMember[];
}

export default function TeamTab({ teamMembers }: TeamTabProps) {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <div 
      ref={ref}
      className={`space-y-12 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t('about.team.title')}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200 rounded-full"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t('about.team.subtitle')}
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="group">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-8 space-y-4 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
              <div className={`w-20 h-20 ${member.color} rounded-2xl flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform`}>
                {member.initials}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{member.role}</p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

