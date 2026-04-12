const NAV_LINKS = [
	{ name: "Model", href: "#model" },
	{ name: "Dataset", href: "https://drive.google.com/drive/folders/1F-Nur1FKPLDoY68k3_qi8veBSDO59jON?usp=sharing" },
	{ name: "Code", href: "https://github.com/adeprastya/htr-javanese-model" }
] as const;

export function Navbar() {
	return (
		<nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-neutral-100/40 backdrop-blur-md border-b border-neutral-200/60">
			<span className="font-bold text-base text-neutral-800 tracking-tight">JavaneseScript</span>

			<div className="flex items-center gap-6 md:gap-8">
				{NAV_LINKS.map((link) => (
					<a
						key={link.href}
						href={link.href}
						target="_blank"
						className="text-xs md:text-sm font-medium text-neutral-600 hover:text-sky-500 cursor-pointer transition-colors duration-150"
					>
						{link.name}
					</a>
				))}
			</div>
		</nav>
	);
}
