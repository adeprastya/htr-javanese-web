import { useState } from "react";
import { Crop, RotateCw, Zap, RefreshCw, Info } from "lucide-react";

interface ImageToolbarProps {
	cropMode: boolean;
	rotation: number;
	claheEnabled: boolean;
	onStartCrop: () => void;
	onCancelCrop: () => void;
	onRotationChange: (deg: number) => void;
	onToggleClahe: () => void;
	onReset: () => void;
}

type ActivePanel = "rotate" | null;

const PRESET_ANGLES = [-90, -45, 0, 45, 90] as const;

export function ImageToolbar({
	cropMode,
	rotation,
	claheEnabled,
	onStartCrop,
	onCancelCrop,
	onRotationChange,
	onToggleClahe,
	onReset
}: ImageToolbarProps) {
	const [activePanel, setActivePanel] = useState<ActivePanel>(null);

	const togglePanel = (name: ActivePanel) => setActivePanel((prev) => (prev === name ? null : name));

	const handleCropToggle = () => {
		if (cropMode) onCancelCrop();
		else onStartCrop();
	};

	return (
		<div className="bg-neutral-100/65 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-5 md:p-6 shadow-sm">
			<p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">Pra-proses Citra</p>

			{/* Tool buttons row */}
			<div className="flex flex-wrap gap-2 mb-4">
				<ToolButton icon={<Crop size={15} />} label="Crop" active={cropMode} variant="sky" onClick={handleCropToggle} />
				<ToolButton
					icon={<RotateCw size={15} />}
					label="Rotasi"
					active={activePanel === "rotate"}
					variant="violet"
					onClick={() => togglePanel("rotate")}
				/>
				<ToolButton
					icon={<Zap size={15} />}
					label={`CLAHE${claheEnabled ? " ✓" : ""}`}
					active={claheEnabled}
					variant="amber"
					onClick={onToggleClahe}
				/>
				<ToolButton icon={<RefreshCw size={15} />} label="Reset" onClick={onReset} />
			</div>

			{/* Rotate panel */}
			{activePanel === "rotate" && (
				<div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-3 animate-in fade-in slide-in-from-top-1 duration-200">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-medium text-violet-600">Sudut Rotasi</span>
						<span className="text-sm font-semibold text-violet-600 font-mono">{rotation}°</span>
					</div>

					<input
						type="range"
						min="-180"
						max="180"
						step="1"
						value={rotation}
						onChange={(e) => onRotationChange(Number(e.target.value))}
						className="w-full accent-violet-500"
					/>

					<div className="flex justify-between text-xs text-neutral-400 mt-1">
						<span>-180°</span>
						<span>0°</span>
						<span>+180°</span>
					</div>

					<div className="flex gap-1.5 mt-3">
						{PRESET_ANGLES.map((v) => (
							<button
								key={v}
								onClick={() => onRotationChange(v)}
								className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 font-sans cursor-pointer
									${
										rotation === v
											? "bg-violet-500 text-neutral-100 border-violet-500"
											: "bg-neutral-100 text-neutral-600 border-neutral-200 hover:border-violet-300 hover:text-violet-500"
									}`}
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
					className={`flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-200 ${activePanel === "rotate" ? "mt-3" : ""}`}
				>
					<Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
					<p className="text-xs text-amber-800 leading-relaxed">
						CLAHE aktif — meningkatkan kontras lokal pada citra untuk hasil pengenalan yang lebih baik.
					</p>
				</div>
			)}
		</div>
	);
}

// ── ToolButton ────────────────────────────────────────────────────────────────

type ButtonVariant = "sky" | "violet" | "amber" | "neutral";

interface ToolButtonProps {
	icon: React.ReactNode;
	label: string;
	active?: boolean;
	variant?: ButtonVariant;
	onClick: () => void;
}

const VARIANT_STYLES: Record<ButtonVariant, { active: string; inactive: string }> = {
	sky: {
		active: "bg-sky-100 border-sky-400 text-sky-600",
		inactive: "bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-sky-300 hover:text-sky-500"
	},
	violet: {
		active: "bg-violet-100 border-violet-400 text-violet-600",
		inactive: "bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-violet-300 hover:text-violet-500"
	},
	amber: {
		active: "bg-amber-100 border-amber-400 text-amber-600",
		inactive: "bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-amber-300 hover:text-amber-500"
	},
	neutral: {
		active: "bg-neutral-200 border-neutral-400 text-neutral-700",
		inactive: "bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-neutral-400"
	}
};

function ToolButton({ icon, label, active = false, variant = "neutral", onClick }: ToolButtonProps) {
	const styles = VARIANT_STYLES[variant];

	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors duration-150 cursor-pointer
				${active ? styles.active : styles.inactive}`}
		>
			{icon}
			{label}
		</button>
	);
}
