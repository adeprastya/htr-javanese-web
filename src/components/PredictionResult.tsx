import { ScanText, Check, X } from "lucide-react";

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
	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
			<div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
				<Check size={15} className="text-green-600" />
				<span className="text-sm text-green-700 font-medium">Pengenalan berhasil</span>
			</div>

			<div className="bg-neutral-100 border border-neutral-200 rounded-xl p-5">
				<p className="text-xs sm:text-sm text-neutral-400 font-medium tracking-wide mb-2">Transkripsi</p>
				<p className="font-javanese text-lg sm:text-xl font-medium text-neutral-800 tracking-widest break-all">
					{prediction ?? "—"}
				</p>
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
