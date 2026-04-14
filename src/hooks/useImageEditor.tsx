import { useState, useRef, useEffect, useCallback } from "react";
import {
	renderToCanvas,
	applyCanvasContrastStretch,
	applyCanvasGamma,
	cropCanvasByDisplayBox,
	loadImageFromBlob,
	type DisplayBox
} from "../utils/canvas";

export interface ImageEditorState {
	imgEl: HTMLImageElement | null;
	cropMode: boolean;
	cropKey: number;
	startCropMode: () => void;
	confirmCrop: (displayBox: DisplayBox) => Promise<void>;
	cancelCrop: () => void;
	rotation: number;
	setRotation: (deg: number) => void;
	gamma: number;
	setGamma: (value: number) => void;
	contrastEnabled: boolean;
	setContrastEnabled: React.Dispatch<React.SetStateAction<boolean>>;
	processingLoading: boolean;
	loadFile: (file: File) => void;
	reset: () => void;
	clear: () => void;
}

const DEFAULT_GAMMA = 1.0;

export function useImageEditor(canvasRef: React.RefObject<HTMLCanvasElement>): ImageEditorState {
	const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
	const [rotation, setRotation] = useState(0);
	const [contrastEnabled, setContrastEnabled] = useState(false);
	const [gamma, setGamma] = useState(DEFAULT_GAMMA);
	const [processingLoading, setProcessingLoading] = useState(false);
	const [cropMode, setCropMode] = useState(false);
	const [cropKey, setCropKey] = useState(0);
	// Incremented by reset() to force effects to re-run even when
	// other deps haven't changed (e.g. rotation was already 0)
	const [renderKey, setRenderKey] = useState(0);

	const originalImgRef = useRef<HTMLImageElement | null>(null);

	// ── Effect 1: base render ─────────────────────────────────────────────────
	// renderKey is a dependency so reset() can force a re-run
	useEffect(() => {
		if (!imgEl || !canvasRef.current) return;
		renderToCanvas(canvasRef.current, imgEl, rotation);
	}, [imgEl, rotation, renderKey, canvasRef]);

	// ── Effect 2: post-processing ─────────────────────────────────────────────
	useEffect(() => {
		if (!imgEl || !canvasRef.current) return;

		let cancelled = false;
		renderToCanvas(canvasRef.current, imgEl, rotation);

		const spinnerTimer = setTimeout(() => {
			if (!cancelled) setProcessingLoading(true);
		}, 0);
		const processTimer = setTimeout(() => {
			if (cancelled || !canvasRef.current) return;
			applyCanvasGamma(canvasRef.current, gamma);
			if (contrastEnabled) applyCanvasContrastStretch(canvasRef.current);
			setProcessingLoading(false);
		}, 20);

		return () => {
			cancelled = true;
			clearTimeout(spinnerTimer);
			clearTimeout(processTimer);
		};
	}, [imgEl, rotation, gamma, contrastEnabled, renderKey, canvasRef]);

	// ── Load ──────────────────────────────────────────────────────────────────
	const loadFile = useCallback((file: File) => {
		if (!file.type.startsWith("image/")) return;
		loadImageFromBlob(file).then((img) => {
			originalImgRef.current = img;
			setImgEl(img);
			setRotation(0);
			setContrastEnabled(false);
			setGamma(DEFAULT_GAMMA);
			setCropMode(false);
			setRenderKey(0);
		});
	}, []);

	// ── Crop ──────────────────────────────────────────────────────────────────
	const startCropMode = useCallback(() => {
		setCropMode(true);
		setCropKey((k) => k + 1);
	}, []);

	const cancelCrop = useCallback(() => setCropMode(false), []);

	const confirmCrop = useCallback(
		async (displayBox: DisplayBox) => {
			if (!canvasRef.current) return;
			if (displayBox.w < 4 || displayBox.h < 4) {
				cancelCrop();
				return;
			}
			const blob = await cropCanvasByDisplayBox(canvasRef.current, displayBox);
			const img = await loadImageFromBlob(blob);
			setImgEl(img); // originalImgRef intentionally NOT updated
			setRotation(0);
			setCropMode(false);
		},
		[canvasRef, cancelCrop]
	);

	// ── Reset: restore original + bump renderKey to force re-render ───────────
	const reset = useCallback(() => {
		if (originalImgRef.current) setImgEl(originalImgRef.current);
		setRotation(0);
		setContrastEnabled(false);
		setGamma(DEFAULT_GAMMA);
		setCropMode(false);
		// Force effects to re-run even if other deps are unchanged
		setRenderKey((k) => k + 1);
	}, []);

	// ── Clear ─────────────────────────────────────────────────────────────────
	const clear = useCallback(() => {
		originalImgRef.current = null;
		setImgEl(null);
		setRotation(0);
		setContrastEnabled(false);
		setGamma(DEFAULT_GAMMA);
		setCropMode(false);
		setRenderKey(0);
	}, []);

	return {
		imgEl,
		cropMode,
		cropKey,
		startCropMode,
		confirmCrop,
		cancelCrop,
		rotation,
		setRotation,
		gamma,
		setGamma,
		contrastEnabled,
		setContrastEnabled,
		processingLoading,
		loadFile,
		reset,
		clear
	};
}
