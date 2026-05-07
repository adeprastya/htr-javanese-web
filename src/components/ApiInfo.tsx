import { Globe, LayoutGrid, Check, Copy } from "lucide-react";
import { useState } from "react";

interface Endpoint {
	method: string;
	path: string;
	description: string;
}

export function ApiInfo() {
	const baseUrl = import.meta.env.VITE_API_URL || "https://htr-javanese-api.onrender.com";
	const [copied, setCopied] = useState(false);

	const endpoints: Endpoint[] = [
		{ method: "GET", path: "/", description: "Cek status API" },
		{ method: "POST", path: "/predict", description: "Transkripsi citra Aksara Jawa" }
	];

	const handleCopy = () => {
		navigator.clipboard.writeText(baseUrl).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<div className="p-4 text-slate-700 bg-white/70 rounded-2xl">
			<div className="mb-8">
				<h2 className="text-lg font-bold mb-1">API Info</h2>
				<p className="text-sm text-slate-600">
					Integrasikan kemampuan pengenalan tulisan tangan otomatis ke dalam aplikasi, web, atau sistem pengarsipan Anda
					tanpa perlu membangun infrastruktur AI dari nol.
				</p>
			</div>

			{/* Base URL Section */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-3 text-slate-400">
					<Globe size={14} />
					<span className="text-[10px] font-bold uppercase tracking-widest">Base URL</span>
				</div>
				<div
					onClick={handleCopy}
					className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
				>
					<code className="text-sm font-mono text-slate-600">{baseUrl}</code>
					{copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
				</div>
			</div>

			{/* Endpoints Section */}
			<div>
				<div className="flex items-center gap-2 mb-3 text-slate-400">
					<LayoutGrid size={14} />
					<span className="text-[10px] font-bold uppercase tracking-widest">Endpoints</span>
				</div>
				<div className="space-y-3">
					{endpoints.map((ep, i) => (
						<div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-slate-100">
							<div className="flex items-center gap-3">
								<span
									className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
										ep.method === "POST" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
									}`}
								>
									{ep.method}
								</span>
								<code className="text-sm font-mono font-medium">{ep.path}</code>
							</div>
							<p className="text-sm text-slate-500">{ep.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
