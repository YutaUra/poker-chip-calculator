import { render } from "preact"
import { App } from "./App"

const app = document.getElementById("app")

if (!app) throw new Error("#app element not found")

render(<App />, app)