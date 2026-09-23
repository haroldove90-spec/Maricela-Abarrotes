import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Scan, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types/pos';
import { playScannerBeep } from '../utils/audio';

interface BarcodeCameraModalProps {
  products: Product[];
  onScanProduct: (product: Product, quantity: number) => void;
  onClose: () => void;
}

export const BarcodeCameraModal: React.FC<BarcodeCameraModalProps> = ({
  products,
  onScanProduct,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraActive(true);
          }
        } else {
          setCameraError('Cámara web no soportada en este entorno.');
        }
      } catch (err) {
        setCameraError('Permiso de cámara no concedido o no disponible.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSimulatedScan = (product: Product) => {
    playScannerBeep();
    onScanProduct(product, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="bg-neutral-900 rounded-xl shadow-2xl border-4 border-red-600 w-full max-w-lg overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-[#E21B23] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#FFCE00]" />
            <h3 className="text-sm font-bold font-sans">
              Lector Óptico de Códigos de Barras
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-800 rounded-full transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-black h-64 sm:h-72 flex items-center justify-center overflow-hidden">
          {cameraActive ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
          ) : (
            <div className="text-center p-6 text-neutral-400 space-y-2">
              <Camera className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="text-xs">
                {cameraError || 'Iniciando cámara óptica del escáner...'}
              </p>
              <p className="text-[11px] text-neutral-500">
                Puede apuntar un producto real a la cámara o seleccionar un producto del visor rápido abajo:
              </p>
            </div>
          )}

          {/* Red Laser Scanning Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="w-48 h-32 border-2 border-red-500/80 rounded-lg relative">
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_#ff0000] animate-pulse"></div>
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-400"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-400"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-400"></div>
            </div>
            <span className="text-[10px] text-red-400 font-mono mt-2 bg-black/60 px-2 py-0.5 rounded">
              Alinee el código de barras dentro del recuadro
            </span>
          </div>
        </div>

        {/* Quick Optical Simulation Picker */}
        <div className="p-4 bg-neutral-800 text-white space-y-2">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
            Escanear Muestra de Producto Instantáneo:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSimulatedScan(p)}
                className="p-2 bg-neutral-700/80 hover:bg-neutral-700 rounded text-left border border-neutral-600 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <span className="text-xs font-bold truncate text-white">{p.name}</span>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>{p.barcode.slice(-6)}</span>
                  <span className="text-[#FFCE00] font-bold">${p.price.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-bold rounded cursor-pointer"
          >
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
};
