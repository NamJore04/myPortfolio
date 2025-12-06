# Project Rules: The Digital Nexus Garden

> **Version:** 1.0  
> **Last Updated:** December 4, 2025  
> **Status:** Active

Tài liệu này định nghĩa các quy tắc và guidelines cho dự án. Mọi code và design decision PHẢI tuân thủ các rules này.

---

## 1. DESIGN RULES

### 1.1. Visual Style

#### DO
- Sử dụng phong cách **Toon Shading / Cel Shading**
- Giữ không gian **sáng, tươi mới** (Light, Fresh)
- Sử dụng **gradients** thay vì solid blocks cho backgrounds
- Tạo **depth** bằng glow effects và shadows nhẹ
- Giữ **whitespace** để tránh visual clutter

#### DON'T
- Không sử dụng phong cách Cyberpunk tối tăm
- Không dùng quá nhiều neon gây chói mắt
- Không làm UI quá phức tạp, rối rắm

### 1.2. Icon Usage (QUAN TRỌNG)

```
⚠️ RULE: HẠN CHẾ SỬ DỤNG ICON
```

#### Nguyên tắc
- **Prefer text labels over icons** trong navigation và buttons
- Icons chỉ được dùng khi **THỰC SỰ CẦN THIẾT** và **TĂNG CLARITY**
- Mỗi icon phải có **purpose rõ ràng**, không dùng để trang trí

#### Được phép dùng icons
| Context | Example | Reason |
|---------|---------|--------|
| Social links | GitHub, LinkedIn | Universal recognition |
| Tech stack badges | Python, React logos | Brand identity |
| Status indicators | Loading spinner | Functional purpose |
| Close/Back buttons | X, Arrow | Standard patterns |

#### KHÔNG dùng icons
| Context | Alternative |
|---------|-------------|
| Navigation menu | Text labels ("Home", "Projects") |
| Section headers | Typography hierarchy |
| Decorative purposes | Geometric shapes, subtle patterns |
| Bullet points | Dashes, numbers, or styled lists |

#### Code Example
```tsx
// DO: Text-based navigation
<nav>
  <a href="/">Home</a>
  <a href="/projects">Projects</a>
  <a href="/skills">Skills</a>
  <a href="/contact">Contact</a>
</nav>

// DON'T: Icon-heavy navigation
<nav>
  <a href="/"><HomeIcon /> Home</a>
  <a href="/projects"><FolderIcon /> Projects</a>
</nav>
```

### 1.3. Color Usage

```typescript
// Primary Colors - Use these most
const COLORS = {
  cyan: '#00D4FF',      // Technology, Primary accent
  purple: '#A855F7',    // Data, AI, Secondary accent
  white: '#F8FAFC',     // Clean, Text on dark

  // Background (Deep, not pure black)
  bgDeep: '#0F172A',    // Main background
  bgGrid: '#1E3A5F',    // Grid lines

  // Semantic
  success: '#34D399',   // Green
  warning: '#FB923C',   // Orange
  error: '#F87171',     // Red
};
```

### 1.4. Typography

```css
/* Font Stack */
--font-display: 'Orbitron', sans-serif;  /* Headers, Hero */
--font-body: 'Inter', sans-serif;        /* Body text */
--font-mono: 'JetBrains Mono', monospace; /* Code, Tech */

/* Size Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

---

## 2. CODE RULES

### 2.1. TypeScript Standards

```typescript
// ALWAYS use strict types
// tsconfig: "strict": true

// DO: Explicit types for props
interface IslandProps {
  id: string;
  position: [number, number, number];
  onHover: (id: string | null) => void;
}

// DON'T: any type
const handleClick = (data: any) => { ... } // BAD

// DO: Proper null handling
const project = projects.find(p => p.id === id);
if (!project) return null;
```

### 2.2. Component Patterns

```typescript
// RULE: Prefer named exports
export const Island: FC<IslandProps> = ({ id, position }) => { ... };

// RULE: Separate logic into custom hooks
// DON'T: Heavy logic in component
const Island = () => {
  const [hovered, setHovered] = useState(false);
  // ... 50 lines of logic
};

// DO: Extract to hook
const Island = () => {
  const { isHovered, handlers } = useIslandInteraction(id);
  // ... clean render logic
};
```

### 2.3. R3F Specific Rules

```typescript
// RULE: Always clean up resources
useEffect(() => {
  return () => {
    geometry?.dispose();
    material?.dispose();
    texture?.dispose();
  };
}, []);

// RULE: Use refs for mutable objects
const meshRef = useRef<Mesh>(null);
useFrame(() => {
  if (meshRef.current) {
    meshRef.current.rotation.y += 0.01;
  }
});

// RULE: Memoize heavy computations
const geometry = useMemo(() => {
  return new BoxGeometry(1, 1, 1);
}, []);
```

### 2.4. State Management

```typescript
// RULE: Zustand for global state
// Keep stores focused and small

// DO: Single responsibility stores
const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  toggleModal: () => set((s) => ({ isModalOpen: !s.isModalOpen })),
}));

const useCameraStore = create<CameraState>((set) => ({
  position: 'overview',
  setPosition: (pos) => set({ position: pos }),
}));

// DON'T: God store with everything
const useStore = create((set) => ({
  // 100 properties...
}));
```

### 2.5. Animation Rules

```typescript
// RULE: GSAP for complex timelines
const timeline = gsap.timeline();
timeline
  .to(element, { opacity: 1, duration: 0.5 })
  .to(element, { y: 0, duration: 0.3 }, "-=0.2");

