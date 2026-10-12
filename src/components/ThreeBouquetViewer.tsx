import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sun, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { WrapperOption, RibbonOption } from '../types';

interface StemSpec {
  name: string;
  count: number;
  colorHex: string;
  variety?: string;
}

interface ThreeBouquetViewerProps {
  wrapper?: WrapperOption;
  ribbon?: RibbonOption;
  style?: 'round' | 'cascade' | 'korean_petite' | 'grand_fan';
  stems?: StemSpec[];
  autoRotateDefault?: boolean;
  lightingPreset?: 'studio' | 'golden_hour' | 'candlelight';
  className?: string;
  allowUserControls?: boolean;
  cameraDistance?: number;
  transparentBackground?: boolean;
}

export const ThreeBouquetViewer: React.FC<ThreeBouquetViewerProps> = ({
  wrapper = {
    id: 'wrap-blush',
    name: 'Matte Rose Quartz',
    colorHex: '#fecdd3',
    price: 150,
    finish: 'matte',
    accentHex: '#fb7185'
  },
  ribbon = {
    id: 'ribbon-champagne',
    name: 'Champagne Satin Silk',
    colorHex: '#fde68a',
    price: 80,
    material: 'satin'
  },
  style = 'round',
  stems = [
    { name: 'Ecuadorian Crimson Rose', count: 12, colorHex: '#be123c', variety: 'Rose (Rosa)' },
    { name: 'Casablanca White Lily', count: 3, colorHex: '#f1f5f9', variety: 'Lily (Lilium)' },
    { name: 'Baby\'s Breath Cloud', count: 4, colorHex: '#ffffff', variety: 'Gypsophila' }
  ],
  autoRotateDefault = true,
  lightingPreset: initialLighting = 'studio',
  className = 'w-full h-80',
  allowUserControls = true,
  cameraDistance = 7.5,
  transparentBackground = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [lightPreset, setLightPreset] = useState<'studio' | 'golden_hour' | 'candlelight'>(initialLighting);
  const [bloomSpread, setBloomSpread] = useState(1.0);
  const bouquetGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
  } | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: 0 });
  const currentRotationRef = useRef({ x: 0.15, y: 0 });
  const targetZoomRef = useRef(cameraDistance);
  const currentZoomRef = useRef(cameraDistance);
  const pinchDistRef = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, cameraDistance);
    camera.lookAt(0, 0.3, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: transparentBackground,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (!transparentBackground) {
      renderer.setClearColor(0xfcfbf9, 1);
    }
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.7);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef3c7, 0.9);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    lightsRef.current = { keyLight, fillLight, rimLight, ambientLight };

    // 4. Ground subtle shadow plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.3;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 5. Build 3D Bouquet Group
    const bouquetGroup = new THREE.Group();
    bouquetGroupRef.current = bouquetGroup;
    scene.add(bouquetGroup);

    // Build the bouquet meshes
    buildBouquetGeometry(bouquetGroup, wrapper, ribbon, stems, style, bloomSpread);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Auto rotation
      if (autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += delta * 0.45;
      }

      // Smooth damping (lerp)
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.12;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.12;
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.12;

      // Clamp vertical tilt
      currentRotationRef.current.x = Math.max(-0.4, Math.min(0.8, currentRotationRef.current.x));

      bouquetGroup.rotation.x = currentRotationRef.current.x;
      bouquetGroup.rotation.y = currentRotationRef.current.y;

      camera.position.z = currentZoomRef.current;
      camera.lookAt(0, 0.3, 0);

      renderer.render(scene, camera);
    };
    animate();

    // 7. Touch & Mouse Event Handlers
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousPointerPositionRef.current.x;
      const deltaY = e.clientY - previousPointerPositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.009;
      targetRotationRef.current.x += deltaY * 0.007;

      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoomRef.current = Math.max(4.5, Math.min(11, targetZoomRef.current + e.deltaY * 0.005));
    };

    // Touch pinch to zoom
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDistRef.current = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const diff = pinchDistRef.current - dist;
        targetZoomRef.current = Math.max(4.5, Math.min(11, targetZoomRef.current + diff * 0.015));
        pinchDistRef.current = dist;
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      renderer.dispose();
      scene.clear();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [wrapper, ribbon, style, stems, transparentBackground, bloomSpread]);

  // Lighting preset updater
  useEffect(() => {
    if (!lightsRef.current) return;
    const { keyLight, fillLight, rimLight, ambientLight } = lightsRef.current;

    if (lightPreset === 'studio') {
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.85;
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 1.4;
      fillLight.color.setHex(0xe2e8f0);
      fillLight.intensity = 0.7;
      rimLight.color.setHex(0xfef08a);
      rimLight.intensity = 0.8;
    } else if (lightPreset === 'golden_hour') {
      ambientLight.color.setHex(0xfef3c7);
      ambientLight.intensity = 0.7;
      keyLight.color.setHex(0xfb923c);
      keyLight.intensity = 1.8;
      fillLight.color.setHex(0xf472b6);
      fillLight.intensity = 0.6;
      rimLight.color.setHex(0xfde047);
      rimLight.intensity = 1.2;
    } else if (lightPreset === 'candlelight') {
      ambientLight.color.setHex(0x78350f);
      ambientLight.intensity = 0.5;
      keyLight.color.setHex(0xf59e0b);
      keyLight.intensity = 1.6;
      fillLight.color.setHex(0x9a3412);
      fillLight.intensity = 0.5;
      rimLight.color.setHex(0xfacc15);
      rimLight.intensity = 1.0;
    }
  }, [lightPreset]);

  return (
    <div className={`relative overflow-hidden select-none touch-none ${className}`}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Control Affordances */}
      {allowUserControls && (
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          {/* Rotate Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause 360° rotation' : 'Start 360° rotation'}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors shadow-sm backdrop-blur-md ${
              autoRotate
                ? 'bg-rose-600 text-white shadow-rose-200'
                : 'bg-white/90 text-stone-700 hover:bg-white border border-stone-200/80'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Lighting Mode */}
          <button
            type="button"
            onClick={() => {
              const modes: ('studio' | 'golden_hour' | 'candlelight')[] = ['studio', 'golden_hour', 'candlelight'];
              const nextIndex = (modes.indexOf(lightPreset) + 1) % modes.length;
              setLightPreset(modes[nextIndex]);
            }}
            title={`Lighting: ${lightPreset}`}
            className="w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:bg-white border border-stone-200/80 flex items-center justify-center text-xs transition-colors shadow-sm backdrop-blur-md"
          >
            <Sun className={`w-3.5 h-3.5 ${lightPreset === 'golden_hour' ? 'text-amber-500' : lightPreset === 'candlelight' ? 'text-orange-600' : 'text-stone-600'}`} />
          </button>

          {/* Bloom Spread Toggle */}
          <button
            type="button"
            onClick={() => setBloomSpread(prev => (prev >= 1.2 ? 0.8 : prev + 0.2))}
            title="Adjust flower bloom fullness"
            className="w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:bg-white border border-stone-200/80 flex items-center justify-center text-xs transition-colors shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
          </button>
        </div>
      )}

      {/* Subtle Hint Banner */}
      {allowUserControls && (
        <div className="absolute bottom-2 left-3 right-3 pointer-events-none flex items-center justify-between text-[11px] text-stone-500 bg-white/75 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/50">
          <span className="flex items-center gap-1">
            <span>Drag to rotate 360°</span>
            <span aria-hidden="true">·</span>
            <span>Pinch to zoom</span>
          </span>
          <span className="text-stone-400 capitalize font-medium">{lightPreset.replace('_', ' ')}</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Procedural 3D Geometry Generators
// ==========================================

function buildBouquetGeometry(
  parentGroup: THREE.Group,
  wrapper: WrapperOption,
  ribbon: RibbonOption,
  stems: StemSpec[],
  style: 'round' | 'cascade' | 'korean_petite' | 'grand_fan',
  bloomMultiplier: number
) {
  // Clear any previous children
  while (parentGroup.children.length > 0) {
    const obj = parentGroup.children[0];
    parentGroup.remove(obj);
  }

  const stemBundleGroup = new THREE.Group();
  const flowerHeadsGroup = new THREE.Group();
  const wrapperGroup = new THREE.Group();
  const ribbonGroup = new THREE.Group();

  parentGroup.add(wrapperGroup);
  parentGroup.add(stemBundleGroup);
  parentGroup.add(flowerHeadsGroup);
  parentGroup.add(ribbonGroup);

  // 1. Create Stems Bundle below waist
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x2e5a27,
    roughness: 0.8,
    metalness: 0.05
  });

  const totalFlowerStems = stems.reduce((sum, s) => sum + s.count, 0);
  const bundleCount = Math.min(Math.max(totalFlowerStems, 10), 28);

  for (let i = 0; i < bundleCount; i++) {
    const angle = (i / bundleCount) * Math.PI * 2;
    const radius = 0.16 + Math.random() * 0.08;
    const stemGeo = new THREE.CylinderGeometry(0.022, 0.022, 2.2, 6);
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.position.set(
      Math.cos(angle) * radius,
      -1.1 + Math.random() * 0.1,
      Math.sin(angle) * radius
    );
    // slight natural tilt
    stemMesh.rotation.z = (Math.random() - 0.5) * 0.08;
    stemMesh.rotation.x = (Math.random() - 0.5) * 0.08;
    stemMesh.castShadow = true;
    stemBundleGroup.add(stemMesh);
  }

  // 2. Bouquet Wrapper (Cone + Pleats + Folded paper)
  const wrapColor = new THREE.Color(wrapper.colorHex);
  const wrapFinishRoughness = wrapper.finish === 'velvet' ? 0.9 : wrapper.finish === 'pearl' ? 0.35 : wrapper.finish === 'kraft' ? 0.85 : 0.6;
  const wrapFinishMetalness = wrapper.finish === 'pearl' ? 0.25 : 0.02;

  const wrapMat = new THREE.MeshStandardMaterial({
    color: wrapColor,
    roughness: wrapFinishRoughness,
    metalness: wrapFinishMetalness,
    side: THREE.DoubleSide
  });

  // Main conical cone wrap
  const coneHeight = style === 'cascade' ? 3.0 : 2.5;
  const coneTopRadius = style === 'grand_fan' ? 1.7 : style === 'korean_petite' ? 1.25 : 1.5;
  const coneBottomRadius = 0.28;

  const coneGeo = new THREE.CylinderGeometry(coneTopRadius, coneBottomRadius, coneHeight, 28, 4, true);
  const coneMesh = new THREE.Mesh(coneGeo, wrapMat);
  coneMesh.position.y = -0.55;
  coneMesh.castShadow = true;
  coneMesh.receiveShadow = true;
  wrapperGroup.add(coneMesh);

  // Outer paper fold flap (Korean / Artisan style asymmetric flap)
  const flapGeo = new THREE.PlaneGeometry(coneTopRadius * 1.5, 1.8, 8, 4);
  const flapMat = new THREE.MeshStandardMaterial({
    color: wrapColor.clone().offsetHSL(0, -0.05, 0.04),
    roughness: wrapFinishRoughness,
    metalness: wrapFinishMetalness,
    side: THREE.DoubleSide
  });
  const flapMesh = new THREE.Mesh(flapGeo, flapMat);
  flapMesh.position.set(0, -0.2, -coneTopRadius * 0.7);
  flapMesh.rotation.x = 0.35;
  wrapperGroup.add(flapMesh);

  const flapMesh2 = new THREE.Mesh(flapGeo, flapMat);
  flapMesh2.position.set(-0.3, -0.1, -coneTopRadius * 0.6);
  flapMesh2.rotation.y = -0.4;
  flapMesh2.rotation.x = 0.25;
  wrapperGroup.add(flapMesh2);

  // 3. Ribbon & Bow at the waist (position y ≈ -1.1)
  const ribbonColor = new THREE.Color(ribbon.colorHex);
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: ribbonColor,
    roughness: ribbon.material === 'velvet' ? 0.85 : ribbon.material === 'satin' ? 0.25 : 0.5,
    metalness: ribbon.material === 'satin' ? 0.2 : 0.05
  });

  // Waist wrap band
  const bandGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.22, 24);
  const bandMesh = new THREE.Mesh(bandGeo, ribbonMat);
  bandMesh.position.y = -1.15;
  bandMesh.castShadow = true;
  ribbonGroup.add(bandMesh);

  // Bow loops (Torus or curved rings)
  const loopGeo = new THREE.TorusGeometry(0.18, 0.045, 12, 20, Math.PI * 1.7);
  
  const leftLoop = new THREE.Mesh(loopGeo, ribbonMat);
  leftLoop.position.set(-0.16, -1.15, 0.36);
  leftLoop.rotation.set(0.2, 0.4, 0.6);
  ribbonGroup.add(leftLoop);

  const rightLoop = new THREE.Mesh(loopGeo, ribbonMat);
  rightLoop.position.set(0.16, -1.15, 0.36);
  rightLoop.rotation.set(0.2, -0.4, -0.6);
  ribbonGroup.add(rightLoop);

  // Bow Knot center
  const knotGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const knotMesh = new THREE.Mesh(knotGeo, ribbonMat);
  knotMesh.position.set(0, -1.15, 0.38);
  ribbonGroup.add(knotMesh);

  // Draping ribbon tails
  const tailGeo = new THREE.PlaneGeometry(0.12, 0.7, 4, 8);
  const tailMat = new THREE.MeshStandardMaterial({
    color: ribbonColor,
    roughness: 0.3,
    side: THREE.DoubleSide
  });

  const leftTail = new THREE.Mesh(tailGeo, tailMat);
  leftTail.position.set(-0.1, -1.55, 0.36);
  leftTail.rotation.set(0.1, 0, 0.2);
  ribbonGroup.add(leftTail);

  const rightTail = new THREE.Mesh(tailGeo, tailMat);
  rightTail.position.set(0.12, -1.58, 0.35);
  rightTail.rotation.set(0.15, 0, -0.25);
  ribbonGroup.add(rightTail);

  // 4. Procedural Flower Heads Arranged in Golden Angle / Hemispherical dome
  let currentStemIndex = 0;
  const flattenedStems: { name: string; colorHex: string; variety: string }[] = [];

  stems.forEach(stem => {
    const variety = stem.variety || stem.name;
    for (let c = 0; c < stem.count; c++) {
      flattenedStems.push({
        name: stem.name,
        colorHex: stem.colorHex,
        variety
      });
    }
  });

  // Total flowers to render (cap at 45 for smooth 60fps WebGL)
  const countToRender = Math.min(flattenedStems.length, 45);
  const goldenAngle = 137.5 * (Math.PI / 180);

  for (let i = 0; i < countToRender; i++) {
    const item = flattenedStems[i];
    // Golden angle spiral distribution over a dome
    const t = (i + 0.5) / countToRender;
    const phi = Math.acos(1 - 0.75 * t); // Hemisphere elevation
    const theta = i * goldenAngle;

    const baseRadius = (style === 'korean_petite' ? 0.9 : style === 'grand_fan' ? 1.35 : 1.15) * bloomMultiplier;
    const r = baseRadius * Math.sin(phi);

    // Coordinate on dome
    let posX = r * Math.cos(theta);
    let posY = 0.5 + baseRadius * Math.cos(phi) * 0.75;
    let posZ = r * Math.sin(theta);

    if (style === 'cascade' && i % 4 === 0) {
      // Cascading waterfall droop
      posY -= (i / countToRender) * 0.9;
      posZ += 0.25;
    }

    // Create the procedural flower head
    const flowerMesh = createSpecificFlowerHead(item.variety, item.colorHex);
    flowerMesh.position.set(posX, posY, posZ);

    // Direct flower orientation to look outwards from center of dome
    const lookTarget = new THREE.Vector3(posX * 1.5, posY + 0.5, posZ * 1.5);
    flowerMesh.lookAt(lookTarget);

    // Natural random jitter
    flowerMesh.rotation.z += (Math.random() - 0.5) * 0.4;
    flowerMesh.castShadow = true;
    flowerHeadsGroup.add(flowerMesh);

    currentStemIndex++;
  }

  // Add foliage / eucalyptus filler leaves around perimeter
  const fillerCount = Math.min(Math.floor(countToRender * 0.6) + 4, 16);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // eucalyptus silvery green
    roughness: 0.6,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  for (let j = 0; j < fillerCount; j++) {
    const angle = (j / fillerCount) * Math.PI * 2;
    const rimRadius = 1.15 * bloomMultiplier;
    const leafGeo = new THREE.SphereGeometry(0.16, 6, 4);
    leafGeo.scale(1.2, 0.2, 1.8);
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.position.set(
      Math.cos(angle) * rimRadius,
      0.35 + (Math.random() - 0.5) * 0.2,
      Math.sin(angle) * rimRadius
    );
    leafMesh.rotation.set(0.4, angle, 0.3);
    flowerHeadsGroup.add(leafMesh);
  }
}

