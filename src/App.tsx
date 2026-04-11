import "./styles/global.css";
import { useRef } from "react";
import { ScanText, RefreshCw } from "lucide-react";
import {
	Navbar,
	Hero,
	DropZone,
	ImagePreview,
	ImageToolbar,
	PredictionResult,
	TipsCard,
	FeatureCards,
	Footer
} from "./components";
import { useImageEditor, usePredict } from "./hooks";

export default function App() {
	const canvasRef = useRef(null);

	const editor = useImageEditor(canvasRef);
	const predict = usePredict(canvasRef);

	const handleLoadFile = (file) => {
		editor.loadFile(file);
		predict.clearResult();
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #c8d8f0 0%, #ddd0ed 45%, #f0cece 100%)",
				fontFamily: "'Sora', sans-serif"
			}}
		>
			<Navbar />
			<Hero />

			{/* ── Main two-column layout ── */}
			<section
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 24,
					maxWidth: 1100,
					margin: "0 auto",
					padding: "0 24px 48px"
				}}
			>
				{/* Left column */}
				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					{/* Upload / Preview card */}
					<div style={card}>
						{!editor.imgEl ? (
							<DropZone onFile={handleLoadFile} />
						) : (
							<ImagePreview
								canvasRef={canvasRef}
								cropMode={editor.cropMode}
								cropRect={editor.cropRect}
								hasCropSelection={editor.hasCropSelection}
								claheLoading={editor.claheLoading}
								onMouseDown={editor.onMouseDown}
								onMouseMove={editor.onMouseMove}
								onMouseUp={editor.onMouseUp}
								onConfirmCrop={editor.confirmCrop}
								onCancelCrop={editor.cancelCrop}
								onClear={() => {
									editor.clear();
									predict.clearResult();
								}}
							/>
						)}
					</div>

					{/* Toolbar (only when an image is loaded) */}
					{editor.imgEl && (
						<ImageToolbar
							cropMode={editor.cropMode}
							rotation={editor.rotation}
							claheEnabled={editor.claheEnabled}
							onStartCrop={editor.startCropMode}
							onCancelCrop={editor.cancelCrop}
							onRotationChange={editor.setRotation}
							onToggleClahe={() => editor.setClaheEnabled((v) => !v)}
							onReset={editor.reset}
						/>
					)}

					{/* Predict button */}
					{editor.imgEl && (
						<button className="predict-btn" onClick={predict.predict} disabled={predict.loading || editor.claheLoading}>
							{predict.loading ? (
								<>
									<RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Memproses…
								</>
							) : (
								<>
									<ScanText size={18} /> Kenali Aksara Jawa
								</>
							)}
						</button>
					)}
				</div>

				{/* Right column */}
				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					<PredictionResult result={predict.result} loading={predict.loading} error={predict.error} />
					<TipsCard />
				</div>
			</section>

			<FeatureCards />
			<Footer />
		</div>
	);
}

// ── Shared card style ────────────────────────────────────────────────────────
const card = {
	background: "rgba(255,255,255,0.65)",
	backdropFilter: "blur(16px)",
	border: "1px solid rgba(255,255,255,0.8)",
	borderRadius: 20,
	padding: 28,
	boxShadow: "0 8px 32px rgba(100,120,200,0.08)"
};
