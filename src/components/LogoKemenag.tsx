import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const LogoKemenag: React.FC<LogoProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Pentagon Border */}
      <polygon
        points="100,6 194,74 158,190 42,190 6,74"
        fill="#047857"
        stroke="#FBBF24"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Inner Green Field */}
      <polygon
        points="100,16 182,76 150,180 50,180 18,76"
        fill="#059669"
        stroke="#FDE047"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Bintang Emas */}
      <polygon
        points="100,28 105,42 120,42 108,52 113,66 100,57 87,66 92,52 80,42 95,42"
        fill="#FBBF24"
      />

      {/* Padi (Kanan) */}
      <path
        d="M110,65 Q145,100 135,140"
        stroke="#FBBF24"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="125" cy="80" r="4" fill="#FBBF24" />
      <circle cx="132" cy="95" r="4" fill="#FBBF24" />
      <circle cx="135" cy="110" r="4" fill="#FBBF24" />
      <circle cx="132" cy="125" r="4" fill="#FBBF24" />

      {/* Kapas (Kiri) */}
      <path
        d="M90,65 Q55,100 65,140"
        stroke="#FFFFFF"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="75" cy="80" r="4" fill="#FFFFFF" />
      <circle cx="68" cy="95" r="4" fill="#FFFFFF" />
      <circle cx="65" cy="110" r="4" fill="#FFFFFF" />
      <circle cx="68" cy="125" r="4" fill="#FFFFFF" />

      {/* Kitab Suci Al-Qur'an & Rehal */}
      <path
        d="M78,102 Q100,90 100,102 Q100,90 122,102 L122,122 Q100,110 100,122 Q100,110 78,122 Z"
        fill="#FDE047"
        stroke="#065F46"
        strokeWidth="2"
      />
      {/* Rehal Kayu Penyangga */}
      <path
        d="M72,130 L128,105 M128,130 L72,105"
        stroke="#1E293B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Pita Putih */}
      <path
        d="M48,155 Q100,145 152,155 L144,168 Q100,158 56,168 Z"
        fill="#FFFFFF"
        stroke="#065F46"
        strokeWidth="1.5"
      />
      <text
        x="100"
        y="163"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="bold"
        fill="#065F46"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        IKHLAS BERAMAL
      </text>
    </svg>
  );
};
