import { app, BrowserWindow, ipcMain, screen } from "electron";
import {
  ElgatoKeyLightController,
  KeyLight,
} from "@zunderscore/elgato-light-control";
import { light } from "./helpers/lights.helpers";
import { system } from "./helpers/system";
import { SetBrigthness, SetTemperature } from "./interfaces/lights";
const Store = require("electron-store");
const store = new Store();

const keyLightController = new ElgatoKeyLightController();

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const lights: KeyLight[] = JSON.parse(store.get("lights") || "[]");

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      /**
       * @see {@link https://github.com/electron/forge/issues/2931}
       */
      sandbox: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  console.log(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.once("dom-ready", () => {
    // Get primary screen resolution
    const bounds = screen.getPrimaryDisplay().bounds;
    mainWindow.webContents.send("set-screen-resolution", { bounds });
    mainWindow.webContents.send("lights", lights);
  });

  keyLightController.on("newKeyLight", (newKeyLight: KeyLight) => {
    if (
      !lights.find((l) => l.info.serialNumber === newKeyLight.info.serialNumber)
    ) {
      console.log("newKeyLight", newKeyLight.name);
      lights.push(newKeyLight);
      store.set("lights", JSON.stringify(lights));
      mainWindow.webContents.send("lights", lights);
    } else {
      // Update light
      console.log("updateLight", newKeyLight.name);

      const index = lights.findIndex(
        (l) => l.info.serialNumber === newKeyLight.info.serialNumber
      );
      lights[index] = newKeyLight;
      store.set("lights", JSON.stringify(lights));
      mainWindow.webContents.send("lights", lights);
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("send-resolution", (event, params) => {
  console.log("send-resolution", params);
});

ipcMain.on("identify-light", async (event, index) => {
  console.log("identify-light", index);
  const l = lights[index];
  const initialState: number = l.options.lights[0].on ?? 0;
  console.log("initialState", initialState);
  for (let i = 0; i < 3; i++) {
    light.state({
      lightController: keyLightController,
      index,
      state: 1,
      initialOptions: l.options,
    });
    await system.wait(500);
    light.state({
      lightController: keyLightController,
      index,
      state: 0,
      initialOptions: l.options,
    });
    await system.wait(500);
  }
});

ipcMain.on("set-light-brightness", (event, params: SetBrigthness) => {
  console.log("set-light-brightness", params);
  const initialOptions = lights[params.index].options;
  initialOptions.lights[0].on = 1;
  light.brightness({
    lightController: keyLightController,
    index: params.index,
    brightness: params.brightness,
    initialOptions,
  });
});

ipcMain.on("set-light-temperature", (event, params: SetTemperature) => {
  console.log("set-light-temperature", params);
  const initialOptions = lights[params.index].options;
  initialOptions.lights[0].on = 1;
  light.temperature({
    lightController: keyLightController,
    index: params.index,
    temperature: params.temperature,
    initialOptions,
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.