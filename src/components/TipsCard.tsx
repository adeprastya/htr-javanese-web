import { ChevronRight, Info } from "lucide-react";

const TIPS = [
	"Gunakan CLAHE jika kontras gambar rendah",
	"Crop area tulisan sebelum prediksi",
	"Rotasi jika teks miring"
];

export function TipsCard() {
	return (
		<div
			style={{
				background: "linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)",
				borderRadius: 20,
				padding: 24,
				boxShadow: "0 8px 32px rgba(79,110,247,0.25)"
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
				<Info size={16} color="rgba(255,255,255,0.8)" />
				<span style={{ fontWeight: 600, fontSize: 15, color: "white" }}>Tips</span>
			</div>

			<p
				style={{
					fontFamily: "'Fira Code', monospace",
					fontSize: 13,
					color: "rgba(255,255,255,0.85)",
					lineHeight: 1.7
				}}
			>
				Untuk hasil pengenalan yang lebih baik, pastikan tulisan mendapat pencahayaan yang baik dan kamera sejajar
				dengan permukaan
			</p>

			<div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
				{TIPS.map((tip) => (
					<div key={tip} style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<ChevronRight size={13} color="rgba(255,255,255,0.6)" />
						<span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{tip}</span>
					</div>
				))}
			</div>
		</div>
	);
}
