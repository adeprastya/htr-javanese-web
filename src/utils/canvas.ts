import type { CLAHEOptions } from "./clahe";
import { applyCLAHE } from "./clahe";

interface CropRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Point {
	x: number;
	y: number;
}

export function renderToCanvas(canvas: HTMLCanvasElement, imgEl: HTMLImageElement, rotation: number): void {
	const ctx = canvas.getContext("2d")!;
	const w = imgEl.naturalWidth;
	const h = imgEl.naturalHeight;
	const rad = (rotation * Math.PI) / 180;
	const cos = Math.abs(Math.cos(rad));
	const sin = Math.abs(Math.sin(rad));
	const cw = Math.round(w * cos + h * sin);
	const ch = Math.round(w * sin + h * cos);

	canvas.width = cw;
	canvas.height = ch;
	ctx.clearRect(0, 0, cw, ch);
	ctx.save();
	ctx.translate(cw / 2, ch / 2);
	ctx.rotate(rad);
	ctx.drawImage(imgEl, -w / 2, -h / 2, w, h);
	ctx.restore();
}

export function applyCanvasCLAHE(canvas: HTMLCanvasElement, claheOpts: CLAHEOptions = {}): void {
	const ctx = canvas.getContext("2d")!;
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.putImageData(applyCLAHE(imageData, claheOpts), 0, 0);
}

export function cropCanvasToBlob(canvas: HTMLCanvasElement, { x, y, width, height }: CropRect): Promise<Blob> {
	const tmp = document.createElement("canvas");
	tmp.width = width;
	tmp.height = height;
	tmp.getContext("2d")!.drawImage(canvas, x, y, width, height, 0, 0, width, height);
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

export function toCanvasCoords(e: React.MouseEvent<HTMLDivElement>, canvas: HTMLCanvasElement): Point {
	const rect = canvas.getBoundingClientRect();
	return {
		x: ((e.clientX - rect.left) / rect.width) * canvas.width,
		y: ((e.clientY - rect.top) / rect.height) * canvas.height
	};
}
