import { applyContrastStretch, applyGammaCorrection, type ContrastStretchOptions } from "./imageProcessing";

export interface DisplayBox {
	x: number;
	y: number;
	w: number;
	h: number;
	isDragging: boolean;
}

interface CanvasCropRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

const CTX_OPTIONS: CanvasRenderingContext2DSettings = { willReadFrequently: true };

// ── Auto-fit: largest inscribed rectangle after rotation ─────────────────────
// Based on: https://stackoverflow.com/a/16778797 (Caspian Rychlik-Prince, CC-BY-SA)
function largestInscribedRect(W: number, H: number, angleRad: number): { w: number; h: number } {
	const sinA = Math.abs(Math.sin(angleRad));
	const cosA = Math.abs(Math.cos(angleRad));

	if (sinA < 1e-10) return { w: W, h: H };
	if (cosA < 1e-10) return { w: H, h: W };

	const widthIsLonger = W >= H;
	const sideLong = widthIsLonger ? W : H;
	const sideShort = widthIsLonger ? H : W;

	let wr: number, hr: number;

	if (sideShort <= 2 * sinA * cosA * sideLong || Math.abs(sinA - cosA) < 1e-10) {
		// Half-constrained: two corners touch the longer side
		const x = sideShort / 2;
		[wr, hr] = widthIsLonger ? [x / sinA, x / cosA] : [x / cosA, x / sinA];
	} else {
		// Fully constrained: crop touches all 4 sides
		const cos2a = cosA * cosA - sinA * sinA;
		wr = (W * cosA - H * sinA) / cos2a;
		hr = (H * cosA - W * sinA) / cos2a;
	}

	return { w: Math.max(1, wr), h: Math.max(1, hr) };
}

// ── Render ────────────────────────────────────────────────────────────────────
export function renderToCanvas(canvas: HTMLCanvasElement, imgEl: HTMLImageElement, rotation: number): void {
	const ctx = canvas.getContext("2d", CTX_OPTIONS)!;
	const W = imgEl.naturalWidth;
	const H = imgEl.naturalHeight;
	const rad = (rotation * Math.PI) / 180;

	// Size canvas to inscribed rect — no black corners
	const { w: cw, h: ch } = largestInscribedRect(W, H, rad);
	canvas.width = Math.round(cw);
	canvas.height = Math.round(ch);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate(rad);
	ctx.drawImage(imgEl, -W / 2, -H / 2, W, H);
	ctx.restore();
}

// ── Post-processing ───────────────────────────────────────────────────────────
export function applyCanvasContrastStretch(canvas: HTMLCanvasElement, opts: ContrastStretchOptions = {}): void {
	const ctx = canvas.getContext("2d", CTX_OPTIONS)!;
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.putImageData(applyContrastStretch(imageData, opts), 0, 0);
}

export function applyCanvasGamma(canvas: HTMLCanvasElement, gamma: number): void {
	const ctx = canvas.getContext("2d", CTX_OPTIONS)!;
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.putImageData(applyGammaCorrection(imageData, gamma), 0, 0);
}

// ── Crop ──────────────────────────────────────────────────────────────────────
/**
 * Convert a display-space (CSS px) crop box to canvas pixel coordinates
 * and export the cropped area as a Blob.
 */
export function cropCanvasByDisplayBox(canvas: HTMLCanvasElement, displayBox: DisplayBox): Promise<Blob> {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	const crop: CanvasCropRect = {
		x: Math.round(displayBox.x * scaleX),
		y: Math.round(displayBox.y * scaleY),
		width: Math.round(displayBox.w * scaleX),
		height: Math.round(displayBox.h * scaleY)
	};

	const tmp = document.createElement("canvas");
	tmp.width = crop.width;
	tmp.height = crop.height;
	tmp
		.getContext("2d", CTX_OPTIONS)!
		.drawImage(canvas, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

	return new Promise((resolve, reject) =>
		tmp.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png")
	);
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) =>
		canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png")
	);
}

export function loadImageFromBlob(blob: Blob | File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(blob);
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to load image"));
		};
		img.src = url;
	});
}
