'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  iconOnly?: boolean;
}

export default function Logo({
  className = '',
  showTagline = true,
  size = 'md',
  href = '/',
  iconOnly = false
}: LogoProps) {
  const sizeMap = {
    sm: { width: 36, height: 36 },
    md: { width: 44, height: 44 },
    lg: { width: 56, height: 56 },
  };

  const { width, height } = sizeMap[size];

  return (
    <Link
      href={href}
      className={`group inline-flex items-center ${className}`}
    >
      {/* Dark mode logo */}
      <Image
        src="/images/logo-dark-mode.png"
        alt="Ndotoni"
        width={width}
        height={height}
        priority
        className="object-contain hidden dark:block"
      />
      {/* Light mode logo */}
      <Image
        src="/images/logo-light-mode.png"
        alt="Ndotoni"
        width={width}
        height={height}
        priority
        className="object-contain block dark:hidden"
      />
    </Link>
  );
}
