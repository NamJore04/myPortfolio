import { Navigation } from '@/components/ui/Navigation';
import { SceneWrapper } from '@/components/SceneWrapper';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { SkipLink, SceneInstructions } from '@/components/ui/Accessibility';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0f172a]">
      {/* Accessibility: Skip to main content link */}
      <SkipLink />
      
      {/* Navigation - Fixed on top */}
      <Navigation />
      
      {/* Main content region */}
      <div id="main-content" tabIndex={-1} className="outline-none h-full">
        {/* 3D Scene */}
        <SceneWrapper />
        
        {/* Screen reader instructions for 3D scene */}
        <SceneInstructions />
      </div>
      
      {/* Project Detail Modal */}
      <ProjectModal />
    </main>
  );
}
