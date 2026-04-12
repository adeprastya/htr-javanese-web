import { Zap } from "lucide-react";

interface Badge {
	char: string;
	top: string;
	left?: string;
	right?: string;
	size: number;
	delay: number;
}

const BADGES: Badge[] = [
	{ char: "ꦲ", top: "14%", left: "12%", size: 48, delay: 0 },
	{ char: "ꦤ", top: "28%", left: "5%", size: 44, delay: 0.6 },
	{ char: "ꦕ", top: "13%", right: "8%", size: 52, delay: 0.3 },
	{ char: "ꦫ", top: "30%", right: "4%", size: 44, delay: 0.9 },
	{ char: "ꦏ", top: "48%", left: "3%", size: 40, delay: 1.2 },
	{ char: "ꦢ", top: "52%", right: "3%", size: 40, delay: 0.5 }
];

function FloatingBadge({ char, top, left, right, size, delay }: Badge) {
	return (
		<div
			className="scale-50 sm:scale-100 absolute flex items-center justify-center rounded-xl bg-neutral-100/55 backdrop-blur-sm border border-neutral-200/80 shadow-sm select-none z-10 animate-[floatBadge_4s_ease-in-out_infinite_alternate]"
			style={{
				top,
				left,
				right,
				width: size + 16,
				height: size + 16,
				fontSize: size * 0.65,
				animationDelay: `${delay}s`
			}}
		>
			<span className="font-javanese">{char}</span>
		</div>
	);
}

export function Hero() {
	return (
		<section className="relative text-center px-6 pt-16 pb-14 overflow-hidden">
			{BADGES.map((badge, i) => (
				<FloatingBadge key={i} {...badge} />
			))}

			{/* Badge pill */}
			<div className="inline-flex items-center gap-2 bg-sky-100/20 border border-sky-500/25 rounded-full px-4 py-1.5 text-sm font-mono font-medium text-sky-500 mb-6">
				<Zap size={14} />
				Hybrid Deep Learning Model!
			</div>

			{/* Heading */}
			<h1
				className="font-bold text-neutral-800 leading-tight tracking-tight mb-5"
				style={{ fontSize: "clamp(36px, 5vw, 58px)", letterSpacing: "-1px" }}
			>
				Sistem AI Pengenalan Teks
				<br />
				Aksara Jawa Nglegena
			</h1>

			{/* Subtitle */}
			<p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
				Kenali dan transliterasikan gambar teks Aksara Jawa secara instan menggunakan arsitektur jaringan saraf canggih
				dengan metode modern
			</p>
		</section>
	);
}
