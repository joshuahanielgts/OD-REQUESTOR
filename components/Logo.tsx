import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/srm-logo.png"
        alt="SRM University Logo"
        width={size === 'small' ? 32 : size === 'medium' ? 48 : 80}
        height={size === 'small' ? 32 : size === 'medium' ? 48 : 80}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
      <div className="flex flex-col">
        <span className={`font-bold text-blue-800 ${
          size === 'small' ? 'text-sm' : size === 'medium' ? 'text-lg' : 'text-2xl'
        }`}>
          SRM University
        </span>
        <span className={`text-gray-600 ${
          size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-lg'
        }`}>
          OD Management System
        </span>
      </div>
    </div>
  );
};

export default Logo;