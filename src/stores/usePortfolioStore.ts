import { create } from 'zustand';
import type { Project } from '@/types';

/**
 * TV Screen States:
 * 1. 'welcome' - Default, shows welcome/instruction for new users
 * 2. 'project' - Shows selected project info with "View Details" button
 * 3. 'youtube' - Shows lofi YouTube stream after closing modal
 */
type TVState = 'welcome' | 'project' | 'youtube';

interface PortfolioState {
  // UI State
  activeIsland: string | null;
  hoveredIsland: string | null;
  isModalOpen: boolean;
  selectedProject: Project | null;
  isLoading: boolean;
  
  // TV State
  tvState: TVState;
  hasViewedProject: boolean; // Track if user has ever viewed a project
  
  // Camera State
  cameraPosition: 'overview' | 'focused';
  targetIsland: string | null;
  
  // Actions
  setHoveredIsland: (id: string | null) => void;
  selectIsland: (id: string, project: Project) => void;
  openModal: () => void;
  closeModal: () => void;
  resetCamera: () => void;
  setLoading: (loading: boolean) => void;
  clearProject: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Initial state
  activeIsland: null,
  hoveredIsland: null,
  isModalOpen: false,
  selectedProject: null,
  isLoading: true,
  cameraPosition: 'overview',
  targetIsland: null,
  
  // TV State
  tvState: 'welcome',
  hasViewedProject: false,
  
  // Actions
  setHoveredIsland: (id) => set({ hoveredIsland: id }),
  
  // Select island - now just shows project on TV, doesn't open modal
  selectIsland: (id, project) => set({
    activeIsland: id,
    selectedProject: project,
    tvState: 'project',
    // Camera stays at overview, doesn't move to island
  }),
  
  // Open modal for detailed view
  openModal: () => set({
    isModalOpen: true,
    hasViewedProject: true,
  }),
  
  // Close modal - switch to YouTube if user has viewed a project
  closeModal: () => {
    const { hasViewedProject } = get();
    set({
      isModalOpen: false,
      tvState: hasViewedProject ? 'youtube' : 'welcome',
    });
  },
  
  // Clear selected project and go back to welcome/youtube
  clearProject: () => {
    const { hasViewedProject } = get();
    set({
      activeIsland: null,
      selectedProject: null,
      tvState: hasViewedProject ? 'youtube' : 'welcome',
    });
  },
  
  resetCamera: () => set({
    activeIsland: null,
    cameraPosition: 'overview',
    targetIsland: null,
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));
