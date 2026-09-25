import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
        isDark
          ? 'bg-[#18313a] text-amber-300 border-[#264855] hover:bg-[#203f4a] hover:border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
          : 'bg-white text-navy-800 border-cream-200 hover:bg-cream-100 hover:border-cream-300 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-300 transition-transform duration-300 transform rotate-0 scale-100" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 transform rotate-0 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold capitalize">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
