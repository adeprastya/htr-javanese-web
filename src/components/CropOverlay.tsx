import { useState, useRef, Fragment } from "react";
import { Check, X } from "lucide-react";
import type { DisplayBox } from "../utils/canvas";

type HandleType = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "move";

interface DragState {
	handle: HandleType;
	startX: number;
	startY: number;
	startBox: DisplayBox;
	isDragging: boolean;
}

interface CropOverlayProps {
	containerW: number;
	containerH: number;
	onConfirm: (box: DisplayBox) => void;
	onCancel: () => void;
}

const MIN_SIZE = 24;
const HANDLE = 10;

const HANDLE_CURSORS: Record<HandleType, string> = {
	nw: "nw-resize",
	n: "n-resize",
	ne: "ne-resize",
	w: "w-resize",
	move: "move",
	e: "e-resize",
	sw: "sw-resize",
	s: "s-resize",
	se: "se-resize"
};

export function CropOverlay({ containerW, containerH, onConfirm, onCancel }: CropOverlayProps) {
	const [box, setBox] = useState<DisplayBox>({
		x: 0,
		y: 0,
		w: containerW,
		h: containerH,
		isDragging: false
	});

	const dragRef = useRef<DragState | null>(null);

	// ── Pointer handlers ────────────────────────────────────────────────────────
	const onPointerDown = (handle: HandleType, e: React.PointerEvent) => {
		e.preventDefault();
		e.stopPropagation();
		(e.target as Element).setPointerCapture(e.pointerId);
		dragRef.current = {
			handle,
			startX: e.clientX,
			startY: e.clientY,
			startBox: { ...box },
			isDragging: true
		};
	};

	const onPointerMove = (e: React.PointerEvent) => {
		const d = dragRef.current;
		if (!d) return;

		const dx = e.clientX - d.startX;
		const dy = e.clientY - d.startY;
		const { x: ox, y: oy, w: ow, h: oh } = d.startBox;

		let x = ox,
			y = oy,
			w = ow,
			h = oh;

		switch (d.handle) {
			case "move":
				x = clamp(ox + dx, 0, containerW - ow);
				y = clamp(oy + dy, 0, containerH - oh);
				break;
			case "nw":
				x = clamp(ox + dx, 0, ox + ow - MIN_SIZE);
				y = clamp(oy + dy, 0, oy + oh - MIN_SIZE);
				w = ox + ow - x;
				h = oy + oh - y;
				break;
			case "n":
				y = clamp(oy + dy, 0, oy + oh - MIN_SIZE);
				h = oy + oh - y;
				break;
			case "ne":
				y = clamp(oy + dy, 0, oy + oh - MIN_SIZE);
				w = clamp(ow + dx, MIN_SIZE, containerW - ox);
				h = oy + oh - y;
				break;
			case "e":
				w = clamp(ow + dx, MIN_SIZE, containerW - ox);
				break;
			case "se":
				w = clamp(ow + dx, MIN_SIZE, containerW - ox);
				h = clamp(oh + dy, MIN_SIZE, containerH - oy);
				break;
			case "s":
				h = clamp(oh + dy, MIN_SIZE, containerH - oy);
				break;
			case "sw":
				x = clamp(ox + dx, 0, ox + ow - MIN_SIZE);
				w = ox + ow - x;
				h = clamp(oh + dy, MIN_SIZE, containerH - oy);
				break;
			case "w":
				x = clamp(ox + dx, 0, ox + ow - MIN_SIZE);
				w = ox + ow - x;
				break;
		}

		setBox({ x, y, w, h, isDragging: true });
	};

	const onPointerUp = () => {
		dragRef.current = null;
		setTimeout(() => {
			setBox((prev) => ({ ...prev, isDragging: false }));
		}, 500);
	};

	// ── Render ──────────────────────────────────────────────────────────────────
	const { x, y, w, h } = box;

	return (
		<div className="absolute inset-0 select-none" onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
			{/* Dim mask: 4 panels around the selection */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Top */}
				<div className="absolute bg-neutral-900/50" style={{ left: 0, top: 0, right: 0, height: y }} />
				{/* Bottom */}
				<div className="absolute bg-neutral-900/50" style={{ left: 0, top: y + h, right: 0, bottom: 0 }} />
				{/* Left */}
				<div className="absolute bg-neutral-900/50" style={{ left: 0, top: y, width: x, height: h }} />
				{/* Right */}
				<div className="absolute bg-neutral-900/50" style={{ left: x + w, top: y, right: 0, height: h }} />
			</div>

			{/* Selection box */}
			<div
				className="absolute border border-neutral-100/80"
				style={{ left: x, top: y, width: w, height: h, cursor: HANDLE_CURSORS.move }}
				onPointerDown={(e) => onPointerDown("move", e)}
			>
				{/* Rule-of-thirds grid */}
				<div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }}>
					{[1, 2].map((i) => (
						<Fragment key={i}>
							<div className="absolute top-0 bottom-0 w-px bg-neutral-100" style={{ left: `${(i / 3) * 100}%` }} />
							<div
								key={`h${i}`}
								className="absolute left-0 right-0 h-px bg-neutral-100"
								style={{ top: `${(i / 3) * 100}%` }}
							/>
						</Fragment>
					))}
				</div>

				{/* Resize handles */}
				{(["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const).map((handle) => (
					<Handle key={handle} handle={handle} size={HANDLE} onPointerDown={onPointerDown} />
				))}
			</div>

			{/* Confirm / Cancel buttons */}
			<div
				className="absolute z-50 flex gap-2"
				style={{
					left: x + 8,
					top: y + 8,
					visibility: box.isDragging ? "hidden" : "visible"
				}}
			>
				<button
					onPointerDown={(e) => e.stopPropagation()}
					onClick={() => onConfirm(box)}
					className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 text-neutral-100 text-sm font-semibold shadow-sm hover:bg-sky-600 transition-colors duration-150 cursor-pointer border-none"
				>
					<Check size={14} /> Terapkan
				</button>
				<button
					onPointerDown={(e) => e.stopPropagation()}
					onClick={onCancel}
					className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-700/70 text-neutral-100 text-sm font-semibold shadow-sm hover:bg-neutral-700 transition-colors duration-150 cursor-pointer border-none"
				>
					<X size={14} /> Batal
				</button>
			</div>
		</div>
	);
}

