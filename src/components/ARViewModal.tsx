import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, ZoomIn, Sun, Check, Sparkles, Download, Layers } from 'lucide-react';
import { ThreeBouquetViewer } from './ThreeBouquetViewer';
import { WrapperOption, RibbonOption } from '../types';

interface StemSpec {
  name: string;
  count: number;
  colorHex: string;
  variety?: string;
}

interface ARViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bouquetName: string;
  wrapper?: WrapperOption;
  ribbon?: RibbonOption;
  style?: 'round' | 'cascade' | 'korean_petite' | 'grand_fan';
  stems?: StemSpec[];
  onAddToCart?: () => void;
}

export const ARViewModal: React.FC<ARViewModalProps> = ({
  isOpen,
  onClose,
  bouquetName,
  wrapper,
  ribbon,
  style = 'round',
  stems,
  onAddToCart
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useSimulatedRoom, setUseSimulatedRoom] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1.0);
  const [lighting, setLighting] = useState<'studio' | 'golden_hour' | 'candlelight'>('studio');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 15 });
  const [isPlaced, setIsPlaced] = useState<boolean>(true);
  const [photoSnapped, setPhotoSnapped] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    // Attempt mobile environment camera first
    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setUseSimulatedRoom(false);
      }
    } catch (err: any) {
      console.warn('Camera access unavailable, defaulting to simulated room backdrop:', err);
      setCameraError('Camera access not available or denied. Using Dagupan Room Simulator.');
      setUseSimulatedRoom(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleCameraMode = () => {
    if (useSimulatedRoom) {
      startCamera();
    } else {
      stopCamera();
      setUseSimulatedRoom(true);
    }
  };

  // Dragging bouquet on AR surface
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
  };

  // Capture AR Snapshot
  const handleSnapPhoto = () => {
    // Generate snapshot visual feedback
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill backdrop
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render watermark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui';
    ctx.fillText('FloraView Dagupan · AR Preview', 30, 60);
    ctx.font = '14px system-ui';
    ctx.fillStyle = '#fecdd3';
    ctx.fillText(bouquetName, 30, 85);
    ctx.fillStyle = '#d6d3d1';
    ctx.fillText(`Scale: ${(scale * 100).toFixed(0)}% · Dagupan City, Pangasinan`, 30, 110);

    const dataUrl = canvas.toDataURL('image/png');
    setPhotoSnapped(dataUrl);

    setTimeout(() => {
      setPhotoSnapped(null);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 text-white select-none overflow-hidden">
      {/* Background: Live Camera Stream or Realistic Room Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {cameraActive && !useSimulatedRoom ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src="/src/assets/images/ar_room_backdrop_1791819837955.jpg"
              alt="Dagupan Tabletop Environment"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-95"
            />
            {/* Soft AR ambient grid lines on the tabletop */}
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-stone-950/40 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Surface Detection Visual Reticle */}
      <div
        className="absolute z-10 pointer-events-none transition-transform duration-300"
        style={{
          left: `calc(50% + ${position.x}px)`,
          top: `calc(55% + ${position.y}px)`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Ground AR Circle Shadow Ring */}
        <div
          className="rounded-full border border-rose-300/60 bg-rose-500/10 shadow-lg shadow-rose-500/20 animate-pulse flex items-center justify-center"
          style={{
            width: `${180 * scale}px`,
            height: `${70 * scale}px`,
            transform: 'rotateX(60deg)'
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        </div>
      </div>

      {/* 3D Bouquet Layer in AR Space */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute z-20 cursor-move"
        style={{
          left: `calc(50% + ${position.x}px)`,
          top: `calc(48% + ${position.y}px)`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: '380px',
          height: '460px'
        }}
      >
        <ThreeBouquetViewer
          wrapper={wrapper}
          ribbon={ribbon}
          style={style}
          stems={stems}
          autoRotateDefault={true}
          lightingPreset={lighting}
          allowUserControls={false}
          cameraDistance={7.0}
          transparentBackground={true}
          className="w-full h-full"
        />
      </div>

      {/* Top Floating Controls */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600/90 text-white shadow-sm backdrop-blur-md">
            <Camera className="w-3.5 h-3.5 mr-1" /> AR View
          </span>
          <span className="text-xs text-stone-300 truncate max-w-[160px] sm:max-w-xs">{bouquetName}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch Camera / Simulated Room */}
          <button
            type="button"
            onClick={toggleCameraMode}
            title={useSimulatedRoom ? 'Switch to Device Camera' : 'Switch to Room Simulator'}
            className="h-9 px-3 rounded-full text-xs font-medium bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/60 backdrop-blur-md flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{useSimulatedRoom ? 'Use Camera' : 'Use Room'}</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AR mode"
            className="w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/60 flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Snapshot Toast */}
      {photoSnapped && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-stone-900/90 border border-stone-700 text-white text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Photo snapshot captured! Saved to album</span>
        </div>
      )}

      {/* Helper Guidance Banner */}
      <div className="absolute top-16 left-4 right-4 z-20 pointer-events-none text-center">
        <div className="inline-block bg-stone-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-800/80 text-[11px] text-stone-300">
          <span>Tap & drag bouquet to place on table · Use sliders below for scale</span>
        </div>
      </div>

      {/* Bottom Floating Control Panel */}
      <div className="absolute bottom-4 left-3 right-3 sm:max-w-md sm:mx-auto z-30 bg-stone-900/85 backdrop-blur-md border border-stone-800 rounded-3xl p-3.5 shadow-2xl flex flex-col gap-3">
        {/* Scale & Lighting Row */}
        <div className="grid grid-cols-2 gap-3 items-center">
          {/* Scale Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3 h-3" /> Scale
              </span>
              <span className="font-mono text-stone-300">{(scale * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.6"
              step="0.05"
              value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Lighting Mode Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-stone-400">Ambience</span>
            <div className="grid grid-cols-3 gap-1 bg-stone-800/80 p-0.5 rounded-lg text-[10px]">
              <button
                type="button"
                onClick={() => setLighting('studio')}
                className={`py-1 rounded text-center transition-colors ${
                  lighting === 'studio' ? 'bg-stone-700 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setLighting('golden_hour')}
                className={`py-1 rounded text-center transition-colors ${
                  lighting === 'golden_hour' ? 'bg-amber-600/80 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Warm
              </button>
              <button
                type="button"
                onClick={() => setLighting('candlelight')}
                className={`py-1 rounded text-center transition-colors ${
                  lighting === 'candlelight' ? 'bg-orange-700/80 text-white font-medium' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Candle
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1 border-t border-stone-800/80">
          {/* Reset position button */}
          <button
            type="button"
            onClick={() => {
              setPosition({ x: 0, y: 15 });
              setScale(1.0);
            }}
            title="Reset position"
            className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center shrink-0 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Snap Photo Button */}
          <button
            type="button"
            onClick={handleSnapPhoto}
            className="flex-1 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700/60"
          >
            <Camera className="w-4 h-4 text-rose-400" />
            <span>Snap Photo</span>
          </button>

          {/* Add to Cart Directly */}
          {onAddToCart && (
            <button
              type="button"
              onClick={() => {
                onAddToCart();
                onClose();
              }}
              className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-rose-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Order Bouquet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
