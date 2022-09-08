import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {}

window.addEventListener("load", () => {
  console.log("content script loaded")
})