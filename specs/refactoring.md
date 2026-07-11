# Refactoring Spec: Lucid Geometry Codebase

## Goal

Improve maintainability, testability, and readability of the Lucid Geometry codebase by decomposing oversized components, extracting domain types and data, and fixing resource leaks — without changing user-facing behavior.

## Success Criteria

- All existing functionality preserved (manual smoke test: randomize, share link round-trip, material/HDRI switching, LFO animation, fullscreen)
- No new runtime warnings or errors
- Build passes (`pnpm build`)
- Each refactoring is a single, reviewable commit

---

## Tasks

### Task 1: Extract data constants into `src/data/`

**Files affected:** `Canvas.tsx`, `SegmentEditor.tsx`

**Changes:**
- Create `src/data/materials.ts` — move `materialSections` array and `MaterialProperties`, `MaterialSection` interfaces
- Create `src/data/hdris.ts` — move `availableHdris` array and `Hdri` interface
- Create `src/data/defaults.ts` — move `defaultRandomizeConfig` and `RandomizeConfig` type
- Update imports in `Canvas.tsx`, `SegmentEditor.tsx`, `index.tsx`

**Rationale:** These are pure configuration (~330 lines combined) cluttering component files. Extracting them makes components readable at a glance and data editable without touching rendering logic.

---

### Task 2: Consolidate domain types into `src/types/`

**Files affected:** `Canvas.tsx`, `SegmentEditor.tsx`, `path.ts`, `index.tsx`

**Changes:**
- Create `src/types/geometry.ts` with:
  - `Segment` (currently in `Canvas.tsx`)
  - `Hdri` (currently in `SegmentEditor.tsx`)
  - `RandomizeConfig` (currently in `SegmentEditor.tsx`)
  - `MaterialProperties`, `MaterialSection` (currently in `Canvas.tsx`)
- Remove type definitions from component files; re-export from `src/types/index.ts`
- Update all import paths

**Rationale:** `Segment` is a core domain type defined inside a UI component and imported across the codebase. This creates a misleading dependency graph where `path.ts` (a utility) imports from a React component.

---

### Task 3: Extract randomization logic to `src/utils/randomize.ts`

**Files affected:** `index.tsx`

**Changes:**
- Move `generateRandomSegments` function (~80 lines) to `src/utils/randomize.ts`
- Move helper functions (`ensureNonZero`, `ensureNonZeroSpeed`) alongside it
- Export and import in `index.tsx`

**Rationale:** Pure business logic that's independently testable. Removing it from the page component reduces `index.tsx` by ~25%.

---

### Task 4: Extract URL state serialization to `src/utils/url-state.ts`

**Files affected:** `index.tsx`

**Changes:**
- Create `src/utils/url-state.ts` with:
  - `parseConfigFromUrl(): { segments, hdri, material, thickness } | null`
  - `serializeConfigToUrl(state): string`
- Replace inline `getInitialState` URL parsing and `handleShare` encoding logic with calls to these functions

**Rationale:** URL serialization is a distinct concern from UI rendering. Extracting it enables unit testing of encode/decode round-trips and migration logic for old link formats.

---

### Task 5: Decompose `Canvas.tsx` into custom hooks

**Files affected:** `Canvas.tsx`

**Changes:**
- `src/hooks/useThreeScene.ts` — scene, renderer, camera, controls setup/teardown, resize handling. Returns `{ mountRef, sceneRef, cameraRef, controlsRef, rendererRef }`
- `src/hooks/useHdriLoader.ts` — loads HDRI into scene environment/background. Accepts `(scene, hdriPath)`
- `src/hooks/useTubeMesh.ts` — creates/updates tube geometry and material. Accepts segments, thickness, pathResolution. Returns mesh ref
- `src/hooks/useLfoAnimation.ts` — handles the per-frame LFO length modulation logic
- `src/hooks/useFullscreen.ts` — fullscreen toggle, cursor auto-hide. Returns `{ containerRef, isFullscreen, showControls, toggleFullscreen }`
- `Canvas.tsx` becomes a thin composition of these hooks (~60 lines)

**Rationale:** The current 619-line component manages 5+ independent concerns with 10+ refs. Decomposition makes each concern testable and debuggable in isolation.

---

### Task 6: Reduce prop drilling with grouped state

**Files affected:** `index.tsx`, `SegmentEditor.tsx`

**Changes:**
- Define a `DisplayOptions` interface: `{ gentleRotation, hdri, material, thickness }`
- Replace individual props/callbacks with `displayOptions` + `onDisplayOptionsChange`
- Optionally: introduce a `useGeometryState()` hook or context that owns all state, reducing `IndexPage` to pure layout

**Rationale:** `SegmentEditor` currently takes 17 props. Grouping related state reduces the API surface and makes adding new display options trivial.

---

### Task 7: Fix material memory leak

**Files affected:** `Canvas.tsx` (or `useTubeMesh.ts` after Task 5)

**Changes:**
- In the material-switching effect, call `.dispose()` on the previous material before assigning the new one:
  ```ts
  const oldMaterial = tubeMesh.material as THREE.Material;
  tubeMesh.material = newMaterial;
  oldMaterial.dispose();
  ```

**Rationale:** Every material change currently leaks a GPU-allocated `MeshPhysicalMaterial`. Over a session with frequent material switching, this accumulates.

---

### Task 8: Remove dead code

**Files affected:** `Canvas.tsx`, `SegmentEditor.tsx`, `index.tsx`

**Changes:**
- Remove commented-out animate checkbox, path resolution slider, alert block, scratch texture logic
- Remove unused `_pathResolution`, `_onPathResolutionChange`, `_isAnimated`, `_onIsAnimatedChange` destructured props (or wire them up if intended)
- Remove the texture preload `useEffect` in `Canvas.tsx` that loads `scratches.jpg` but never uses it

**Rationale:** Dead code adds cognitive load and misleads future contributors about what's active.

---

## Execution Order

```
Task 1 (data) → Task 2 (types) → Task 3 (randomize) → Task 4 (url-state)
    ↓
Task 5 (Canvas hooks) → Task 7 (material leak fix)
    ↓
Task 6 (prop drilling) → Task 8 (dead code)
```

Tasks 1–4 are independent quick wins (can be done in parallel). Task 5 is the largest structural change. Tasks 7 and 8 are small follow-ups that are easier after the Canvas decomposition.

## Out of Scope

- Adding unit tests (should follow as a separate effort once the code is testable)
- Changing the Three.js rendering approach (e.g., migrating to React Three Fiber declarative style)
- UI/UX changes
- Performance optimization of `generatePathPoints`
