const API_BASE = import.meta.env.VITE_API_URL ?? "";

/**
 * Send an image Blob to the /predict endpoint.
 * @param {Blob} blob
 * @returns {Promise<{ status: string, prediction?: string, message?: string }>}
 */
export async function predictImage(blob) {
	const fd = new FormData();
	fd.append("image", blob, "image.png");

	const resp = await fetch(`${API_BASE}/predict`, { method: "POST", body: fd });

	if (!resp.ok) {
		const err = await resp.json().catch(() => ({}));
		throw new Error(err.message ?? `HTTP ${resp.status}`);
	}

	return resp.json();
}
