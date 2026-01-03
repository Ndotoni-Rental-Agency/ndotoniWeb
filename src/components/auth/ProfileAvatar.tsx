'use client';

import { User } from '@/types';

interface ProfileAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-2xl',
};

export function ProfileAvatar({ user, size = 'md', className = '' }: ProfileAvatarProps) {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  
  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={`${user.firstName} ${user.lastName}`}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-red-500 rounded-full flex items-center justify-center ${className}`}>
      <span className="text-white font-bold">
        {initials}
      </span>
    </div>
  );
}