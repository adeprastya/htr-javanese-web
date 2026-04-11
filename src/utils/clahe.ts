const N = 256;

function buildTileLUT(data, width, x0, y0, x1, y1, clipLimit) {
	const hist = new Int32Array(N);
	let count = 0;

	for (let y = y0; y < y1; y++) {
		for (let x = x0; x < x1; x++) {
			const p = (y * width + x) * 4;
			const luma = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]);
			hist[luma]++;
			count++;
		}
	}

	const limit = Math.max(1, Math.round((clipLimit * count) / N));
	let excess = 0;
	for (let b = 0; b < N; b++) {
		if (hist[b] > limit) {
			excess += hist[b] - limit;
			hist[b] = limit;
		}
	}
	const add = Math.floor(excess / N);
	for (let b = 0; b < N; b++) hist[b] += add;

	const lut = new Uint8Array(N);
	let cdf = 0;
	let cdfMin = -1;
	for (let b = 0; b < N; b++) {
		cdf += hist[b];
		if (cdfMin < 0 && cdf > 0) cdfMin = cdf;
		lut[b] = Math.round(((cdf - cdfMin) / Math.max(1, count - cdfMin)) * 255);
	}
	return lut;
}

/**
 * Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to ImageData.
 * @param {ImageData} imageData
 * @param {object} opts
 * @param {number} opts.tilesX
 * @param {number} opts.tilesY
 * @param {number} opts.clipLimit
 * @returns {ImageData}
 */
export function applyCLAHE(imageData, { tilesX = 8, tilesY = 8, clipLimit = 2.5 } = {}) {
	const { data, width, height } = imageData;
	const out = new Uint8ClampedArray(data);
	const tileW = Math.ceil(width / tilesX);
	const tileH = Math.ceil(height / tilesY);

	const luts = Array.from({ length: tilesY }, (_, ty) =>
		Array.from({ length: tilesX }, (_, tx) => {
			const x0 = tx * tileW,
				y0 = ty * tileH;
			const x1 = Math.min(x0 + tileW, width);
			const y1 = Math.min(y0 + tileH, height);
			return buildTileLUT(data, width, x0, y0, x1, y1, clipLimit);
		})
	);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const p = (y * width + x) * 4;
			const g = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]);

			const txf = x / tileW - 0.5;
			const tyf = y / tileH - 0.5;
			const tx0 = Math.max(0, Math.floor(txf));
			const ty0 = Math.max(0, Math.floor(tyf));
			const tx1 = Math.min(tilesX - 1, tx0 + 1);
			const ty1 = Math.min(tilesY - 1, ty0 + 1);
			const wx = txf - tx0;
			const wy = tyf - ty0;

			const v =
				(1 - wy) * ((1 - wx) * luts[ty0][tx0][g] + wx * luts[ty0][tx1][g]) +
				wy * ((1 - wx) * luts[ty1][tx0][g] + wx * luts[ty1][tx1][g]);

			const scale = v / Math.max(1, g);
			out[p] = Math.min(255, data[p] * scale);
			out[p + 1] = Math.min(255, data[p + 1] * scale);
			out[p + 2] = Math.min(255, data[p + 2] * scale);
			out[p + 3] = data[p + 3];
		}
	}

	return new ImageData(out, width, height);
}
