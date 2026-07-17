import { useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

interface QRScannerProps {
    onScan: (text: string) => void;
    onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<any>(null);


    useEffect(() => {
        if (!videoRef.current) return;

        const codeReader = new BrowserQRCodeReader();
        
        codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error, controls) => {
            controlsRef.current = controls;
            if (result) {
                onScan(result.getText());
                controls.stop();
            }
        }).catch(err => console.error("QR Scanner error:", err));

        return () => {
            if (controlsRef.current) {
                controlsRef.current.stop();
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col font-sans relative">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Scan Book QR</h2>
                        <p className="text-xs text-gray-500">Position the book's QR code in the frame</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none">✕</button>
                </div>
                
                <div className="relative bg-black aspect-square w-full flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    {/* Scanner overlay frame */}
                    <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-full border-2 border-purple-500 rounded-lg shadow-[0_0_0_4000px_rgba(0,0,0,0.4)] box-border"></div>
                    </div>
                </div>

                <div className="p-4 bg-white flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition w-full">
                        Cancel Scanning
                    </button>
                </div>
            </div>
        </div>
    );
}
