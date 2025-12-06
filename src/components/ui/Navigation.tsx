'use client';

import { useState } from 'react';

/**
 * Navigation Component
 * Text-based navigation following project-rules.md (no icons in nav)
 * Accessibility: ARIA labels, keyboard navigation, focus states
 */
export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'Home', href: '#home', ariaLabel: 'Go to home section' },
    { label: 'Projects', href: '#projects', ariaLabel: 'View projects' },
    { label: 'Skills', href: '#skills', ariaLabel: 'View skills' },
    { label: 'Contact', href: '#contact', ariaLabel: 'Contact information' },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <a 
          href="#home" 
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0f172a] rounded-lg"
          aria-label="The Digital Nexus Garden - Home"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg" aria-hidden="true" />
          <span className="text-white font-bold tracking-wider text-sm uppercase">
            The Digital Nexus Garden
          </span>
        </a>

        {/* Navigation Links - Text only, no icons */}
        <ul className="hidden md:flex items-center gap-8" role="menubar">
          {navItems.map((item) => (
            <li key={item.label} role="none">
              <a
                href={item.href}
                role="menuitem"
                aria-label={item.ariaLabel}
                className="text-gray-300 hover:text-cyan-400 focus:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide focus:outline-none focus:underline focus:underline-offset-4"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button - Simple lines, not hamburger icon */}
        <button 
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} aria-hidden="true" />
          <span className={`w-6 h-0.5 bg-white transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} aria-hidden="true" />
          <span className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} aria-hidden="true" />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-[#0f172a]/95 backdrop-blur-sm border-t border-gray-800"
          role="menu"
        >
          <ul className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <li key={item.label} role="none">
                <a
                  href={item.href}
                  role="menuitem"
                  aria-label={item.ariaLabel}
                  className="block py-3 px-4 text-gray-300 hover:text-cyan-400 focus:text-cyan-400 focus:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
