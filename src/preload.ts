// See the Electron documentation for details on how to use preload scripts:

import { KeyLight } from "@zunderscore/elgato-light-control";
import { LightPosition } from "./interfaces/app";
import { SetBrigthness, SetTemperature } from "./interfaces/lights";
import { Bounds } from "./interfaces/screen";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
console.log("😸 Hello from preload!");

const { contextBridge, ipcRenderer } = require("electron");

const sendResolution = (params: { width: number; height: number }) => {
  console.log("sendResolution from preload", params);
  ipcRenderer.send("send-resolution", params);
};

const onSettingsReceived = (callback: (params: Bounds) => void) => {
  ipcRenderer.on("set-settings", (event, params) => {
    callback(params);
  });
};

const onNewKeyLight = (callback: (params: KeyLight[]) => void) => {
  ipcRenderer.on("lights", (event, params) => {
    callback(params);
  });
};

const identifyLight = (serialNumber: string) => {
  ipcRenderer.send("identify-light", serialNumber);
};

const setLightBrightness = (params: SetBrigthness) => {
  ipcRenderer.send("set-light-brightness", params);
};

const setLightTemperature = (params: SetTemperature) => {
  ipcRenderer.send("set-light-temperature", params);
};

const setLightPosition = (params: LightPosition) => {
  ipcRenderer.send("set-light-position", params);
};

const indexBridge = {
  sendResolution,
  onSettingsReceived,
  onNewKeyLight,
  identifyLight,
  setLightBrightness,
  setLightTemperature,
  setLightPosition,
};

contextBridge.exposeInMainWorld("Bridge", indexBridge);
