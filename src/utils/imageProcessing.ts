// ── Contrast Stretching ───────────────────────────────────────────────────────

export interface ContrastStretchOptions {
	/** Lower percentile for clipping (0–100). Default: 1 */
	lowPercentile?: number;
	/** Upper percentile for clipping (0–100). Default: 99 */
	highPercentile?: number;
}

/**
 * Linear contrast stretching per channel.
 * Clips at the given percentiles then linearly maps to [0, 255].
 */
export function applyContrastStretch(
	imageData: ImageData,
	{ lowPercentile = 1, highPercentile = 99 }: ContrastStretchOptions = {}
): ImageData {
	const { data, width, height } = imageData;
	const out = new Uint8ClampedArray(data);
	const total = width * height;

	// Build per-channel histograms
	const histR = new Int32Array(256);
	const histG = new Int32Array(256);
	const histB = new Int32Array(256);

	for (let i = 0; i < data.length; i += 4) {
		histR[data[i]]++;
		histG[data[i + 1]]++;
		histB[data[i + 2]]++;
	}

	const findPercentileValue = (hist: Int32Array, percentile: number): number => {
		const threshold = (percentile / 100) * total;
		let cumulative = 0;
		for (let v = 0; v < 256; v++) {
			cumulative += hist[v];
			if (cumulative >= threshold) return v;
		}
		return 255;
	};

	const rLow = findPercentileValue(histR, lowPercentile);
	const rHigh = findPercentileValue(histR, highPercentile);
	const gLow = findPercentileValue(histG, lowPercentile);
	const gHigh = findPercentileValue(histG, highPercentile);
	const bLow = findPercentileValue(histB, lowPercentile);
	const bHigh = findPercentileValue(histB, highPercentile);

	const stretch = (v: number, low: number, high: number): number => {
		if (high === low) return v;
		return Math.round(((v - low) / (high - low)) * 255);
	};

	for (let i = 0; i < data.length; i += 4) {
		out[i] = Math.min(255, Math.max(0, stretch(data[i], rLow, rHigh)));
		out[i + 1] = Math.min(255, Math.max(0, stretch(data[i + 1], gLow, gHigh)));
		out[i + 2] = Math.min(255, Math.max(0, stretch(data[i + 2], bLow, bHigh)));
		out[i + 3] = data[i + 3];
	}

	return new ImageData(out, width, height);
}

// ── Gamma Correction ──────────────────────────────────────────────────────────

/**
 * Apply gamma correction to ImageData.
 * gamma < 1 → brightens | gamma = 1 → no-op | gamma > 1 → darkens
 */
export function applyGammaCorrection(imageData: ImageData, gamma: number): ImageData {
	const { data, width, height } = imageData;
	const out = new Uint8ClampedArray(data);

	// Pre-compute LUT for performance
	const lut = new Uint8Array(256);
	for (let v = 0; v < 256; v++) {
		lut[v] = Math.round(255 * Math.pow(v / 255, gamma));
	}

	for (let i = 0; i < data.length; i += 4) {
		out[i] = lut[data[i]];
		out[i + 1] = lut[data[i + 1]];
		out[i + 2] = lut[data[i + 2]];
		out[i + 3] = data[i + 3];
	}

	return new ImageData(out, width, height);
}
