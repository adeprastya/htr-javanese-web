import { useState } from "react";
import { Crop, RotateCw, SunMedium, Contrast, RefreshCw, Info } from "lucide-react";

interface ImageToolbarProps {
	cropMode: boolean;
	rotation: number;
	contrastEnabled: boolean;
	gamma: number;
	onStartCrop: () => void;
	onCancelCrop: () => void;
	onRotationChange: (deg: number) => void;
	onContrastToggle: () => void;
	onGammaChange: (value: number) => void;
	onReset: () => void;
}

type ActivePanel = "rotate" | "gamma" | null;

const PRESET_ANGLES = [-90, -45, 0, 45, 90] as const;
const GAMMA_MIN = 0.2;
const GAMMA_MAX = 3.0;
const GAMMA_STEP = 0.05;
const GAMMA_DEFAULT = 1.0;
const ROTATE_DEFAULT = 0;

export function ImageToolbar({
	cropMode,
	rotation,
	contrastEnabled,
	gamma = 1.0,
	onStartCrop,
	onCancelCrop,
	onRotationChange,
	onContrastToggle,
	onGammaChange,
	onReset
}: ImageToolbarProps) {
	const [activePanel, setActivePanel] = useState<ActivePanel>(null);

	const togglePanel = (name: ActivePanel) => setActivePanel((prev) => (prev === name ? null : name));

	const handleCropToggle = () => {
		if (cropMode) onCancelCrop();
		else onStartCrop();
	};

	const handleOnReset = () => {
		onReset();
		setActivePanel(null);
	};

	const gammaIsActive = gamma !== GAMMA_DEFAULT;
	const rotationIsActive = rotation !== ROTATE_DEFAULT;

	return (
		<div className="bg-neutral-100/65 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-5 md:p-6 shadow-sm">
			<p className="text-sm font-semibold text-neutral-600 mb-4">Peningkatan Citra</p>

			{/* Tool buttons row */}
			<div className="flex flex-wrap gap-2 mb-4">
				<ToolButton icon={<Crop size={15} />} label="Crop" active={cropMode} variant="sky" onClick={handleCropToggle} />
				<ToolButton
					icon={<RotateCw size={15} />}
					label={`Rotasi ${rotationIsActive ? `(${rotation}°)` : ""}`}
					active={rotationIsActive || activePanel === "rotate"}
					variant="violet"
					onClick={() => togglePanel("rotate")}
				/>
				<ToolButton
					icon={<SunMedium size={15} />}
					label={`Gamma${gammaIsActive ? ` (${gamma.toFixed(2)})` : ""}`}
					active={gammaIsActive || activePanel === "gamma"}
					variant="amber"
					onClick={() => togglePanel("gamma")}
				/>
				<ToolButton
					icon={<Contrast size={15} />}
					label={`Kontras${contrastEnabled ? " ✓" : ""}`}
					active={contrastEnabled}
					variant="teal"
					onClick={onContrastToggle}
				/>
				<ToolButton icon={<RefreshCw size={15} />} label="Reset" onClick={handleOnReset} />
			</div>

			{/* ── Rotate panel ── */}
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

			{/* ── Gamma panel ── */}
			{activePanel === "gamma" && (
				<div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-3 animate-in fade-in slide-in-from-top-1 duration-200">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-medium text-amber-600">Gamma Correction</span>
						<span className="text-sm font-semibold text-amber-600 font-mono">γ = {gamma.toFixed(2)}</span>
					</div>

					<input
						type="range"
						min={GAMMA_MIN}
						max={GAMMA_MAX}
						step={GAMMA_STEP}
						value={gamma}
						onChange={(e) => onGammaChange(Number(e.target.value))}
						className="w-full accent-amber-500"
					/>

					<div className="flex justify-between text-xs text-neutral-400 mt-1">
						<span>Cerah ({GAMMA_MIN})</span>
						<span>Normal (1.0)</span>
						<span>Gelap ({GAMMA_MAX})</span>
					</div>

					{/* Preset gamma buttons */}
					<div className="flex gap-1.5 mt-3">
						{([0.5, 0.75, 1.0, 1.5, 2.0] as const).map((v) => (
							<button
								key={v}
								onClick={() => onGammaChange(v)}
								className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 font-sans cursor-pointer
									${
										gamma === v
											? "bg-amber-500 text-neutral-100 border-amber-500"
											: "bg-neutral-100 text-neutral-600 border-neutral-200 hover:border-amber-300 hover:text-amber-500"
									}`}
							>
								{v}
							</button>
						))}
					</div>

					<button
						onClick={() => onGammaChange(GAMMA_DEFAULT)}
						className="mt-2 w-full text-xs text-amber-600 hover:text-amber-700 font-medium py-1 transition-colors duration-150 cursor-pointer"
					>
						Reset ke 1.0
					</button>
				</div>
			)}

			{/* ── Contrast info banner ── */}
			{contrastEnabled && (
				<div
					className={`flex gap-2 items-start bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-200 ${activePanel ? "mt-3" : ""}`}
				>
					<Info size={14} className="text-teal-600 shrink-0 mt-0.5" />
					<p className="text-xs text-teal-800 leading-relaxed">
						Contrast stretching aktif — meregangkan rentang intensitas piksel agar kontras gambar meningkat secara
						linear.
					</p>
				</div>
			)}
		</div>
	);
}

// ── ToolButton ────────────────────────────────────────────────────────────────

type ButtonVariant = "sky" | "violet" | "amber" | "teal" | "neutral";

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
	teal: {
		active: "bg-teal-100 border-teal-400 text-teal-600",
		inactive: "bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-teal-300 hover:text-teal-500"
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
