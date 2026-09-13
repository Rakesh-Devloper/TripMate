import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

/**
 * Fast, smoothly animated Dark Mode Toggle component.
 * Features immediate responsiveness with snappy micro-animations.
 */
export const ThemeToggle = ({
  size = 'md',
  variant = 'icon',
  className = '',
  showLabel = false,
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 15,
    md: 17,
    lg: 19,
  };

  const currentIconSize = iconSizes[size] || 17;

  if (variant === 'pill') {
    return (
      <button
        type="button"
        id="theme-toggle-pill-btn"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-slate-100/90 dark:bg-[#111C2E] hover:bg-slate-200/80 dark:hover:bg-[#16243C] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer select-none ${className}`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isDarkMode ? (
              <motion.div
                key="dark-icon"
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <Moon size={15} className="text-purple-400 fill-purple-400/20" />
              </motion.div>
            ) : (
              <motion.div
                key="light-icon"
                initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <Sun size={15} className="text-amber-500 fill-amber-500/20" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span>{isDarkMode ? 'Dark' : 'Light'}</span>
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.12 }}
      className={`relative rounded-full bg-white dark:bg-[#111C2E] border border-slate-200/90 dark:border-slate-700/90 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:border-purple-300 dark:hover:border-purple-500/60 shadow-xs hover:shadow-md transition-colors cursor-pointer select-none overflow-hidden ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {/* Background glow when in dark mode */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-150 pointer-events-none ${
          isDarkMode
            ? 'opacity-100 bg-gradient-to-tr from-purple-500/10 to-indigo-500/20'
            : 'opacity-0 bg-transparent'
        }`}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center relative z-10"
          >
            <Moon
              size={currentIconSize}
              className="text-purple-400 fill-purple-400/20"
              strokeWidth={2.2}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -60, scale: 0.6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center relative z-10"
          >
            <Sun
              size={currentIconSize}
              className="text-amber-500 fill-amber-500/20"
              strokeWidth={2.2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="sr-only">
          {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
        </span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
