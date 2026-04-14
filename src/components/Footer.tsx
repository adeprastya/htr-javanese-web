export function Footer() {
	return (
		<footer className="flex items-center justify-between px-3 sm:px-6 md:px-12 py-4 border-t border-neutral-200/50 bg-neutral-100/30 backdrop-blur-sm">
			<span className="font-bold text-xs sm:text-sm text-neutral-800">JavaneseScript</span>
			<a
				href="https://www.linkedin.com/in/adefathoniprastya/"
				target="_blank"
				className="text-xs underline text-neutral-500 hover:text-sky-700"
			>
				{new Date().getFullYear()} – Ade Prastya
			</a>
		</footer>
	);
}
