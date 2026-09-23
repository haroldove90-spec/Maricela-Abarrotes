import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, Scan, AlertCircle, RefreshCw, CheckCircle2, 
  SwitchCamera, Volume2, Sparkles, ShieldCheck, ArrowRight
} from 'lucide-react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { Product } from '../types/pos';
import { playScannerBeep, playSuccessChime, playErrorBuzz } from '../utils/audio';

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
  const controlsRef = useRef<IScannerControls | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [continuousMode, setContinuousMode] = useState<boolean>(true);

  // Last detected scan banner
  const [lastScanned, setLastScanned] = useState<{
    code: string;
    product?: Product;
    time: string;
  } | null>(null);

  // 1. Initialize camera & request device access
  const initializeCamera = async (targetDeviceId?: string) => {
    setPermissionError(null);

    // Stop existing scanner controls if running
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }

    try {
      // First verify browser mediaDevices support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Su navegador o dispositivo no soporta la API de cámara web.');
        setHasPermission(false);
        return;
      }

      // Explicitly trigger browser permission prompt
      const initialStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: targetDeviceId ? undefined : { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      // Permission granted! Stop initial probe stream tracks
      initialStream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);

      // Enumerate all available camera video devices
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      setVideoDevices(devices);

      let deviceToUse = targetDeviceId;
      if (!deviceToUse && devices.length > 0) {
        // Prefer back camera if found in device labels
        const backCamera = devices.find(
          (d) =>
            d.label.toLowerCase().includes('back') ||
            d.label.toLowerCase().includes('trasera') ||
            d.label.toLowerCase().includes('rear') ||
            d.label.toLowerCase().includes('environment')
        );
        deviceToUse = backCamera ? backCamera.deviceId : devices[0].deviceId;
      }

      if (deviceToUse) {
        setSelectedDeviceId(deviceToUse);
      }

      if (videoRef.current) {
        const codeReader = new BrowserMultiFormatReader();
        
        // Start continuous decoding stream
        const controls = await codeReader.decodeFromVideoDevice(
          deviceToUse || undefined,
          videoRef.current,
          (result, error) => {
            if (result) {
              handleBarcodeDetected(result.getText());
            }
          }
        );

        controlsRef.current = controls;
        setIsScanning(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setHasPermission(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError(
          'Permiso de cámara denegado por el usuario o navegador. Por favor haga clic en el icono del candado en la barra de direcciones y seleccione "Permitir cámara".'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('No se encontró ninguna cámara conectada a este equipo o dispositivo móvil.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setPermissionError('La cámara ya está siendo utilizada por otra aplicación o pestaña.');
      } else {
        setPermissionError(`Error al inicializar cámara: ${err.message || 'Fallo desconocido'}`);
      }
    }
  };

  // Cooldown to avoid scanning same barcode 20 times in a single second
  const lastScanTimestamp = useRef<number>(0);
  const lastScanCode = useRef<string>('');

  const handleBarcodeDetected = (rawCode: string) => {
    const trimmed = rawCode.trim();
    if (!trimmed) return;

    const now = Date.now();
    // 1.5s debounce for the exact same barcode to prevent repeated accidental triggers
    if (trimmed === lastScanCode.current && now - lastScanTimestamp.current < 1500) {
      return;
    }

    lastScanTimestamp.current = now;
    lastScanCode.current = trimmed;

    // Search product in catalog by barcode or exact ID
    const foundProduct = products.find(
      (p) =>
        p.barcode.toLowerCase() === trimmed.toLowerCase() ||
        p.id.toLowerCase() === trimmed.toLowerCase()
    );

    if (foundProduct) {
      playScannerBeep();
      onScanProduct(foundProduct, 1);
      setLastScanned({
        code: trimmed,
        product: foundProduct,
        time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });

      if (!continuousMode) {
        onClose();
      }
    } else {
      playErrorBuzz();
      setLastScanned({
        code: trimmed,
        time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    }
  };

  useEffect(() => {
    initializeCamera();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
  }, []);

  // Switch camera when user selects different device
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    initializeCamera(deviceId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto select-none">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl border-2 sm:border-4 border-[#E21B23] w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="bg-[#E21B23] text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-[#FFCE00] text-[#E21B23] rounded-md">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-sans flex items-center gap-1.5">
                <span>Escáner Óptico de Cámara</span>
                <span className="bg-neutral-900/40 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                  Móvil / Tablet / PC
                </span>
              </h3>
              <p className="text-[10px] text-red-100">
                Abarrotes Maricela · Lector de Códigos de Barra en Tiempo Real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-800 rounded-full transition-colors cursor-pointer text-white"
            title="Cerrar cámara"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder & Video Stream */}
        <div className="relative bg-black h-72 sm:h-80 flex items-center justify-center overflow-hidden shrink-0">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isScanning ? 'opacity-100' : 'opacity-0'
            }`}
            playsInline
            muted
            autoPlay
          />

          {/* Loading or Permission Request Overlay */}
          {!isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-neutral-900/90 text-neutral-300 space-y-3">
              {permissionError ? (
                <div className="space-y-3 max-w-sm">
                  <div className="w-12 h-12 bg-red-900/60 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/50">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Acceso a Cámara Necesario</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {permissionError}
                  </p>
                  <button
                    type="button"
                    onClick={() => initializeCamera()}
                    className="px-4 py-2 bg-[#E21B23] hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reintentar y Solicitar Permiso</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 border-3 border-[#FFCE00] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium text-neutral-300">
                    Conectando con la cámara del dispositivo...
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Acepte el permiso en la ventana emergente de su navegador
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Red Optical Laser Reticle Overlay */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
              <div className="w-64 sm:w-80 h-36 sm:h-44 border-2 border-red-500/80 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                {/* Active Laser Sweep line */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_#ff0000] animate-pulse" />
                
                {/* 4 Corner Target Guides */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-[#FFCE00] rounded-tl" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-[#FFCE00] rounded-tr" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-[#FFCE00] rounded-bl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-[#FFCE00] rounded-br" />
              </div>

              <div className="mt-3 bg-black/80 backdrop-blur-xs px-3 py-1 rounded-full border border-neutral-700 flex items-center gap-1.5 text-[11px] font-mono text-red-300">
                <Scan className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Apunte el código de barras (EAN-13, UPC, Code-128) al recuadro</span>
              </div>
            </div>
          )}
        </div>

        {/* Scan Status Toast Banner */}
        {lastScanned && (
          <div
            className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono shrink-0 animate-fade-in ${
              lastScanned.product
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-red-950/80 text-red-300 border-red-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {lastScanned.product ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="truncate">
                {lastScanned.product ? (
                  <>
                    <strong className="text-white">¡Detectado!</strong> {lastScanned.product.name} ·{' '}
                    <span className="text-[#FFCE00] font-bold">
                      ${lastScanned.product.price.toFixed(2)} MXN
                    </span>
                  </>
                ) : (
                  <>
                    Código <strong className="text-white">{lastScanned.code}</strong> no registrado en inventario
                  </>
                )}
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
              {lastScanned.time}
            </span>
          </div>
        )}

        {/* Camera Controls & Settings Bar */}
        <div className="p-3 bg-neutral-800/90 border-t border-neutral-700 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          {/* Camera switcher dropdown */}
          <div className="flex items-center gap-2">
            <SwitchCamera className="w-4 h-4 text-[#FFCE00]" />
            <select
              value={selectedDeviceId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="bg-neutral-900 text-white border border-neutral-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#E21B23]"
            >
              {videoDevices.length === 0 ? (
                <option value="">Cámara Predeterminada</option>
              ) : (
                videoDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Cámara ${i + 1}`}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Continuous scan mode toggle */}
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={continuousMode}
              onChange={(e) => setContinuousMode(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#E21B23] focus:ring-red-500 cursor-pointer"
            />
            <span className="text-[11px] font-semibold">
              Modo continuo (Pistola escáner)
            </span>
          </label>
        </div>

        {/* Quick Sample Products for Testing when no physical item is available */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 overflow-y-auto max-h-36">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
            Muestras Rápidas para Prueba sin Cámara Física:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleBarcodeDetected(p.barcode)}
                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-left border border-neutral-700 transition-colors cursor-pointer text-xs"
              >
                <div className="font-bold text-neutral-200 truncate text-[11px]">{p.shortName || p.name}</div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-0.5">
                  <span>{p.barcode.slice(-5)}</span>
                  <span className="text-[#FFCE00] font-bold">${p.price.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Permiso seguro SSL / HTTPS activo</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
};
