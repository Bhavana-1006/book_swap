import React from 'react';

const FLOATING_BOOKS = [
  {
    id: 'maths-10',
    title: '10th Mathematics',
    subtitle: 'Secondary Education',
    motif: (
      <svg className="w-12 h-12 text-amber-300 mx-auto stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="50" r="38" opacity="0.4" />
        <polygon points="50,16 82,78 18,78" />
        <circle cx="50" cy="50" r="14" />
        <line x1="50" y1="16" x2="50" y2="78" strokeDasharray="3 3" />
      </svg>
    ),
    coverBg: 'from-[#2D5A43] via-[#1E4330] to-[#122A1E]',
    borderColor: 'border-emerald-400/40',
    foilColor: 'text-amber-300',
    accentColor: '#4ADE80',
    // Position: Upper Left
    desktopClass: 'top-[8%] left-[2%] lg:left-[4%]',
    rotation: '-rotate-12 hover:-rotate-6',
    floatDelay: '0s',
    floatDuration: '6.2s'
  },
  {
    id: 'physics-inter',
    title: 'Intermediate Physics',
    subtitle: 'Physical Sciences',
    motif: (
      <svg className="w-12 h-12 text-amber-200 mx-auto stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.4" />
        <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(30 50 50)" />
        <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(-30 50 50)" />
        <ellipse cx="50" cy="50" rx="38" ry="14" transform="rotate(90 50 50)" />
      </svg>
    ),
    coverBg: 'from-[#1E3A8A] via-[#172554] to-[#0F172A]',
    borderColor: 'border-blue-400/40',
    foilColor: 'text-amber-200',
    accentColor: '#60A5FA',
    // Position: Upper Mid Left
    desktopClass: 'top-[5%] left-[26%] lg:left-[28%]',
    rotation: '-rotate-6 hover:rotate-0',
    floatDelay: '1.4s',
    floatDuration: '7.1s'
  },
  {
    id: 'anatomy-med',
    title: 'Human Anatomy',
    subtitle: 'Medical Science',
    motif: (
      <svg className="w-12 h-12 text-stone-700 mx-auto stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="2">
        <circle cx="50" cy="50" r="40" />
        <rect x="22" y="22" width="56" height="56" />
        <circle cx="50" cy="30" r="8" />
        <line x1="50" y1="38" x2="50" y2="74" />
        <line x1="26" y1="44" x2="74" y2="44" />
        <line x1="50" y1="74" x2="32" y2="92" />
        <line x1="50" y1="74" x2="68" y2="92" />
      </svg>
    ),
    coverBg: 'from-[#D9CAAF] via-[#C8B698] to-[#B39F80]',
    borderColor: 'border-stone-400/50',
    foilColor: 'text-stone-900',
    accentColor: '#D97706',
    textColor: 'text-stone-950',
    // Position: Lower Left
    desktopClass: 'top-[44%] left-[4%] lg:left-[6%]',
    rotation: 'rotate-6 hover:rotate-12',
    floatDelay: '2.2s',
    floatDuration: '6.8s'
  },
  {
    id: 'dsa-eng',
    title: 'Data Structures',
    subtitle: 'Computer Science',
    motif: (
      <svg className="w-12 h-12 text-teal-200 mx-auto stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="22" r="9" />
        <circle cx="30" cy="56" r="9" />
        <circle cx="70" cy="56" r="9" />
        <circle cx="20" cy="84" r="7" />
        <circle cx="40" cy="84" r="7" />
        <circle cx="60" cy="84" r="7" />
        <circle cx="80" cy="84" r="7" />
        <line x1="44" y1="28" x2="34" y2="48" />
        <line x1="56" y1="28" x2="66" y2="48" />
        <line x1="26" y1="63" x2="22" y2="77" />
        <line x1="34" y1="63" x2="38" y2="77" />
        <line x1="66" y1="63" x2="62" y2="77" />
        <line x1="74" y1="63" x2="78" y2="77" />
      </svg>
    ),
    coverBg: 'from-[#115E59] via-[#0F4C5C] to-[#082F38]',
    borderColor: 'border-teal-300/40',
    foilColor: 'text-teal-200',
    accentColor: '#2DD4BF',
    // Position: Upper Right
    desktopClass: 'top-[6%] right-[22%] lg:right-[24%]',
    rotation: 'rotate-6 hover:rotate-0',
    floatDelay: '0.8s',
    floatDuration: '6.5s'
  },
  {
    id: 'ml-ai',
    title: 'Machine Learning',
    subtitle: 'Artificial Intelligence',
    motif: (
      <svg className="w-12 h-12 text-purple-200 mx-auto stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
        <path d="M 30,50 Q 50,20 70,50 Q 50,80 30,50 Z" opacity="0.5" />
        <circle cx="50" cy="50" r="12" />
        <circle cx="28" cy="36" r="6" />
        <circle cx="28" cy="64" r="6" />
        <circle cx="72" cy="36" r="6" />
        <circle cx="72" cy="64" r="6" />
        <line x1="33" y1="38" x2="42" y2="44" />
        <line x1="33" y1="62" x2="42" y2="56" />
        <line x1="67" y1="38" x2="58" y2="44" />
        <line x1="67" y1="62" x2="58" y2="56" />
      </svg>
    ),
    coverBg: 'from-[#581C87] via-[#3B0764] to-[#240046]',
    borderColor: 'border-purple-300/40',
    foilColor: 'text-purple-200',
    accentColor: '#C084FC',
    // Position: Far Upper Right
    desktopClass: 'top-[8%] right-[2%] lg:right-[4%]',
    rotation: 'rotate-12 hover:rotate-6',
    floatDelay: '2.8s',
    floatDuration: '7.4s'
  },
  {
    id: 'chem-inter',
    title: 'Chemistry',
    subtitle: 'Chemical Sciences',
    motif: (
      <svg className="w-12 h-12 text-amber-200 mx-auto stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
        <polygon points="50,15 78,32 78,68 50,85 22,68 22,32" />
        <circle cx="50" cy="50" r="14" opacity="0.4" />
        <circle cx="50" cy="15" r="4" fill="currentColor" />
        <circle cx="78" cy="32" r="4" fill="currentColor" />
        <circle cx="78" cy="68" r="4" fill="currentColor" />
        <circle cx="50" cy="85" r="4" fill="currentColor" />
        <circle cx="22" cy="68" r="4" fill="currentColor" />
        <circle cx="22" cy="32" r="4" fill="currentColor" />
      </svg>
    ),
    coverBg: 'from-[#9A3412] via-[#7C2D12] to-[#431407]',
    borderColor: 'border-amber-300/40',
    foilColor: 'text-amber-200',
    accentColor: '#FB923C',
    // Position: Lower Right
    desktopClass: 'top-[42%] right-[8%] lg:right-[10%]',
    rotation: '-rotate-6 hover:-rotate-12',
    floatDelay: '1.9s',
    floatDuration: '6.7s'
  }
];

