'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

/**
 * ProjectModal - Displays detailed project information
 * Text-based design following project-rules.md (limited icons)
 * Accessibility: Focus trap, ARIA attributes, keyboard navigation
 */
export const ProjectModal = () => {
  const { isModalOpen, selectedProject, closeModal } = usePortfolioStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  // Focus trap logic
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, []);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab') {
        handleTabKey(e);
      }
    };
    
    if (isModalOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus close button after animation
      setTimeout(() => closeButtonRef.current?.focus(), 100);
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        
        // Restore focus
        if (previousActiveElement.current instanceof HTMLElement) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isModalOpen, closeModal, handleTabKey]);
  
  return (
    <AnimatePresence>
      {isModalOpen && selectedProject && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-white mb-1">
                    {selectedProject.title}
                  </h2>
                  <p className="text-cyan-400 text-sm">
                    {selectedProject.subtitle}
                  </p>
                </div>
                
                {/* Close button - Text, not icon */}
                <button
                  ref={closeButtonRef}
                  onClick={closeModal}
                  aria-label="Close project details"
                  className="text-gray-400 hover:text-white focus:text-white transition-colors text-sm px-3 py-1 border border-gray-700 rounded-lg hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                >
                  Close
                </button>
              </div>
              
              {/* Meta info */}
              <div id="modal-description" className="flex gap-6 text-sm text-gray-400 mb-6">
                <span>{selectedProject.timeline}</span>
                <span className="text-gray-600" aria-hidden="true">|</span>
                <span>{selectedProject.role}</span>
              </div>
              
              {/* Description */}
              <p className="text-gray-300 leading-relaxed mb-6">
                {selectedProject.description}
              </p>
              
              {/* Highlights */}
              <div className="mb-6" role="region" aria-label="Key metrics">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Key Metrics
                </h3>
                <div className="flex flex-wrap gap-4">
                  {selectedProject.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="bg-[#1e293b] px-4 py-3 rounded-lg border border-gray-700/50"
                    >
                      <div className="text-xl font-bold text-cyan-400" aria-label={`${highlight.description}: ${highlight.metric}`}>
                        {highlight.metric}
                      </div>
                      <div className="text-xs text-gray-400">
                        {highlight.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tech Stack */}
              <div className="mb-6" role="region" aria-label="Technologies used">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Technologies
                </h3>
                <ul className="flex flex-wrap gap-2" aria-label="Technology stack">
                  {selectedProject.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="px-3 py-1 text-sm bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Links */}
              {selectedProject.github && (
                <div className="pt-4 border-t border-gray-700">
                  <a
                    href={`https://${selectedProject.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 transition-colors text-sm focus:outline-none focus:underline"
                    aria-label={`View ${selectedProject.title} on GitHub (opens in new tab)`}
                  >
                    View on GitHub →
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
