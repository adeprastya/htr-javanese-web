interface PredictionResponse {
	status: "success" | "error";
	prediction?: string;
	message?: string;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function predictImage(blob: Blob): Promise<PredictionResponse> {
	const fd = new FormData();
	fd.append("image", blob, "image.png");

	const resp = await fetch(`${API_BASE}/predict`, { method: "POST", body: fd });

	if (!resp.ok) {
		const err = (await resp.json().catch(() => ({}))) as { message?: string };
		throw new Error(err.message ?? `HTTP ${resp.status}`);
	}

	return resp.json() as Promise<PredictionResponse>;
}
