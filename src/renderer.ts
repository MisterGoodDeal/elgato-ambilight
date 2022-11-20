import "./index.css";
import "./bootstrap/bootstrap.min.css";
import "./bootstrap/bootstrap.bundle.min.js";
import { Bounds } from "./interfaces/screen";
import { KeyLight } from "@zunderscore/elgato-light-control";

console.log("👋 Hello from renderer!");

const btnSend = document.querySelector("#send-btn");
btnSend.addEventListener("click", () => {
  // @ts-ignore
  const width = document.querySelector("#screen-width").value;
  // @ts-ignore
  const height = document.querySelector("#screen-height").value;
  console.log("btnSend click", { width, height });
  // @ts-ignore
  window.Bridge.sendResolution({ width, height });
});

window.Bridge.onResolutionReceived((params: Bounds) => {
  document.querySelector("#screen-width").value = params.bounds.width;
  document.querySelector("#screen-height").value = params.bounds.height;
});

window.Bridge.onNewKeyLight((params: KeyLight) => {
  console.log("onNewKeyLight", params);
});
