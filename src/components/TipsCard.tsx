import { ChevronRight, Info } from "lucide-react";

const TIPS = [
	"Gunakan CLAHE jika kontras gambar rendah",
	"Crop area tulisan sebelum prediksi",
	"Rotasi jika teks miring"
];

export function TipsCard() {
	return (
		<div className="rounded-2xl p-6 shadow-xl bg-linear-to-br from-sky-600 to-violet-600">
			<div className="flex items-center gap-2 mb-3">
				<Info size={16} className="text-neutral-50" />
				<span className="font-sans font-semibold text-base text-white">Tips</span>
			</div>

			<p className="font-mono text-xs sm:text-sm text-neutral-100 leading-relaxed">
				Untuk hasil pengenalan yang lebih baik, pastikan tulisan mendapat pencahayaan yang baik dan kamera sejajar
				dengan permukaan
			</p>

			<div className="font-mono mt-4 flex flex-col gap-2">
				{TIPS.map((tip) => (
					<div key={tip} className="flex items-center gap-2">
						<ChevronRight size={13} className="text-neutral-100 shrink-0" />
						<span className="text-xs sm:text-sm text-neutral-100">{tip}</span>
					</div>
				))}
			</div>
		</div>
	);
}
