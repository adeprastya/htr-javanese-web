import { useState } from "react";
import { Crop, RotateCw, Zap, RefreshCw, Info } from "lucide-react";

/**
 * @param {{
 *   cropMode: boolean,
 *   rotation: number,
 *   claheEnabled: boolean,
 *   onStartCrop: Function,
 *   onCancelCrop: Function,
 *   onRotationChange: (deg: number) => void,
 *   onToggleClahe: Function,
 *   onReset: Function,
 * }} props
 */
export function ImageToolbar({
	cropMode,
	rotation,
	claheEnabled,
	onStartCrop,
	onCancelCrop,
	onRotationChange,
	onToggleClahe,
	onReset
}) {
	const [activePanel, setActivePanel] = useState(null); // "rotate" | null

	const togglePanel = (name) => setActivePanel((prev) => (prev === name ? null : name));

	const handleCropToggle = () => {
		if (cropMode) onCancelCrop();
		else onStartCrop();
	};

	const PRESET_ANGLES = [-90, -45, 0, 45, 90];

	return (
		<div
			style={{
				background: "rgba(255,255,255,0.65)",
				backdropFilter: "blur(16px)",
				border: "1px solid rgba(255,255,255,0.8)",
				borderRadius: 20,
				padding: 22,
				boxShadow: "0 8px 32px rgba(100,120,200,0.08)"
			}}
		>
			<p
				style={{
					fontWeight: 600,
					color: "#64748b",
					marginBottom: 14,
					letterSpacing: "0.4px",
					textTransform: "uppercase",
					fontSize: 12
				}}
			>
				Pra-proses Citra
			</p>

			{/* Tool buttons row */}
			<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
				<ToolButton
					icon={<Crop size={15} />}
					label="Crop"
					active={cropMode}
					activeColor="#4f6ef7"
					onClick={handleCropToggle}
				/>
				<ToolButton
					icon={<RotateCw size={15} />}
					label="Rotasi"
					active={activePanel === "rotate"}
					activeColor="#7c3aed"
					onClick={() => togglePanel("rotate")}
				/>
				<ToolButton
					icon={<Zap size={15} />}
					label={`CLAHE${claheEnabled ? " ✓" : ""}`}
					active={claheEnabled}
					activeColor="#f59e0b"
					onClick={onToggleClahe}
				/>
				<ToolButton icon={<RefreshCw size={15} />} label="Reset" onClick={onReset} />
			</div>

			{/* Rotate panel */}
			{activePanel === "rotate" && (
				<div
					style={{
						background: "rgba(124,58,237,0.05)",
						borderRadius: 12,
						padding: "14px 16px",
						border: "1px solid rgba(124,58,237,0.15)",
						animation: "fadeIn 0.2s ease"
					}}
				>
					<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
						<span style={{ fontSize: 13, fontWeight: 500, color: "#7c3aed" }}>Sudut Rotasi</span>
						<span style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed", fontFamily: "'Fira Code', monospace" }}>
							{rotation}°
						</span>
					</div>
					<input
						type="range"
						min="-180"
						max="180"
						step="1"
						value={rotation}
						onChange={(e) => onRotationChange(Number(e.target.value))}
						style={{ width: "100%", accentColor: "#7c3aed" }}
					/>
					<div
						style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}
					>
						<span>-180°</span>
						<span>0°</span>
						<span>+180°</span>
					</div>
					<div style={{ display: "flex", gap: 6, marginTop: 10 }}>
						{PRESET_ANGLES.map((v) => (
							<button
								key={v}
								onClick={() => onRotationChange(v)}
								style={{
									flex: 1,
									background: rotation === v ? "#7c3aed" : "white",
									color: rotation === v ? "white" : "#374151",
									border: "1px solid",
									borderColor: rotation === v ? "#7c3aed" : "#e2e8f0",
									borderRadius: 7,
									padding: "5px 0",
									fontSize: 12,
									fontWeight: 500,
									cursor: "pointer",
									fontFamily: "'Sora',sans-serif"
								}}
							>
								{v}°
							</button>
						))}
					</div>
				</div>
			)}

			{/* CLAHE info banner */}
			{claheEnabled && (
				<div
					style={{
						display: "flex",
						gap: 8,
						alignItems: "flex-start",
						background: "rgba(245,158,11,0.08)",
						borderRadius: 10,
						padding: "10px 14px",
						border: "1px solid rgba(245,158,11,0.2)",
						animation: "fadeIn 0.2s ease",
						marginTop: activePanel === "rotate" ? 10 : 0
					}}
				>
					<Info size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
					<p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
						CLAHE aktif — meningkatkan kontras lokal pada citra untuk hasil pengenalan yang lebih baik.
					</p>
				</div>
			)}
		</div>
	);
}

// ── Internal sub-component ───────────────────────────────────────────────────
function ToolButton({ icon, label, active = false, activeColor = "#4f6ef7", onClick }) {
	return (
		<button
			onClick={onClick}
			className="tool-btn"
			style={{
				background: active ? `${activeColor}18` : "white",
				borderColor: active ? activeColor : "#e2e8f0",
				color: active ? activeColor : "#374151"
			}}
		>
			{icon} {label}
		</button>
	);
}
