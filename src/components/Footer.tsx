export function Footer() {
	return (
		<footer
			style={{
				borderTop: "1px solid rgba(255,255,255,0.5)",
				background: "rgba(255,255,255,0.3)",
				backdropFilter: "blur(8px)",
				padding: "18px 48px",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center"
			}}
		>
			<span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>JavaneseScript.ai</span>
			<span style={{ fontSize: 13, color: "#64748b" }}>2026 – Ade Fathoni Prastya</span>
		</footer>
	);
}