// RULE: React Spring for 3D physics
const { scale } = useSpring({
  scale: hovered ? 1.1 : 1,
  config: { mass: 1, tension: 280, friction: 60 }
});

// RULE: useFrame for per-frame updates
useFrame((state, delta) => {
  // Use delta for frame-independent animation
  ref.current.rotation.y += delta * 0.5;
});
```

---

## 3. FILE STRUCTURE RULES

### 3.1. Folder Organization

```
src/
├── app/                 # Next.js App Router (pages only)
├── components/
│   ├── 3d/             # Three.js components
│   │   ├── islands/    # Island components
│   │   ├── effects/    # Visual effects
│   │   └── models/     # 3D models
│   └── ui/             # 2D UI components
├── hooks/              # Custom hooks
├── stores/             # Zustand stores
├── data/               # Static data
├── lib/                # Utilities
├── types/              # TypeScript types
└── styles/             # Global styles
```

### 3.2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Island.tsx`, `DataStream.tsx` |
| Hooks | camelCase with 'use' | `useIslandHover.ts` |
| Stores | camelCase with 'use' | `usePortfolioStore.ts` |
| Utils | kebab-case | `three-helpers.ts` |
| Types | PascalCase | `Island.types.ts` |
| Data | camelCase | `projects.ts` |
| CSS Modules | PascalCase | `Island.module.css` |

### 3.3. Import Order

```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

// 3. Internal imports (absolute)
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { Island } from '@/components/3d/islands/Island';

// 4. Types
import type { Project } from '@/types';

// 5. Relative imports (same folder)
import { useLocalHook } from './useLocalHook';
```

---

## 4. PERFORMANCE RULES

### 4.1. Bundle Size

```typescript
// RULE: Dynamic imports for heavy components
const AIIsland = dynamic(() => import('./islands/AIIsland'), {
  loading: () => <IslandPlaceholder />,
  ssr: false // 3D components don't need SSR
});

// RULE: Tree-shake imports
// DO
import { Html, Float } from '@react-three/drei';

// DON'T
import * as Drei from '@react-three/drei';
```

### 4.2. 3D Performance

```typescript
// RULE: Use Instances for repeated geometry
<Instances limit={1000}>
  <sphereGeometry args={[0.1, 8, 8]} />
  <meshToonMaterial />
  {particles.map((p, i) => <Instance key={i} position={p} />)}
</Instances>

// RULE: Limit draw calls
// Merge static geometries when possible
// Use BufferGeometry over Geometry

// RULE: Frustum culling (default in R3F)
// Objects outside camera view won't render

// RULE: Level of Detail
<LOD distances={[0, 50, 100]}>
  <HighDetailMesh />
  <MediumDetailMesh />
  <LowDetailMesh />
</LOD>
```

### 4.3. Memory Management

```typescript
// RULE: Dispose unused resources
useEffect(() => {
  const texture = new TextureLoader().load(url);
  return () => texture.dispose();
}, [url]);

// RULE: Limit texture sizes
// - Detail textures: 512x512 max
// - Background: 1024x1024 max
// - Icons: 128x128

// RULE: Use compressed formats
// - Models: .glb with Draco compression
// - Images: .webp with fallback to .png
```

---

## 5. ACCESSIBILITY RULES

### 5.1. Keyboard Navigation

```typescript
// RULE: All interactive elements must be keyboard accessible
<button 
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  role="button"
  aria-label="View AI Trading Bot project"
>
  ...
</button>
```

### 5.2. Screen Reader Support

```typescript
// RULE: Provide text alternatives for 3D content
<Html>
  <div role="img" aria-label="3D visualization of AI Trading Bot project featuring neural network nodes and cryptocurrency charts">
    {/* Visual content */}
  </div>
</Html>
```

### 5.3. Reduced Motion

```typescript
// RULE: Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

useFrame(() => {
  if (prefersReducedMotion) return;
  // Animation logic
});
```

---

## 6. COMMIT RULES

### 6.1. Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 6.2. Types

| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting, no code change |
| refactor | Code restructuring |
| perf | Performance improvement |
| test | Adding tests |
| chore | Maintenance |

### 6.3. Examples

```bash
feat(island): add AI Trading Bot island with neural network visualization

- Implemented NeuralNetwork component with animated nodes
- Added candlestick chart with real-time animation
- Connected island to hover/click interactions

Closes #12
```

---

## 7. REVIEW CHECKLIST

Trước khi commit, check các items sau:

### Code Quality
- [ ] TypeScript không có errors
- [ ] ESLint pass
- [ ] Không có console.log (except development)
- [ ] Không có any types
- [ ] Proper error handling

### Performance
- [ ] Không có memory leaks (dispose resources)
- [ ] Heavy computations memoized
- [ ] Dynamic imports cho heavy components
- [ ] 60fps trên Chrome DevTools

### Design
- [ ] Tuân thủ color palette
- [ ] Icons chỉ dùng khi cần thiết
- [ ] Typography đúng scale
- [ ] Responsive hoạt động

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast đạt WCAG AA

---

## 8. EXCEPTIONS

Khi cần break một rule, phải:

1. Document lý do trong code comment
2. Tạo tech debt issue nếu cần fix sau
3. Get approval từ team (nếu có)

```typescript
// EXCEPTION: Using any type here because Three.js types are incomplete
// TODO: Create proper type definition
// Issue: #XX
const customMaterial: any = new ShaderMaterial({ ... });
```

---

*Rules này là living document. Propose changes qua PR với clear rationale.*