// ── Handle sub-component ──────────────────────────────────────────────────────

interface HandleProps {
	handle: Exclude<HandleType, "move">;
	size: number;
	onPointerDown: (handle: HandleType, e: React.PointerEvent) => void;
}

const HANDLE_POSITION: Record<Exclude<HandleType, "move">, React.CSSProperties> = {
	nw: { top: 0, left: 0, transform: "translate(-50%, -50%)" },
	n: { top: 0, left: "50%", transform: "translate(-50%, -50%)" },
	ne: { top: 0, right: 0, transform: "translate(50%, -50%)" },
	e: { top: "50%", right: 0, transform: "translate(50%, -50%)" },
	se: { bottom: 0, right: 0, transform: "translate(50%, 50%)" },
	s: { bottom: 0, left: "50%", transform: "translate(-50%, 50%)" },
	sw: { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
	w: { top: "50%", left: 0, transform: "translate(-50%, -50%)" }
};

function Handle({ handle, size, onPointerDown }: HandleProps) {
	return (
		<div
			className="absolute bg-neutral-100 border border-neutral-400 rounded-sm shadow-sm"
			style={{
				width: size,
				height: size,
				cursor: HANDLE_CURSORS[handle],
				...HANDLE_POSITION[handle]
			}}
			onPointerDown={(e) => onPointerDown(handle, e)}
		/>
	);
}

// ── Utility ───────────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max);
}
