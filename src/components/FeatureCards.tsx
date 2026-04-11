const FEATURES = [
	{ icon: "⚙️", title: "Model Hybrid", desc: "Optimasi teks tulisan tangan" },
	{ icon: "⚡", title: "Inferensi Cepat", desc: "Proses prediksi dibawah 200ms" },
	{ icon: "🎯", title: "95% Akurat", desc: "Ditest dengan tulisan bervariasi" }
];

export function FeatureCards() {
	return (
		<section
			style={{
				maxWidth: 1100,
				margin: "0 auto",
				padding: "0 24px 64px",
				display: "grid",
				gridTemplateColumns: "repeat(3, 1fr)",
				gap: 16
			}}
		>
			{FEATURES.map(({ icon, title, desc }) => (
				<div
					key={title}
					style={{
						background: "rgba(255,255,255,0.55)",
						backdropFilter: "blur(12px)",
						border: "1px solid rgba(255,255,255,0.75)",
						borderRadius: 16,
						padding: "20px 22px",
						display: "flex",
						alignItems: "center",
						gap: 14
					}}
				>
					<div
						style={{
							fontSize: 22,
							width: 44,
							height: 44,
							background: "rgba(79,110,247,0.1)",
							borderRadius: 12,
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						{icon}
					</div>
					<div>
						<p style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", marginBottom: 3 }}>{title}</p>
						<p style={{ fontSize: 13, color: "#64748b" }}>{desc}</p>
					</div>
				</div>
			))}
		</section>
	);
}
