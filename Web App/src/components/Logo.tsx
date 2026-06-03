import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'app-icon' | 'text' | 'full';
  isAnswering?: boolean;
}

export default function Logo({ className = '', size = 32, variant = 'emblem', isAnswering = false }: LogoProps) {
  // Ultra-premium, transparent SVG Logo with silky-smooth, perfectly centered CSS breathing animations.
  // Completely transparent, no background borders or boxed frames.
  const svgContent = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none overflow-visible"
    >
      <defs>
        {/* Vibrant futuristic glowing gradients */}
        <linearGradient id="primaryNovaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="40%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        {/* Soft radial glow to illuminate the logo core from behind */}
        <radialGradient id="behindGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>

        {/* Outer neon glow for vector line work */}
        <filter id="novaNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* CSS Keyframes for a perfectly centered, majestic breathing motion */}
        <style>{`
          @keyframes coreBreatheSimple {
            0%, 100% {
              transform: scale(0.92);
              opacity: 0.95;
            }
            50% {
              transform: scale(1.08);
              opacity: 1;
            }
          }

          @keyframes coreAnswering {
            0%, 100% {
              transform: scale(0.85) rotate(0deg);
              filter: drop-shadow(0 0 4px rgba(129, 140, 248, 0.4));
            }
            55% {
              transform: scale(1.18) rotate(180deg);
              filter: drop-shadow(0 0 16px rgba(129, 140, 248, 0.9));
            }
          }

          @keyframes satelliteBreathe {
            0%, 100% {
              transform: scale(0.85);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.15);
              opacity: 1;
            }
          }

          @keyframes satelliteAnswering {
            0%, 100% {
              transform: scale(0.8) translate(0px, 0px);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.25) translate(2px, -2px);
              opacity: 1;
            }
          }

          @keyframes backdropPulse {
            0%, 100% {
              transform: scale(0.9);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.6;
            }
          }

          /* Animated classes using high-performance composite properties with exact anchors */
          .nova-core-star {
            transform-origin: 50% 50%;
            animation: coreBreatheSimple 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .nova-core-star-answering {
            transform-origin: 50% 50%;
            animation: coreAnswering 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .nova-side-sparkle {
            transform-origin: 75% 25%;
            animation: satelliteBreathe 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .nova-side-sparkle-answering {
            transform-origin: 75% 25%;
            animation: satelliteAnswering 2s ease-in-out infinite;
          }

          .nova-side-circle {
            transform-origin: 25% 75%;
            animation: satelliteBreathe 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .nova-side-circle-answering {
            transform-origin: 25% 75%;
            animation: satelliteAnswering 2.5s ease-in-out infinite;
          }

          .nova-glowing-backdrop {
            transform-origin: 50% 50%;
            animation: backdropPulse 4s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Atmospheric back lighting to make the logo look premium on dark backgrounds */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="url(#behindGlowGrad)"
        className="nova-glowing-backdrop"
        pointerEvents="none"
      />

      {/* Group holding glows for high-fidelity rendering */}
      <g filter="url(#novaNeonGlow)">
        {/* Main Central Part: Perfectly Symmetrical 4-Point Star (Sparkle) */}
        <path
          d="M 50 20 
             C 50 50, 50 50, 80 50 
             C 50 50, 50 50, 50 80 
             C 50 50, 50 50, 20 50 
             C 50 50, 50 50, 50 20 Z"
          fill="url(#primaryNovaGrad)"
          fillRule="evenodd"
          clipRule="evenodd"
          className={isAnswering ? "nova-core-star-answering" : "nova-core-star"}
        />

        {/* Small Elegant Sparkle Accent (Top Right) */}
        <path
          d="M 75 18 
             C 75 25, 75 25, 82 25 
             C 75 25, 75 25, 75 32 
             C 75 25, 75 25, 68 25 
             C 75 25, 75 25, 75 18 Z"
          fill="url(#primaryNovaGrad)"
          fillRule="evenodd"
          clipRule="evenodd"
          className={isAnswering ? "nova-side-sparkle-answering" : "nova-side-sparkle"}
          opacity="0.9"
        />

        {/* Floating Ring/Circle Accent (Bottom Left) */}
        <circle
          cx="25"
          cy="75"
          r="4.5"
          stroke="url(#primaryNovaGrad)"
          strokeWidth="2"
          fill="none"
          className={isAnswering ? "nova-side-circle-answering" : "nova-side-circle"}
          opacity="0.8"
        />
      </g>
    </svg>
  );

  if (variant === 'text') {
    return (
      <span className={`font-sans font-extrabold tracking-tight text-white ${className}`}>
        Esti<span className="text-indigo-400">Nova</span>
      </span>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div style={{ width: size, height: size }} className="shrink-0 flex items-center justify-center">
          {svgContent}
        </div>
        <span className="font-sans font-extrabold tracking-tight text-white text-lg">
          Esti<span className="text-indigo-400">Nova</span>
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {svgContent}
    </div>
  );
}
