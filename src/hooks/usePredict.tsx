import { useState, useCallback } from "react";
import { predictImage } from "../utils/api";
import { canvasToBlob } from "../utils/canvas";

interface PredictionResponse {
	status: "success" | "error";
	prediction?: string;
	message?: string;
}

export interface PredictState {
	result: PredictionResponse | null;
	loading: boolean;
	error: string | null;
	predict: () => Promise<void>;
	clearResult: () => void;
}

export function usePredict(canvasRef: React.RefObject<HTMLCanvasElement>): PredictState {
	const [result, setResult] = useState<PredictionResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const predict = useCallback(async () => {
		if (!canvasRef.current) return;
		setLoading(true);
		setResult(null);
		setError(null);

		try {
			const blob = await canvasToBlob(canvasRef.current);
			const data = await predictImage(blob);
			setResult(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Gagal terhubung ke server");
		} finally {
			setLoading(false);
		}
	}, [canvasRef]);

	const clearResult = useCallback(() => {
		setResult(null);
		setError(null);
	}, []);

	return { result, loading, error, predict, clearResult };
}
