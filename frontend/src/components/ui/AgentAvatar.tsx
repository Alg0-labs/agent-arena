import React from 'react';
import { clsx } from 'clsx';

type AvatarType = 'robot' | 'ghost' | 'oracle' | 'warrior' | 'scholar' | 'phantom' | 'hawk' | 'fox';
type ColorType = 'blue' | 'purple' | 'amber' | 'red' | 'green' | 'teal';

const avatarPaths: Record<AvatarType, React.ReactNode> = {
  robot: (
    <>
      <rect x="8" y="10" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="13" cy="16" r="2" fill="currentColor"/>
      <circle cx="19" cy="16" r="2" fill="currentColor"/>
      <rect x="11" y="20" width="10" height="2" rx="1" fill="currentColor"/>
      <path d="M12 10V8a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <line x1="8" y1="19" x2="5" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="19" x2="27" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </>
  ),
  ghost: (
    <>
      <path d="M16 4C10.477 4 6 8.477 6 14v12l3-3 3 3 3-3 3 3 3-3 3 3V14c0-5.523-4.477-10-10-10z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="13" cy="14" r="1.5" fill="currentColor"/>
      <circle cx="19" cy="14" r="1.5" fill="currentColor"/>
    </>
  ),
  oracle: (
    <>
      <circle cx="16" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M10 12h12M16 6v12" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="16" cy="12" rx="3" ry="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </>
  ),
  warrior: (
    <>
      <path d="M16 4l2 6h6l-5 3.5 2 6L16 16l-5 3.5 2-6L8 10h6l2-6z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.4"/>
    </>
  ),
  scholar: (
    <>
      <rect x="8" y="14" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 14V10a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <line x1="16" y1="17" x2="16" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </>
  ),
  phantom: (
    <>
      <path d="M16 4c-4 0-8 4-8 9v3l2 2 2-2 2 2 2-2 2 2 2-2v-3c0-5-4-9-8-9z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 13c0 0 1.5 2 4 2s4-2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="13" cy="11" r="1" fill="currentColor"/>
      <circle cx="19" cy="11" r="1" fill="currentColor"/>
    </>
  ),
  hawk: (
    <>
      <path d="M16 6c-2 0-6 2-8 6l3-1-2 5 5-2-1 4 3-2 3 2-1-4 5 2-2-5 3 1c-2-4-6-6-8-6z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
    </>
  ),
  fox: (
    <>
      <path d="M8 8l4 4-2 6c0 2 2 4 6 4s6-2 6-4l-2-6 4-4-6 2-2-4-2 4-6-2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="14" cy="14" r="1" fill="currentColor"/>
      <circle cx="18" cy="14" r="1" fill="currentColor"/>
    </>
  ),
};

const colorClasses: Record<ColorType, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', ring: 'ring-blue' },
  purple: { bg: 'bg-purple-500/15', text: 'text-purple-400', ring: 'ring-purple' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', ring: 'ring-amber' },
  red: { bg: 'bg-red-500/15', text: 'text-red-400', ring: 'ring-red' },
  green: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-green' },
  teal: { bg: 'bg-teal-500/15', text: 'text-teal-400', ring: 'ring-teal' },
};

interface AgentAvatarProps {
  avatar?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showRing?: boolean;
  className?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  avatar = 'robot',
  color = 'blue',
  size = 'md',
  showRing = false,
  className,
}) => {
  const avatarType = (avatar as AvatarType) in avatarPaths ? (avatar as AvatarType) : 'robot';
  const colorType = (color as ColorType) in colorClasses ? (color as ColorType) : 'blue';
  const colors = colorClasses[colorType];

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const svgSizes = {
    sm: 24,
    md: 28,
    lg: 36,
    xl: 52,
    '2xl': 72,
  };

  return (
    <div
      className={clsx(
        'rounded-2xl flex items-center justify-center flex-shrink-0',
        colors.bg,
        colors.text,
        sizes[size],
        showRing && colors.ring,
        className
      )}
    >
      <svg
        width={svgSizes[size]}
        height={svgSizes[size]}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {avatarPaths[avatarType]}
      </svg>
    </div>
  );
};

export { avatarPaths, colorClasses };
export type { AvatarType, ColorType };
