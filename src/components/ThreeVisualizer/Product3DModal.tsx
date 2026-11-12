import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Product, MaterialFinish } from '../../types';
import { buildProceduralModel, BuiltModel } from './ModelBuilder';
import { 
  X, 
  Layers, 
  RotateCcw, 
  Eye, 
  Box, 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  Compass, 
  Cpu, 
  Play, 
  Pause,
  Ruler,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';

interface Product3DModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, material: MaterialFinish, quantity: number, customNotes?: string) => void;
}

export const Product3DModal: React.FC<Product3DModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFinish>(product.defaultMaterial);
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [sliceProgress, setSliceProgress] = useState<number>(1.0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isSlicingPlaying, setIsSlicingPlaying] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explode' | 'materials' | 'slicer' | 'specs' | 'customPhoto'>('explode');
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [customEngravingText, setCustomEngravingText] = useState<string>('');

  const modelRef = useRef<BuiltModel | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isPhotoProduct = product.category === 'photo_to_3d';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.08);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.4, 2.2, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
      preserveDrawingBuffer: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 0, 0);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x0f172a, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xa855f7, 2.5, 8);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(12, 24, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -1.2;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.19;
    scene.add(shadowMesh);

    const built = buildProceduralModel(product.model3dPreset, selectedMaterial);
    modelRef.current = built;
    scene.add(built.group);

    const clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (controlsRef.current) {
        if (isAutoRotate) {
          built.group.rotation.y += delta * 0.4;
        }
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      built.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [product.model3dPreset]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setMaterialFinish(selectedMaterial);
    }
  }, [selectedMaterial]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.updateExplode(explodeFactor);
    }
  }, [explodeFactor]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setWireframe(isWireframe);
    }
  }, [isWireframe]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setSliceProgress(sliceProgress);
    }
  }, [sliceProgress]);

  useEffect(() => {
    if (!isSlicingPlaying) return;

    const interval = setInterval(() => {
      setSliceProgress((prev) => {
        if (prev >= 1.0) {
          return 0.05;
        }
        return Math.min(1.0, prev + 0.035);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isSlicingPlaying]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setExplodeFactor(0);
    setSliceProgress(1.0);
    if (modelRef.current) {
      modelRef.current.group.rotation.set(0, 0, 0);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedMaterial, quantity, customEngravingText);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleDirectWhatsApp = () => {
    const message = `Hello LayerLab 3D! I'm interested in ordering the 3D product: "${product.name}" in ${selectedMaterial} finish (Quantity: ${quantity}). Please share delivery timeline for my pincode.`;
    window.open(`https://wa.me/919845012894?text=${encodeURIComponent(message)}`, '_blank');
  };

  const materialNames: Record<MaterialFinish, { label: string; desc: string; color: string }> = {
    vibrant_gloss: { label: 'Vibrant Anime Gloss', desc: 'Vivid colors, drop-tested tough resin', color: '#f59e0b' },
    gold_bronze: { label: 'Antique Temple Gold', desc: 'Rich electro-metallic finish for idols & logos', color: '#d4af37' },
    tough_resin: { label: 'Translucent 3D Resin', desc: 'Optical transmission for lamps & lithophanes', color: '#38bdf8' },
    carbon_fiber: { label: 'Matte Carbon Fiber', desc: 'High-strength PETG-CF for bikes, cars & jigs', color: '#181a1d' },
    titanium: { label: 'Aerospace Titanium', desc: 'Ultra-durable sleek metallic finish', color: '#94a3b8' },
  };

  const displayPrice = product.salePrice || product.basePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950">
        
        {/* Three.js Canvas Container */}
        <div 
          ref={mountRef} 
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" 
        />

        {/* Top Minimal Spec Bar */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-mono font-bold text-sm">
              3D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">
                  3D Interactive CAD Studio · Made in India
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {product.availability === 'in_stock' ? 'IN STOCK · PAN-INDIA DISPATCH' : 'CUSTOM 3D CRAFTED'}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {product.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">Price (Incl. GST)</span>
              <span className="text-base font-bold text-cyan-400 font-mono">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close 3D viewer"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Floating Quick Action Overlay Top Left: Dimensions HUD */}
        <div className="absolute top-20 left-6 z-10 hidden md:flex flex-col gap-2 pointer-events-none">
          <div className="px-3 py-2 rounded-xl bg-slate-950/75 border border-cyan-500/20 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
            <Ruler size={14} className="text-cyan-400" />
            <span>Size: <strong className="text-white">{product.dimensions}</strong></span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-950/75 border border-purple-500/20 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
            <Cpu size={14} className="text-purple-400" />
            <span>Layer Pitch: <strong className="text-cyan-300">0.05 mm (50μm)</strong></span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-950/75 border border-emerald-500/20 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-2">
            <Box size={14} className="text-emerald-400" />
            <span>Weight: <strong className="text-white">{product.weightGrams}g</strong></span>
          </div>
        </div>

        {/* Right Corner Quick Controls */}
        <div className="absolute top-20 right-6 z-10 flex flex-col gap-2">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title="Toggle Auto 360° Rotation"
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
              isAutoRotate 
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Compass size={18} />
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            title="Toggle 3D Mesh Wireframe"
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
              isWireframe 
                ? 'bg-purple-500/20 border-purple-400/50 text-purple-300' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={18} />
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Camera Angle"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Toast alert on Add to Cart */}
        {addedToast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-xl bg-emerald-500/90 text-white font-medium text-sm flex items-center gap-2.5 shadow-2xl shadow-emerald-500/30 border border-emerald-400 animate-in fade-in slide-in-from-top-4 font-mono">
            <Check size={18} className="stroke-[3]" />
            <span>Added <strong>{product.name}</strong> to Cart!</span>
          </div>
        )}

        <div className="flex-1 pointer-events-none" />

        {/* Collapsible Bottom Control Dock */}
        <div className="relative z-20 flex flex-col items-center w-full px-4 pb-4">
          
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="mb-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp size={14} className="text-cyan-400" />
                <span>Show 3D Product Controls</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} className="text-cyan-400" />
                <span>Hide Controls (Full 3D View)</span>
              </>
            )}
          </button>

          {!isDockCollapsed && (
            <div className="w-full max-w-4xl bg-slate-950/92 border border-cyan-900/40 rounded-2xl p-4 shadow-2xl shadow-black/80 backdrop-blur-xl">
              
              {/* Dock Tabs Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 mb-3 gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setActiveTab('explode')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'explode'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers size={14} />
                    <span>Go Inside (Explode 3D)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'materials'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>Materials</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('slicer')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'slicer'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Cpu size={14} />
                    <span>3D Slicer Toolpath</span>
                  </button>

                  {isPhotoProduct && (
                    <button
                      onClick={() => setActiveTab('customPhoto')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'customPhoto'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ImageIcon size={14} />
                      <span>Photo to 3D Preview</span>
                    </button>
                  )}
                </div>

                {/* Direct Actions: WhatsApp & Add to Cart */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDirectWhatsApp}
                    className="px-3 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Order / Custom Inquiry via WhatsApp"
                  >
                    <MessageSquare size={13} />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900/60 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-1 text-xs font-mono text-white min-w-8 text-center font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-mono"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                  >
                    <ShoppingCart size={14} />
                    <span>Add to Cart (₹{(displayPrice * quantity).toLocaleString('en-IN')})</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Exploded View Slider */}
              {activeTab === 'explode' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Layers size={14} className="text-cyan-400" />
                      <span>Separate 3D Layers &amp; Internal Parts:</span>
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {Math.round(explodeFactor * 100)}% Disassembled
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={explodeFactor}
                      onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <button
                      onClick={() => setExplodeFactor(explodeFactor === 0 ? 0.85 : 0)}
                      className="px-3 py-1 text-[11px] font-mono rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white whitespace-nowrap"
                    >
                      {explodeFactor === 0 ? 'Explode 3D' : 'Assemble'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Drag the slider to examine inside the 3D model: key-ring anchors, internal infill lattices, pedestals, and precision joints.
                  </p>
                </div>
              )}

              {/* Tab 2: Materials Selector */}
              {activeTab === 'materials' && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono text-slate-300">
                    Select 3D Material &amp; Surface Finish:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {product.availableMaterials.map((mat) => {
                      const info = materialNames[mat] || { label: mat, desc: '', color: '#38bdf8' };
                      const isSelected = selectedMaterial === mat;
                      return (
                        <button
                          key={mat}
                          onClick={() => setSelectedMaterial(mat)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-950/50'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/30" 
                              style={{ backgroundColor: info.color }}
                            />
                            {isSelected && <Check size={12} className="text-cyan-400" />}
                          </div>
                          <span className="text-xs font-bold leading-tight line-clamp-1">{info.label}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{info.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Slicer Toolpath Simulation */}
              {activeTab === 'slicer' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Cpu size={14} className="text-purple-400" />
                      <span>3D Print Nozzle Toolpath Simulator:</span>
                    </span>
                    <span className="text-purple-400 font-bold">
                      Layer {Math.round(sliceProgress * 380)} / 380 ({Math.round(sliceProgress * 100)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsSlicingPlaying(!isSlicingPlaying)}
                      className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
                        isSlicingPlaying 
                          ? 'bg-purple-600 text-white border-purple-400' 
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {isSlicingPlaying ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isSlicingPlaying ? 'Pause Slicer' : 'Simulate 3D Print'}</span>
                    </button>
                    <input
                      type="range"
                      min={0.05}
                      max={1.0}
                      step={0.01}
                      value={sliceProgress}
                      onChange={(e) => {
                        setIsSlicingPlaying(false);
                        setSliceProgress(parseFloat(e.target.value));
                      }}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                    <button
                      onClick={() => {
                        setIsSlicingPlaying(false);
                        setSliceProgress(1.0);
                      }}
                      className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                    >
                      Complete
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Observe how our Bambu Lab &amp; Formlabs 3D systems deposit layer-by-layer to form the dense solid infill.
                  </p>
                </div>
              )}

              {/* Tab 4: Photo to 3D Customizer */}
              {activeTab === 'customPhoto' && (
                <div className="flex flex-col gap-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-pink-300 font-bold">
                    <span>Personalize Your 3D Lithophane Light Lamp:</span>
                    <span className="text-[11px] text-slate-400">Send photo on WhatsApp or checkout</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Custom Name / Date Engraving on Base:</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul &amp; Priya · 14 Feb 2025"
                        value={customEngravingText}
                        onChange={(e) => setCustomEngravingText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-300">Photo Transmission:</span>
                      <button
                        onClick={handleDirectWhatsApp}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare size={12} />
                        <span>Share on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
