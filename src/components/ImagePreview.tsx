import { X, Check, RefreshCw } from "lucide-react";

interface CropRect {
	left: number;
	top: number;
	width: number;
	height: number;
}

interface ImagePreviewProps {
	canvasRef: React.RefObject<HTMLCanvasElement>;
	cropMode: boolean;
	cropRect: CropRect | null;
	hasCropSelection: boolean;
	claheLoading: boolean;
	onMouseDown: React.MouseEventHandler<HTMLDivElement>;
	onMouseMove: React.MouseEventHandler<HTMLDivElement>;
	onMouseUp: React.MouseEventHandler<HTMLDivElement>;
	onConfirmCrop: () => void;
	onCancelCrop: () => void;
	onClear: () => void;
}

export function ImagePreview({
	canvasRef,
	cropMode,
	cropRect,
	hasCropSelection,
	claheLoading,
	onMouseDown,
	onMouseMove,
	onMouseUp,
	onConfirmCrop,
	onCancelCrop,
	onClear
}: ImagePreviewProps) {
	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<span className="font-semibold text-[15px] text-neutral-800">Preview</span>
				<button
					onClick={onClear}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors duration-150 cursor-pointer border-none"
				>
					<X size={13} />
					Hapus
				</button>
			</div>

			{/* Canvas + overlays */}
			<div
				className={`relative rounded-xl overflow-hidden bg-neutral-100 ${cropMode ? "cursor-crosshair" : "cursor-default"}`}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
			>
				<canvas ref={canvasRef} className="block w-full h-auto max-h-80" />

				{/* Crop selection box */}
				{cropRect && (
					<div
						className="absolute border-2 border-sky-500 bg-sky-500/10 pointer-events-none"
						style={{
							left: cropRect.left,
							top: cropRect.top,
							width: cropRect.width,
							height: cropRect.height
						}}
					/>
				)}

				{/* CLAHE loading overlay */}
				{claheLoading && (
					<div className="absolute inset-0 flex items-center justify-center gap-2 bg-neutral-100/70 text-sky-500 text-sm font-medium">
						<RefreshCw size={16} className="animate-spin" />
						Memproses CLAHE…
					</div>
				)}

				{/* Crop hint */}
				{cropMode && !hasCropSelection && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="bg-neutral-900/50 text-neutral-100 text-sm rounded-lg px-4 py-2">
							Seret untuk memilih area crop
						</div>
					</div>
				)}
			</div>

			{/* Crop confirm / cancel */}
			{cropMode && hasCropSelection && (
				<div className="flex gap-2 mt-3">
					<button
						onClick={onConfirmCrop}
						className="flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-300 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors duration-150 cursor-pointer"
					>
						<Check size={15} />
						Terapkan Crop
					</button>
					<button
						onClick={onCancelCrop}
						className="flex items-center justify-center px-3 py-2 rounded-xl bg-red-50 border border-red-300 text-red-600 hover:bg-red-100 transition-colors duration-150 cursor-pointer"
					>
						<X size={15} />
					</button>
				</div>
			)}
		</div>
	);
}
