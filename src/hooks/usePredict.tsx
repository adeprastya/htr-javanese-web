import { useState, useCallback } from "react";
import { predictImage } from "../utils/api";
import { canvasToBlob } from "../utils/canvas";

/**
 * Handles prediction state and API call.
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 */
export function usePredict(canvasRef) {
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

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
			setError(err.message ?? "Gagal terhubung ke server");
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
