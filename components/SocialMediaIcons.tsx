'use client';

import React from 'react';

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialMediaIconsProps {
  socialLinks: SocialLink[];
  size?: 'sm' | 'md' | 'lg';
}

const platformConfig: Record<string, { icon: string; color: string; name: string }> = {
  instagram: {
    icon: '📷',
    color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500',
    name: 'Instagram'
  },
  tiktok: {
    icon: '🎵',
    color: 'hover:bg-black',
    name: 'TikTok'
  },
  youtube: {
    icon: '▶️',
    color: 'hover:bg-red-600',
    name: 'YouTube'
  },
  twitter: {
    icon: '🐦',
    color: 'hover:bg-blue-400',
    name: 'Twitter'
  },
  facebook: {
    icon: '👥',
    color: 'hover:bg-blue-600',
    name: 'Facebook'
  },
  threads: {
    icon: '🧵',
    color: 'hover:bg-black',
    name: 'Threads'
  },
  snapchat: {
    icon: '👻',
    color: 'hover:bg-yellow-400',
    name: 'Snapchat'
  },
  twitch: {
    icon: '🎮',
    color: 'hover:bg-purple-600',
    name: 'Twitch'
  },
  linkedin: {
    icon: '💼',
    color: 'hover:bg-blue-700',
    name: 'LinkedIn'
  },
  pinterest: {
    icon: '📌',
    color: 'hover:bg-red-500',
    name: 'Pinterest'
  },
  whop: {
    icon: '🛍️',
    color: 'hover:bg-indigo-600',
    name: 'Whop'
  },
  skool: {
    icon: '🎓',
    color: 'hover:bg-orange-500',
    name: 'Skool'
  },
  spotify: {
    icon: '🎧',
    color: 'hover:bg-green-500',
    name: 'Spotify'
  },
  apple_podcast: {
    icon: '🎙️',
    color: 'hover:bg-purple-500',
    name: 'Apple Podcast'
  },
  website: {
    icon: '🌐',
    color: 'hover:bg-gray-700',
    name: 'Website'
  }
};

const sizeClasses = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-lg',
  lg: 'w-12 h-12 text-xl'
};

export default function SocialMediaIcons({ socialLinks, size = 'md' }: SocialMediaIconsProps) {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks.map((link, index) => {
        const config = platformConfig[link.platform];

        if (!config) return null;

        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              ${sizeClasses[size]}
              glass-effect
              rounded-lg
              flex items-center justify-center
              transition-all duration-300
              ${config.color}
              hover:scale-110
              hover:shadow-glow
              group
              relative
            `}
            title={config.name}
          >
            <span className="text-white">{config.icon}</span>

            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {config.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
