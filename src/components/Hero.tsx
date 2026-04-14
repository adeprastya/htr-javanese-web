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
	{ char: "ꦲ", top: "-15%", left: "-8%", size: 48, delay: 0.2 },
	{ char: "ꦕ", top: "-20%", right: "-11%", size: 52, delay: 1.2 },
	{ char: "ꦏ", top: "90%", right: "-9%", size: 45, delay: 0.6 },
	{ char: "ꦢ", top: "90%", left: "-8%", size: 50, delay: 0.8 }
];

function FloatingBadge({ char, top, left, right, size, delay }: Badge) {
	return (
		<div
			className="scale-60 sm:scale-80 md:scale-100 absolute flex items-center justify-center rounded-xl bg-neutral-100/55 backdrop-blur-sm border border-neutral-200/80 shadow-sm select-none z-10 animate-[floatBadge_4s_ease-in-out_infinite_alternate]"
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
		<section className="text-center px-6 pt-16 pb-14 overflow-hidden flex flex-col items-center gap-6">
			{/* Badge pill */}
			<div className="inline-flex items-center gap-2 bg-sky-100/20 border border-sky-500/25 rounded-full px-4 py-1.5 font-mono text-xs sm:text-sm text-sky-500">
				<Zap size={14} />
				Hybrid Deep Learning!
			</div>

			{/* Heading */}
			<div className="relative max-w-[70vw]">
				{BADGES.map((badge, i) => (
					<FloatingBadge key={i} {...badge} />
				))}

				<h1 className=" font-bold leading-tight tracking-tight text-3xl sm:text-5xl md:text-7xl text-neutral-800">
					Sistem AI Pengenalan Teks Aksara Jawa Nglegena
				</h1>
			</div>

			{/* Subtitle */}
			<p className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
				Kenali dan transliterasikan gambar teks Aksara Jawa secara instan menggunakan arsitektur jaringan saraf canggih
				dengan metode modern
			</p>
		</section>
	);
}
