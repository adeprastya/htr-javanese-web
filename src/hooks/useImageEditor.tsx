import { useState, useRef, useEffect, useCallback } from "react";
import { renderToCanvas, applyCanvasCLAHE, cropCanvasToBlob, loadImageFromBlob, toCanvasCoords } from "../utils/canvas";

interface Point {
	x: number;
	y: number;
}

interface CropRect {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface ImageEditorState {
	imgEl: HTMLImageElement | null;
	rotation: number;
	setRotation: (deg: number) => void;
	claheEnabled: boolean;
	setClaheEnabled: React.Dispatch<React.SetStateAction<boolean>>;
	claheLoading: boolean;
	cropMode: boolean;
	cropRect: CropRect | null;
	hasCropSelection: boolean;
	loadFile: (file: File) => void;
	startCropMode: () => void;
	cancelCrop: () => void;
	confirmCrop: () => Promise<void>;
	reset: () => void;
	clear: () => void;
	onMouseDown: React.MouseEventHandler<HTMLDivElement>;
	onMouseMove: React.MouseEventHandler<HTMLDivElement>;
	onMouseUp: React.MouseEventHandler<HTMLDivElement>;
}

export function useImageEditor(canvasRef: React.RefObject<HTMLCanvasElement>): ImageEditorState {
	const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
	const [rotation, setRotation] = useState(0);
	const [claheEnabled, setClaheEnabled] = useState(false);
	const [claheLoading, setClaheLoading] = useState(false);
	const [cropMode, setCropMode] = useState(false);
	const [cropStart, setCropStart] = useState<Point | null>(null);
	const [cropEnd, setCropEnd] = useState<Point | null>(null);
	const [cropRect, setCropRect] = useState<CropRect | null>(null);

	const isDragging = useRef(false);

	// ── Render canvas (no setState here) ───────────────────────────────────────
	useEffect(() => {
		if (!imgEl || !canvasRef.current) return;
		renderToCanvas(canvasRef.current, imgEl, rotation);
	}, [imgEl, rotation, canvasRef]);

	// ── CLAHE (all setState inside callbacks, never synchronously) ─────────────
	useEffect(() => {
		if (!claheEnabled || !imgEl || !canvasRef.current) return;

		let cancelled = false;

		// Re-render the base canvas first (CLAHE effect stacks on top)
		renderToCanvas(canvasRef.current, imgEl, rotation);

		// Tick 1 (setTimeout 0): show the spinner
		const spinnerTimer = setTimeout(() => {
			if (!cancelled) setClaheLoading(true);
		}, 0);

		// Tick 2 (setTimeout 20): run the heavy CLAHE computation
		const claheTimer = setTimeout(() => {
			if (cancelled || !canvasRef.current) return;
			applyCanvasCLAHE(canvasRef.current);
			setClaheLoading(false);
		}, 20);

		return () => {
			cancelled = true;
			clearTimeout(spinnerTimer);
			clearTimeout(claheTimer);
		};
	}, [claheEnabled, imgEl, rotation, canvasRef]);

	// ── Load ────────────────────────────────────────────────────────────────────
	const loadFile = useCallback((file: File) => {
		if (!file.type.startsWith("image/")) return;
		loadImageFromBlob(file).then((img) => {
			setImgEl(img);
			setRotation(0);
			setClaheEnabled(false);
			setCropMode(false);
			setCropStart(null);
			setCropEnd(null);
			setCropRect(null);
		});
	}, []);

	// ── Crop interaction ────────────────────────────────────────────────────────
	const startCropMode = useCallback(() => {
		setCropMode(true);
		setCropStart(null);
		setCropEnd(null);
		setCropRect(null);
	}, []);

	const cancelCrop = useCallback(() => {
		setCropMode(false);
		setCropStart(null);
		setCropEnd(null);
		setCropRect(null);
		isDragging.current = false;
	}, []);

	const confirmCrop = useCallback(async () => {
		if (!cropStart || !cropEnd || !canvasRef.current) return;

		const x = Math.round(Math.min(cropStart.x, cropEnd.x));
		const y = Math.round(Math.min(cropStart.y, cropEnd.y));
		const width = Math.round(Math.abs(cropEnd.x - cropStart.x));
		const height = Math.round(Math.abs(cropEnd.y - cropStart.y));

		if (width < 4 || height < 4) {
			cancelCrop();
			return;
		}

		const blob = await cropCanvasToBlob(canvasRef.current, { x, y, width, height });
		const img = await loadImageFromBlob(blob);
		setImgEl(img);
		setRotation(0);
		cancelCrop();
	}, [cropStart, cropEnd, canvasRef, cancelCrop]);

	// ── Compute display-space cropRect from canvas coords ───────────────────────
	const computeCropRect = useCallback(
		(start: Point, end: Point): CropRect | null => {
			const canvas = canvasRef.current;
			if (!canvas) return null;
			const domRect = canvas.getBoundingClientRect();
			const sx = domRect.width / canvas.width;
			const sy = domRect.height / canvas.height;
			return {
				left: Math.min(start.x, end.x) * sx,
				top: Math.min(start.y, end.y) * sy,
				width: Math.abs(end.x - start.x) * sx,
				height: Math.abs(end.y - start.y) * sy
			};
		},
		[canvasRef]
	);

	// ── Mouse handlers ──────────────────────────────────────────────────────────
	const onMouseDown = useCallback<React.MouseEventHandler<HTMLDivElement>>(
		(e) => {
			if (!cropMode || !canvasRef.current) return;
			isDragging.current = true;
			const c = toCanvasCoords(e, canvasRef.current);
			setCropStart(c);
			setCropEnd(c);
			setCropRect(null);
		},
		[cropMode, canvasRef]
	);

	const onMouseMove = useCallback<React.MouseEventHandler<HTMLDivElement>>(
		(e) => {
			if (!cropMode || !isDragging.current || !canvasRef.current) return;
			const end = toCanvasCoords(e, canvasRef.current);
			setCropEnd(end);
			setCropStart((start) => {
				if (!start) return start;
				setCropRect(computeCropRect(start, end));
				return start;
			});
		},
		[cropMode, canvasRef, computeCropRect]
	);

	const onMouseUp = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
		isDragging.current = false;
	}, []);

	// ── Reset / clear ───────────────────────────────────────────────────────────
	const reset = useCallback(() => {
		setRotation(0);
		setClaheEnabled(false);
		cancelCrop();
	}, [cancelCrop]);

	const clear = useCallback(() => {
		setImgEl(null);
		reset();
	}, [reset]);

	return {
		imgEl,
		rotation,
		setRotation,
		claheEnabled,
		setClaheEnabled,
		claheLoading,
		cropMode,
		cropRect,
		hasCropSelection: Boolean(cropStart && cropEnd),
		loadFile,
		startCropMode,
		cancelCrop,
		confirmCrop,
		reset,
		clear,
		onMouseDown,
		onMouseMove,
		onMouseUp
	};
}
