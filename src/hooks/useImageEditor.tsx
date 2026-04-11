import { useState, useRef, useEffect, useCallback } from "react";
import { renderToCanvas, applyCanvasCLAHE, cropCanvasToBlob, loadImageFromBlob, toCanvasCoords } from "../utils/canvas";

/**
 * Manages all image editing state: load, rotate, CLAHE, crop.
 * The caller owns the <canvas> ref and passes it in.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 */
export function useImageEditor(canvasRef) {
	const [imgEl, setImgEl] = useState(null);
	const [rotation, setRotation] = useState(0);
	const [claheEnabled, setClaheEnabled] = useState(false);
	const [claheLoading, setClaheLoading] = useState(false);
	const [cropMode, setCropMode] = useState(false);
	const [cropStart, setCropStart] = useState(null);
	const [cropEnd, setCropEnd] = useState(null);

	const isDragging = useRef(false);

	// ── Re-render canvas whenever image / rotation / CLAHE change ──────────────
	useEffect(() => {
		if (!imgEl || !canvasRef.current) return;

		renderToCanvas(canvasRef.current, imgEl, rotation);

		if (claheEnabled) {
			setClaheLoading(true);
			// Yield to let the browser paint first so the spinner appears.
			setTimeout(() => {
				applyCanvasCLAHE(canvasRef.current);
				setClaheLoading(false);
			}, 20);
		}
	}, [imgEl, rotation, claheEnabled, canvasRef]);

	// ── Load ────────────────────────────────────────────────────────────────────
	const loadFile = useCallback((file) => {
		if (!file?.type.startsWith("image/")) return;
		loadImageFromBlob(file).then((img) => {
			setImgEl(img);
			setRotation(0);
			setClaheEnabled(false);
			setCropMode(false);
			setCropStart(null);
			setCropEnd(null);
		});
	}, []);

	// ── Crop interaction ────────────────────────────────────────────────────────
	const startCropMode = useCallback(() => {
		setCropMode(true);
		setCropStart(null);
		setCropEnd(null);
	}, []);

	const cancelCrop = useCallback(() => {
		setCropMode(false);
		setCropStart(null);
		setCropEnd(null);
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

	// ── Mouse handlers (attach to the canvas element) ──────────────────────────
	const onMouseDown = useCallback(
		(e) => {
			if (!cropMode || !canvasRef.current) return;
			isDragging.current = true;
			const c = toCanvasCoords(e, canvasRef.current);
			setCropStart(c);
			setCropEnd(c);
		},
		[cropMode, canvasRef]
	);

	const onMouseMove = useCallback(
		(e) => {
			if (!cropMode || !isDragging.current || !canvasRef.current) return;
			setCropEnd(toCanvasCoords(e, canvasRef.current));
		},
		[cropMode, canvasRef]
	);

	const onMouseUp = useCallback(() => {
		isDragging.current = false;
	}, []);

	// ── Reset all edits ─────────────────────────────────────────────────────────
	const reset = useCallback(() => {
		setRotation(0);
		setClaheEnabled(false);
		cancelCrop();
	}, [cancelCrop]);

	// ── Clear everything (new session) ─────────────────────────────────────────
	const clear = useCallback(() => {
		setImgEl(null);
		reset();
	}, [reset]);

	// ── Crop selection rect in display (CSS) coordinates ───────────────────────
	let cropRect = null;
	if (cropStart && cropEnd && canvasRef.current) {
		const canvas = canvasRef.current;
		const domRect = canvas.getBoundingClientRect();
		const sx = domRect.width / canvas.width;
		const sy = domRect.height / canvas.height;
		cropRect = {
			left: Math.min(cropStart.x, cropEnd.x) * sx,
			top: Math.min(cropStart.y, cropEnd.y) * sy,
			width: Math.abs(cropEnd.x - cropStart.x) * sx,
			height: Math.abs(cropEnd.y - cropStart.y) * sy
		};
	}

	return {
		// state
		imgEl,
		rotation,
		setRotation,
		claheEnabled,
		setClaheEnabled,
		claheLoading,
		cropMode,
		cropRect,
		hasCropSelection: Boolean(cropStart && cropEnd),
		// actions
		loadFile,
		startCropMode,
		cancelCrop,
		confirmCrop,
		reset,
		clear,
		// raw mouse handlers
		onMouseDown,
		onMouseMove,
		onMouseUp
	};
}
