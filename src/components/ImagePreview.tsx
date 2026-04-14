import { useRef, useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";
import { CropOverlay } from "./CropOverlay";
import type { DisplayBox } from "../utils/canvas";

interface ImagePreviewProps {
	canvasRef: React.RefObject<HTMLCanvasElement>;
	cropMode: boolean;
	cropKey: number;
	processingLoading: boolean;
	onConfirmCrop: (box: DisplayBox) => void;
	onCancelCrop: () => void;
	onClear: () => void;
}

export function ImagePreview({
	canvasRef,
	cropMode,
	cropKey,
	processingLoading,
	onConfirmCrop,
	onCancelCrop,
	onClear
}: ImagePreviewProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			setContainerSize({
				w: entry.contentRect.width,
				h: entry.contentRect.height
			});
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<span className="font-semibold text-[15px] text-neutral-800">Preview</span>
				<button
					onClick={onClear}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors duration-150 cursor-pointer border-none"
				>
					<X size={13} /> Hapus
				</button>
			</div>

			<div ref={containerRef} className="relative rounded-xl overflow-hidden bg-neutral-100">
				<canvas ref={canvasRef} className="block w-full h-auto max-h-80" />

				{processingLoading && (
					<div className="absolute inset-0 flex items-center justify-center gap-2 bg-neutral-100/70 text-sky-500 text-sm font-medium">
						<RefreshCw size={16} className="animate-spin" />
						Memproses…
					</div>
				)}

				{cropMode && containerSize.w > 0 && (
					<CropOverlay
						key={cropKey}
						containerW={containerSize.w}
						containerH={containerSize.h}
						onConfirm={onConfirmCrop}
						onCancel={onCancelCrop}
					/>
				)}
			</div>
		</div>
	);
}
