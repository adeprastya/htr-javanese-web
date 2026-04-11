import { X, Check, RefreshCw } from "lucide-react";

/**
 * @param {{
 *   canvasRef: React.RefObject<HTMLCanvasElement>,
 *   cropMode: boolean,
 *   cropRect: object | null,
 *   hasCropSelection: boolean,
 *   claheLoading: boolean,
 *   onMouseDown: Function,
 *   onMouseMove: Function,
 *   onMouseUp: Function,
 *   onConfirmCrop: Function,
 *   onCancelCrop: Function,
 *   onClear: Function,
 * }} props
 */
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
}) {
	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<span style={{ fontWeight: 600, fontSize: 15, color: "#1e293b" }}>Preview</span>
				<button
					onClick={onClear}
					style={{
						background: "rgba(239,68,68,0.1)",
						border: "none",
						borderRadius: 8,
						padding: "4px 10px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: 4,
						color: "#ef4444",
						fontSize: 13,
						fontWeight: 500
					}}
				>
					<X size={13} /> Hapus
				</button>
			</div>

			{/* Canvas + overlays */}
			<div
				style={{
					position: "relative",
					borderRadius: 12,
					overflow: "hidden",
					background: "#f1f5f9",
					cursor: cropMode ? "crosshair" : "default"
				}}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
			>
				<canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block", maxHeight: 320 }} />

				{/* Crop selection box */}
				{cropRect && (
					<div
						style={{
							position: "absolute",
							left: cropRect.left,
							top: cropRect.top,
							width: cropRect.width,
							height: cropRect.height,
							border: "2px solid #4f6ef7",
							background: "rgba(79,110,247,0.1)",
							pointerEvents: "none"
						}}
					/>
				)}

				{/* CLAHE spinner */}
				{claheLoading && (
					<div
						style={{
							position: "absolute",
							inset: 0,
							background: "rgba(255,255,255,0.7)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 14,
							color: "#4f6ef7",
							fontWeight: 500,
							gap: 8
						}}
					>
						<RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
						Memproses CLAHE…
					</div>
				)}

				{/* Crop hint */}
				{cropMode && !hasCropSelection && (
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							pointerEvents: "none"
						}}
					>
						<div
							style={{
								background: "rgba(0,0,0,0.5)",
								color: "white",
								borderRadius: 8,
								padding: "8px 16px",
								fontSize: 13
							}}
						>
							Seret untuk memilih area crop
						</div>
					</div>
				)}
			</div>

			{/* Crop confirm / cancel */}
			{cropMode && hasCropSelection && (
				<div style={{ display: "flex", gap: 8, marginTop: 10 }}>
					<button
						onClick={onConfirmCrop}
						className="tool-btn"
						style={{
							flex: 1,
							justifyContent: "center",
							background: "rgba(34,197,94,0.1)",
							borderColor: "#22c55e",
							color: "#16a34a"
						}}
					>
						<Check size={15} /> Terapkan Crop
					</button>
					<button
						onClick={onCancelCrop}
						className="tool-btn"
						style={{ background: "rgba(239,68,68,0.1)", borderColor: "#ef4444", color: "#dc2626" }}
					>
						<X size={15} />
					</button>
				</div>
			)}
		</div>
	);
}
