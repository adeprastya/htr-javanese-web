import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface DropZoneBoxProps {
	onFile: (file: File) => void;
}

export function DropZoneBox({ onFile }: DropZoneBoxProps) {
	const [dragOver, setDragOver] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragOver(false);
		const file = e.dataTransfer.files[0];
		if (file) onFile(file);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) onFile(file);
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
				className={`rounded-2xl px-6 py-14 text-center cursor-pointer transition-all duration-200 border-2 border-dashed
					${
						dragOver
							? "border-sky-500 bg-sky-500/5"
							: "border-neutral-300/60 bg-transparent hover:border-sky-400/50 hover:bg-sky-500/5"
					}`}
			>
				<div className="flex items-center justify-center w-14 h-14 bg-sky-500/10 rounded-2xl mx-auto mb-4">
					<Upload size={26} className="text-sky-500" />
				</div>

				<p className="font-semibold text-lg text-neutral-800 mb-2">Drag &amp; Drop Gambar</p>
				<p className="text-sm text-neutral-400 mb-5">Mendukung format jpg, jpeg, dan png</p>

				<button
					onClick={(e) => {
						e.stopPropagation();
						fileRef.current?.click();
					}}
					className="bg-linear-to-br from-sky-500 to-violet-500 text-neutral-100 font-semibold text-[15px] px-6 py-2.5 rounded-xl cursor-pointer border-none transition-opacity duration-150 hover:opacity-90"
				>
					Pilih Gambar
				</button>
			</div>

			<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
		</>
	);
}
