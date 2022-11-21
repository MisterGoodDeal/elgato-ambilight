// See the Electron documentation for details on how to use preload scripts:

import { KeyLight } from "@zunderscore/elgato-light-control";
import { Bounds } from "./interfaces/screen";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
console.log("😸 Hello from preload!");

const { contextBridge, ipcRenderer } = require("electron");

const sendResolution = (params: { width: number; height: number }) => {
  console.log("sendResolution from preload", params);
  ipcRenderer.send("send-resolution", params);
};

const onResolutionReceived = (callback: (params: Bounds) => void) => {
  ipcRenderer.on("set-screen-resolution", (event, params) => {
    callback(params);
  });
};

const onNewKeyLight = (callback: (params: KeyLight[]) => void) => {
  ipcRenderer.on("lights", (event, params) => {
    callback(params);
  });
};

const identifyLight = (index: number) => {
  ipcRenderer.send("identify-light", index);
};

const indexBridge = {
  sendResolution,
  onResolutionReceived,
  onNewKeyLight,
  identifyLight,
};

contextBridge.exposeInMainWorld("Bridge", indexBridge);
