import { ScanText, Check, X, RefreshCw } from "lucide-react";

/**
 * @param {{
 *   result: object | null,
 *   loading: boolean,
 *   error: string | null,
 * }} props
 */
export function PredictionResult({ result, loading, error }) {
	return (
		<div
			style={{
				background: "rgba(255,255,255,0.65)",
				backdropFilter: "blur(16px)",
				border: "1px solid rgba(255,255,255,0.8)",
				borderRadius: 20,
				padding: 28,
				boxShadow: "0 8px 32px rgba(100,120,200,0.08)",
				minHeight: 280
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
				<ScanText size={16} color="#4f6ef7" />
				<span style={{ fontWeight: 600, fontSize: 16, color: "#1e293b" }}>Hasil Pengenalan</span>
			</div>

			{!result && !loading && !error && <EmptyState />}
			{loading && <LoadingState />}
			{error && !loading && <ErrorState message={error} />}
			{result &&
				!loading &&
				(result.status === "success" ? (
					<SuccessState prediction={result.prediction} />
				) : (
					<ErrorState message={result.message} />
				))}
		</div>
	);
}

function EmptyState() {
	return (
		<div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
			<div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>ꦲꦏ꧀ꦱꦫ</div>
			<p style={{ fontFamily: "'Fira Code', monospace", fontSize: 13 }}>
				Upload gambar untuk
				<br />
				melihat hasil transkripsi
			</p>
		</div>
	);
}

function LoadingState() {
	return (
		<div style={{ textAlign: "center", padding: "40px 0" }}>
			<div
				style={{
					width: 48,
					height: 48,
					border: "3px solid rgba(79,110,247,0.2)",
					borderTopColor: "#4f6ef7",
					borderRadius: "50%",
					margin: "0 auto 16px",
					animation: "spin 0.8s linear infinite"
				}}
			/>
			<p style={{ color: "#64748b", fontSize: 14, animation: "pulse 1.5s ease infinite" }}>Mengenali aksara…</p>
		</div>
	);
}

function SuccessState({ prediction }) {
	return (
		<div style={{ animation: "fadeIn 0.3s ease" }}>
			<div
				style={{
					background: "rgba(34,197,94,0.08)",
					border: "1px solid rgba(34,197,94,0.2)",
					borderRadius: 12,
					padding: "12px 16px",
					marginBottom: 16,
					display: "flex",
					alignItems: "center",
					gap: 8
				}}
			>
				<Check size={15} color="#16a34a" />
				<span style={{ fontSize: 13, color: "#15803d", fontWeight: 500 }}>Pengenalan berhasil</span>
			</div>
			<div
				style={{
					background: "rgba(15,23,42,0.04)",
					borderRadius: 12,
					padding: 20,
					border: "1px solid rgba(15,23,42,0.08)"
				}}
			>
				<p
					style={{
						fontSize: 11,
						color: "#94a3b8",
						fontWeight: 500,
						marginBottom: 10,
						letterSpacing: "0.5px",
						textTransform: "uppercase"
					}}
				>
					Transliterasi Latin
				</p>
				<p
					style={{
						fontFamily: "'Fira Code', monospace",
						fontSize: 22,
						fontWeight: 500,
						color: "#1e293b",
						letterSpacing: 2,
						wordBreak: "break-all"
					}}
				>
					{prediction || "—"}
				</p>
			</div>
		</div>
	);
}

function ErrorState({ message }) {
	return (
		<div
			style={{
				background: "rgba(239,68,68,0.08)",
				border: "1px solid rgba(239,68,68,0.2)",
				borderRadius: 12,
				padding: 16
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
				<X size={15} color="#dc2626" />
				<span style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>Error</span>
			</div>
			<p style={{ fontSize: 14, color: "#7f1d1d", fontFamily: "'Fira Code', monospace" }}>{message}</p>
		</div>
	);
}