function createSpecificFlowerHead(varietyName: string, colorHex: string): THREE.Group {
  const flower = new THREE.Group();
  const v = varietyName.toLowerCase();
  const mainColor = new THREE.Color(colorHex);

  if (v.includes('sunflower')) {
    // ---------------- SUNFLOWER ----------------
    // Dark textured seed center
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x3f220f,
      roughness: 0.9,
      metalness: 0.0
    });
    const centerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 18), centerMat);
    centerMesh.rotation.x = Math.PI / 2;
    flower.add(centerMesh);

    // Outer golden petal ring
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.45,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    const petalCount = 18;
    for (let p = 0; p < petalCount; p++) {
      const angle = (p / petalCount) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.065, 0.32, 5);
      petalGeo.scale(1.2, 1.0, 0.4);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.34, Math.sin(angle) * 0.34, -0.02);
      petal.rotation.z = angle - Math.PI / 2;
      petal.rotation.x = 0.15;
      flower.add(petal);
    }
    flower.scale.set(1.15, 1.15, 1.15);
  } else if (v.includes('lily')) {
    // ---------------- LILY ----------------
    // 6 star flared pointed petals
    const petalMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide
    });
    for (let p = 0; p < 6; p++) {
      const angle = (p / 6) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.12, 0.48, 6);
      petalGeo.scale(1.3, 1, 0.35);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.26, Math.sin(angle) * 0.26, 0.1);
      petal.rotation.z = angle - Math.PI / 2;
      petal.rotation.x = 0.35;
      flower.add(petal);
    }
    // Center pistil and yellow stamens
    const stamenMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    for (let s = 0; s < 5; s++) {
      const sAngle = (s / 5) * Math.PI * 2;
      const stamen = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 4), stamenMat);
      stamen.position.set(Math.cos(sAngle) * 0.06, Math.sin(sAngle) * 0.06, 0.14);
      stamen.rotation.x = Math.PI / 2;
      flower.add(stamen);
    }
    flower.scale.set(1.2, 1.2, 1.2);
  } else if (v.includes('tulip')) {
    // ---------------- TULIP ----------------
    const tulipMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: 0.35,
      metalness: 0.05
    });
    // Cupped oval petal layers
    const cup = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), tulipMat);
    cup.scale.set(0.9, 1.3, 0.9);
    flower.add(cup);
  } else if (v.includes('gypsophila') || v.includes('breath')) {
    // ---------------- BABY'S BREATH ----------------
    // Cloud of tiny white pearls
    const tinyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    for (let b = 0; b < 10; b++) {
      const bx = (Math.random() - 0.5) * 0.36;
      const by = (Math.random() - 0.5) * 0.36;
      const bz = (Math.random() - 0.5) * 0.2;
      const tinyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.038, 6, 6), tinyMat);
      tinyMesh.position.set(bx, by, bz);
      flower.add(tinyMesh);
    }
  } else if (v.includes('hydrangea')) {
    // ---------------- HYDRANGEA ----------------
    // Big dome of clustered florets
    const clusterMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.55 });
    for (let h = 0; h < 14; h++) {
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = Math.random() * Math.PI * 2;
      const hMesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), clusterMat);
      hMesh.position.set(0.24 * Math.sin(phi) * Math.cos(theta), 0.24 * Math.sin(phi) * Math.sin(theta), 0.24 * Math.cos(phi));
      flower.add(hMesh);
    }
  } else {
    // ---------------- ROSE / PEONY / CARNATION (DEFAULT ROSE) ----------------
    const roseMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: 0.6,
      metalness: 0.02
    });

    // Center spiraling core bud
    const coreMesh = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 8), roseMat);
    coreMesh.rotation.x = Math.PI / 2;
    flower.add(coreMesh);

    // Inner petal cup
    const innerCup = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.06, 8, 12), roseMat);
    flower.add(innerCup);

    // Outer flaring petals
    const outerPetals = 7;
    for (let r = 0; r < outerPetals; r++) {
      const angle = (r / outerPetals) * Math.PI * 2;
      const pGeo = new THREE.SphereGeometry(0.12, 6, 5);
      pGeo.scale(1.1, 0.4, 1.3);
      const petal = new THREE.Mesh(pGeo, roseMat);
      petal.position.set(Math.cos(angle) * 0.16, Math.sin(angle) * 0.16, -0.04);
      petal.rotation.z = angle;
      petal.rotation.x = 0.4;
      flower.add(petal);
    }
  }

  // Green Sepal underneath
  const sepalMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 });
  const sepal = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.18, 5), sepalMat);
  sepal.position.z = -0.16;
  sepal.rotation.x = -Math.PI / 2;
  flower.add(sepal);

  return flower;
}