export const FlowingHeroBooks = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
      {/* Background Library Bookshelf Texture with Ambient Depth of Field */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[2px] scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507842229456-74898129184b?auto=format&fit=crop&w=2000&q=80')`
        }}
      />

      {/* Warm ambient radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating stream of educational books */}
      {FLOATING_BOOKS.map((book) => {
        return (
          <div
            key={book.id}
            className={`hidden md:block absolute ${book.desktopClass} pointer-events-auto transition-transform duration-700 ease-out`}
            style={{
              animation: `flowingFloat ${book.floatDuration} ease-in-out infinite alternate`,
              animationDelay: book.floatDelay
            }}
          >
            {/* 3D Book perspective wrapper */}
            <div
              className={`w-40 sm:w-44 lg:w-48 aspect-[3/4] rounded-2xl p-4 bg-gradient-to-br ${book.coverBg} border-2 ${book.borderColor} shadow-2xl ${book.rotation} transform transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col justify-between text-center relative group`}
              style={{
                boxShadow: `0 15px 35px -5px rgba(0,0,0,0.4), 0 0 25px -5px ${book.accentColor}33`
              }}
            >
              {/* Spine edge illusion */}
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-white/10 rounded-l-2xl border-r border-black/20" />

              {/* Gold double decorative border */}
              <div className="absolute inset-2 border border-white/20 rounded-xl pointer-events-none" />
              <div className="absolute inset-3 border border-white/10 rounded-lg pointer-events-none" />

              {/* Book Header / Title */}
              <div className="relative z-10 pt-1">
                <h3 className={`font-serif text-sm lg:text-base font-black tracking-tight ${book.textColor || book.foilColor} leading-snug drop-shadow-md`}>
                  {book.title}
                </h3>
              </div>

              {/* Book Center Motif Illustration */}
              <div className="relative z-10 my-auto py-2 group-hover:scale-110 transition-transform duration-300">
                {book.motif}
              </div>

              {/* Book Bottom Subtitle / Ribbon */}
              <div className="relative z-10 pb-1">
                <span className={`text-[10px] font-bold tracking-widest uppercase opacity-80 ${book.textColor || book.foilColor}`}>
                  {book.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating sparkles and particles */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-40">
          <circle cx="15%" cy="30%" r="2" fill="#F59E0B" className="animate-pulse" />
          <circle cx="35%" cy="20%" r="3" fill="#FBBF24" className="animate-pulse" style={{ animationDelay: '1s' }} />
          <circle cx="70%" cy="25%" r="2.5" fill="#FDE047" className="animate-pulse" style={{ animationDelay: '2s' }} />
          <circle cx="85%" cy="45%" r="3" fill="#F59E0B" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
          <circle cx="50%" cy="15%" r="2" fill="#FBBF24" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        </svg>
      </div>

      <style>{`
        @keyframes flowingFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-16px) rotate(2deg);
          }
          100% {
            transform: translateY(12px) rotate(-2deg);
          }
        }
      `}</style>
    </div>
  );
};
