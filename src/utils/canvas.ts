import { applyCLAHE } from "./clahe";

/**
 * Draw an image onto a canvas with rotation applied.
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement} imgEl
 * @param {number} rotation - degrees
 */
export function renderToCanvas(canvas, imgEl, rotation) {
	const ctx = canvas.getContext("2d");
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

/**
 * Apply CLAHE to the current canvas content in-place.
 * @param {HTMLCanvasElement} canvas
 * @param {object} claheOpts - forwarded to applyCLAHE
 */
export function applyCanvasCLAHE(canvas, claheOpts = {}) {
	const ctx = canvas.getContext("2d");
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.putImageData(applyCLAHE(imageData, claheOpts), 0, 0);
}

/**
 * Crop a canvas region into a new Blob.
 * @param {HTMLCanvasElement} canvas
 * @param {{ x, y, width, height }} rect - pixel coords on the canvas
 * @returns {Promise<Blob>}
 */
export function cropCanvasToBlob(canvas, { x, y, width, height }) {
	const tmp = document.createElement("canvas");
	tmp.width = width;
	tmp.height = height;
	tmp.getContext("2d").drawImage(canvas, x, y, width, height, 0, 0, width, height);
	return new Promise((resolve) => tmp.toBlob(resolve, "image/png"));
}

/**
 * Export the current canvas contents as a Blob.
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
export function canvasToBlob(canvas) {
	return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/**
 * Load an image Blob/File into an HTMLImageElement.
 * @param {Blob|File} blob
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImageFromBlob(blob) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(blob);
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});
}

/**
 * Convert a display-space mouse event to canvas pixel coordinates.
 * @param {MouseEvent} e
 * @param {HTMLCanvasElement} canvas
 * @returns {{ x: number, y: number }}
 */
export function toCanvasCoords(e, canvas) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: ((e.clientX - rect.left) / rect.width) * canvas.width,
		y: ((e.clientY - rect.top) / rect.height) * canvas.height
	};
}
