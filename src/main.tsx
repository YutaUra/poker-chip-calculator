import { App } from "./App"
import {createRoot} from "react-dom/client"

const app = document.getElementById("app")

if (!app) throw new Error("#app element not found")

createRoot(app).render(<App />)