interface Feature {
	icon: string;
	title: string;
	desc: string;
}

const FEATURES: Feature[] = [
	{ icon: "⚙️", title: "Model Hybrid", desc: "Optimasi teks tulisan tangan" },
	{ icon: "⚡", title: "Inferensi Cepat", desc: "Proses prediksi dibawah 20ms" },
	{ icon: "🎯", title: "95% Akurat", desc: "Diuji dengan tulisan bervariasi" }
];

export function FeatureCards() {
	return (
		<section className="max-w-screen mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
			{FEATURES.map(({ icon, title, desc }) => (
				<div
					key={title}
					className="flex items-center gap-4 bg-neutral-100/55 backdrop-blur-md border border-neutral-200/75 rounded-xl px-2 sm:px-4 py-2 sm:py-4"
				>
					<div className="flex items-center justify-center shrink-0 w-11 h-11 text-xl bg-sky-500/10 rounded-lg">
						{icon}
					</div>
					<div>
						<p className="font-sans font-semibold text-sm text-neutral-800 mb-0.5">{title}</p>
						<p className="font-mono text-xs text-neutral-500">{desc}</p>
					</div>
				</div>
			))}
		</section>
	);
}
