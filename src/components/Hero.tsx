import { Zap } from "lucide-react";

const BADGES = [
	{ char: "ꦲ", top: "14%", left: "12%", size: 48, delay: 0 },
	{ char: "ꦤ", top: "28%", left: "5%", size: 44, delay: 0.6 },
	{ char: "ꦕ", top: "13%", right: "8%", size: 52, delay: 0.3 },
	{ char: "ꦫ", top: "30%", right: "4%", size: 44, delay: 0.9 },
	{ char: "ꦏ", top: "48%", left: "3%", size: 40, delay: 1.2 },
	{ char: "ꦢ", top: "52%", right: "3%", size: 40, delay: 0.5 }
];

function FloatingBadge({ char, top, left, right, size, delay }) {
	return (
		<div
			style={{
				position: "absolute",
				top,
				left,
				right,
				width: size + 16,
				height: size + 16,
				background: "rgba(255,255,255,0.55)",
				backdropFilter: "blur(8px)",
				border: "1px solid rgba(255,255,255,0.8)",
				borderRadius: 14,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: size * 0.65,
				animation: `floatBadge 4s ease-in-out ${delay}s infinite alternate`,
				boxShadow: "0 4px 20px rgba(100,120,200,0.12)",
				userSelect: "none",
				zIndex: 1
			}}
		>
			{char}
		</div>
	);
}

export function Hero() {
	return (
		<section style={{ position: "relative", textAlign: "center", padding: "72px 24px 56px", overflow: "hidden" }}>
			{BADGES.map((b, i) => (
				<FloatingBadge key={i} {...b} />
			))}

			<div
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 8,
					background: "rgba(79,110,247,0.12)",
					border: "1px solid rgba(79,110,247,0.25)",
					borderRadius: 20,
					padding: "6px 16px",
					fontSize: 13,
					fontWeight: 500,
					color: "#4f6ef7",
					marginBottom: 24
				}}
			>
				<Zap size={14} /> Hybrid Deep Learning Model!
			</div>

			<h1
				style={{
					fontSize: "clamp(32px,5vw,58px)",
					fontWeight: 700,
					color: "#1e293b",
					lineHeight: 1.15,
					marginBottom: 20,
					letterSpacing: "-1px"
				}}
			>
				Sistem AI Pengenalan Teks
				<br />
				Aksara Jawa Nglegena
			</h1>

			<p style={{ color: "#475569", fontSize: 17, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
				Kenali dan transliterasikan gambar teks Aksara Jawa secara instan menggunakan arsitektur jaringan saraf canggih
				dengan metode modern
			</p>
		</section>
	);
}
