import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";

const isDevMode = import.meta.env.VITE_MODE === "dev" || true;

createRoot(document.getElementById("root")!).render(
	<>
	{isDevMode && (
		<StrictMode>
			<App />
		</StrictMode>
	)}
	{!isDevMode && <App />}
	</>
);
