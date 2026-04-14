import { useRef } from "react";
import { ScanText, RefreshCw } from "lucide-react";
import {
	Navbar,
	Hero,
	DropZoneBox,
	ImagePreview,
	ImageToolbar,
	PredictionResult,
	TipsCard,
	FeatureCards,
	Footer
} from "./components";
import { useImageEditor, usePredict } from "./hooks";

export default function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const editor = useImageEditor(canvasRef as React.RefObject<HTMLCanvasElement>);
	const predict = usePredict(canvasRef as React.RefObject<HTMLCanvasElement>);

	const handleLoadFile = (file: File) => {
		editor.loadFile(file);
		predict.clearResult();
	};

	return (
		<div
			className="min-h-screen font-sans"
			style={{ background: "linear-gradient(135deg, #c8d8f0 0%, #ddd0ed 45%, #f0cece 100%)" }}
		>
			<Navbar />

			<Hero />

			<FeatureCards />

			{/* ── Main two-column layout ── */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen mx-auto px-6 pb-6">
				{/* Left column */}
				<div className="flex flex-col gap-4">
					{/* Upload / Preview card */}
					<div className="bg-neutral-100/65 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-7 shadow-sm">
						{!editor.imgEl ? (
							<DropZoneBox onFile={handleLoadFile} />
						) : (
							<ImagePreview
								canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
								cropMode={editor.cropMode}
								cropKey={editor.cropKey}
								processingLoading={editor.processingLoading}
								onConfirmCrop={editor.confirmCrop}
								onCancelCrop={editor.cancelCrop}
								onClear={() => {
									editor.clear();
									predict.clearResult();
								}}
							/>
						)}
					</div>

					{/* Toolbar */}
					{editor.imgEl && (
						<ImageToolbar
							cropMode={editor.cropMode}
							onStartCrop={editor.startCropMode}
							onCancelCrop={editor.cancelCrop}
							rotation={editor.rotation}
							onRotationChange={editor.setRotation}
							gamma={editor.gamma}
							onGammaChange={editor.setGamma}
							contrastEnabled={editor.contrastEnabled}
							onContrastToggle={() => editor.setContrastEnabled((v) => !v)}
							onReset={editor.reset}
						/>
					)}

					{/* Predict button */}
					{editor.imgEl && (
						<button
							onClick={predict.predict}
							disabled={predict.loading || editor.processingLoading}
							className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-base text-neutral-100 bg-linear-to-br from-sky-500 to-violet-500 hover:opacity-90 transition-opacity duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
						>
							{predict.loading ? (
								<>
									<RefreshCw size={18} className="animate-spin" />
									Memproses…
								</>
							) : (
								<>
									<ScanText size={18} />
									Kenali Aksara Jawa
								</>
							)}
						</button>
					)}
				</div>

				{/* Right column */}
				<div className="flex flex-col gap-4">
					<PredictionResult result={predict.result} loading={predict.loading} error={predict.error} />
					<TipsCard />
				</div>
			</section>

			<Footer />
		</div>
	);
}
