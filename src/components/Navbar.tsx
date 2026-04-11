const NAV_LINKS = ["Model", "Dataset", "Code"];

export function Navbar() {
	return (
		<nav
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "18px 48px",
				background: "rgba(255,255,255,0.45)",
				backdropFilter: "blur(12px)",
				borderBottom: "1px solid rgba(255,255,255,0.6)",
				position: "sticky",
				top: 0,
				zIndex: 100
			}}
		>
			<span style={{ fontWeight: 700, fontSize: 18, color: "#1e293b", letterSpacing: "-0.3px" }}>
				JavaneseScript.ai
			</span>
			<div style={{ display: "flex", gap: 32 }}>
				{NAV_LINKS.map((l) => (
					<span key={l} className="nav-link">
						{l}
					</span>
				))}
			</div>
		</nav>
	);
}
