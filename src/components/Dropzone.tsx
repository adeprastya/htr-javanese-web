import { useRef, useState } from "react";
import { Upload } from "lucide-react";

/**
 * @param {{ onFile: (file: File) => void }} props
 */
export function DropZone({ onFile }) {
	const [dragOver, setDragOver] = useState(false);
	const fileRef = useRef(null);

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		onFile(e.dataTransfer.files[0]);
	};

	return (
		<>
			<div
				onDrop={handleDrop}
				onDragOver={(e) => {
					e.preventDefault();
					setDragOver(true);
				}}
				onDragLeave={() => setDragOver(false)}
				onClick={() => fileRef.current?.click()}
				style={{
					border: `2px dashed ${dragOver ? "#4f6ef7" : "rgba(100,120,200,0.3)"}`,
					borderRadius: 14,
					padding: "56px 24px",
					textAlign: "center",
					cursor: "pointer",
					transition: "all 0.2s",
					background: dragOver ? "rgba(79,110,247,0.05)" : "transparent"
				}}
			>
				<div
					style={{
						width: 56,
						height: 56,
						background: "rgba(79,110,247,0.1)",
						borderRadius: 14,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 16px"
					}}
				>
					<Upload size={26} color="#4f6ef7" />
				</div>

				<p style={{ fontWeight: 600, fontSize: 18, color: "#1e293b", marginBottom: 8 }}>Drag &amp; Drop Gambar</p>
				<p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>Mendukung format jpg, jpeg, dan png</p>
				<button
					style={{
						background: "linear-gradient(135deg,#4f6ef7,#7c3aed)",
						color: "white",
						border: "none",
						borderRadius: 10,
						padding: "10px 24px",
						fontFamily: "'Sora',sans-serif",
						fontWeight: 600,
						fontSize: 15,
						cursor: "pointer"
					}}
				>
					Pilih Gambar
				</button>
			</div>

			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				style={{ display: "none" }}
				onChange={(e) => onFile(e.target.files[0])}
			/>
		</>
	);
}
