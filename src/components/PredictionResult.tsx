import { useState } from "react";
import { ScanText, Check, X, Copy } from "lucide-react";

interface PredictionResponse {
	status: "success" | "error";
	prediction?: string;
	message?: string;
}

interface PredictionResultProps {
	result: PredictionResponse | null;
	loading: boolean;
	error: string | null;
}

export function PredictionResult({ result, loading, error }: PredictionResultProps) {
	return (
		<div className="bg-neutral-100/65 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-7 shadow-sm min-h-72">
			<div className="flex items-center gap-2 mb-5">
				<ScanText size={16} className="text-sky-500" />
				<span className="font-sans font-semibold text-base text-neutral-800">Hasil Pengenalan</span>
			</div>

			{!result && !loading && !error && <EmptyState />}
			{loading && <LoadingState />}
			{error && !loading && <ErrorState message={error} />}
			{result &&
				!loading &&
				(result.status === "success" ? (
					<SuccessState prediction={result.prediction} />
				) : (
					<ErrorState message={result.message ?? "Terjadi kesalahan"} />
				))}
		</div>
	);
}

function EmptyState() {
	return (
		<div className="text-center py-10 text-neutral-400">
			<div className="font-javanese text-4xl mb-3 opacity-40">ꦲꦏ꧀ꦱꦫ</div>
			<p className="font-mono text-xs sm:text-sm leading-relaxed">
				Upload gambar untuk
				<br />
				melihat hasil transkripsi
			</p>
		</div>
	);
}

function LoadingState() {
	return (
		<div className="text-center py-10">
			<div className="w-12 h-12 rounded-full border-2 border-sky-200 border-t-sky-500 animate-spin mx-auto mb-4" />
			<p className="text-neutral-500 text-xs sm:text-sm animate-pulse">Mengenali aksara…</p>
		</div>
	);
}

interface SuccessStateProps {
	prediction?: string;
}

function SuccessState({ prediction }: SuccessStateProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (!prediction) return;
		navigator.clipboard.writeText(prediction).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
				<Check size={15} className="text-green-600" />
				<span className="text-sm text-green-700 font-medium">Pengenalan berhasil</span>
			</div>

			<div className="group relative bg-neutral-100 border border-neutral-200 rounded-xl p-5 hover:border-sky-300 transition-colors">
				<div className="flex justify-between items-start mb-2">
					<p className="text-[10px] uppercase text-neutral-400 font-bold tracking-[0.15em]">Transkripsi</p>

					{prediction && (
						<button
							onClick={handleCopy}
							className="p-1.5 rounded-md hover:bg-white border border-transparent hover:border-neutral-200 text-neutral-400 hover:text-sky-500 transition-all"
							title="Salin hasil"
						>
							{copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
						</button>
					)}
				</div>

				<p className="font-javanese text-lg sm:text-xl font-medium text-neutral-800 tracking-widest break-all">
					{prediction ?? "—"}
				</p>

				{copied && (
					<span className="absolute top-2 right-10 text-[10px] font-mono text-green-600 animate-in fade-in zoom-in duration-200">
						tersalin!
					</span>
				)}
			</div>
		</div>
	);
}

interface ErrorStateProps {
	message: string;
}

function ErrorState({ message }: ErrorStateProps) {
	return (
		<div className="bg-red-50 border border-red-200 rounded-xl p-4">
			<div className="flex items-center gap-2 mb-1.5">
				<X size={15} className="text-red-600" />
				<span className="text-xs sm:text-sm text-red-600 font-semibold">Mohon maaf, terjadi kesalahan</span>
			</div>
			<p className="text-xs sm:text-sm text-red-900 font-mono">{message}</p>
		</div>
	);
}
