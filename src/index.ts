import { app, BrowserWindow, ipcMain, screen, desktopCapturer } from "electron";
import {
  ElgatoKeyLightController,
  KeyLight,
} from "@zunderscore/elgato-light-control";
import { light } from "./helpers/lights.helpers";
import { system, WorkerMessage, WorkerResponse } from "./helpers/system";
import { SetBrigthness, SetTemperature } from "./interfaces/lights";
import {
  AppSettings,
  defaultAppSettings,
  LightPosition,
  LightSettings,
} from "./interfaces/app";
import { colors } from "./helpers/colors";
import { light as light_helper } from "./helpers/lights.helpers";
const { Worker, isMainThread, parentPort } = require("node:worker_threads");

// @ts-ignore
let worker;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (isMainThread) {
  const robotjs = require("robotjs");

  const Store = require("electron-store");
  const store = new Store();

  const keyLightController = new ElgatoKeyLightController();
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require("electron-squirrel-startup")) {
    app.quit();
  }

  const lights: KeyLight[] = JSON.parse(store.get("lights") || "[]");
  let appSettings: AppSettings = JSON.parse(
    store.get("settings") || JSON.stringify(defaultAppSettings)
  );

  const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      icon: "src/assets/icon/icon.ico",
      height: system.WINDOW_HEIGHT,
      width: system.WINDOW_WIDTH,
      minHeight: system.WINDOW_HEIGHT * 0.75,
      minWidth: system.WINDOW_WIDTH,
      autoHideMenuBar: true,
      webPreferences: {
        /**
         * @see {@link https://github.com/electron/forge/issues/2931}
         */
        sandbox: false,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.webContents.once("dom-ready", async () => {
      // Screenshot the desktop
      desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
        appSettings.screenshot = sources[0].thumbnail.toDataURL();
      });

      // Get primary screen resolution
      const bounds = screen.getPrimaryDisplay().bounds;
      appSettings.bounds = bounds;
      store.set("settings", JSON.stringify(appSettings));
      mainWindow.webContents.send("set-settings", appSettings);
      mainWindow.webContents.send("lights", lights);

      // Settings some default values just in case
      appSettings.ambilightOn === undefined
        ? (appSettings.ambilightOn = false)
        : null;
      appSettings.refreshRate === undefined
        ? (appSettings.refreshRate = 15)
        : null;
      store.set("settings", JSON.stringify(appSettings));

      // Start the worker for refreshing the ambilight
      worker = new Worker(__filename);
      worker.on("online", () => {
        // @ts-ignore
        worker.postMessage({
          refreshRate: appSettings.refreshRate,
          ambilightActivated: appSettings.ambilightOn,
        });
      });
      worker.on("error", (err: any) => {
        console.error(err);
      });
      worker.on("exit", (code: any) => {
        console.warn(`Worker stopped with exit code ${code}`);
      });
      worker.on("message", (message: WorkerResponse) => {
        if (message.refesh) {
          appSettings.lights.forEach((light: LightSettings) => {
            const rgb = colors.hex2rgb(robotjs.getPixelColor(light.x, light.y));
            const luminance = Math.round(
              (colors.luminance(rgb) / 100) * appSettings.maxBrightness
            );
            const temp = colors.rgb2temp(rgb);
            const closest = light_helper.closest(temp);
            const index = lights.findIndex(
              (l) => l.info.serialNumber === light.serialNumber
            );
            light_helper.update({
              lightController: keyLightController,
              index,
              initialOptions: lights[index].options,
              brightness: luminance,
              temperature: closest,
            });
          });
        }
      });
    });

    keyLightController.on("newKeyLight", (newKeyLight: KeyLight) => {
      if (
        !lights.find(
          (l) => l.info.serialNumber === newKeyLight.info.serialNumber
        )
      ) {
        lights.push(newKeyLight);
        store.set("lights", JSON.stringify(lights));
        mainWindow.webContents.send("lights", lights);
      } else {
        // Update light
        const index = lights.findIndex(
          (l) => l.info.serialNumber === newKeyLight.info.serialNumber
        );
        lights[index] = newKeyLight;
        store.set("lights", JSON.stringify(lights));
        mainWindow.webContents.send("lights", lights);
      }
    });
  };

  app.on("ready", createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.on("identify-light", async (event, serialNumber) => {
    const index = lights.findIndex((l) => l.info.serialNumber === serialNumber);
    const l = lights[index];
    const initialState: number = l.options.lights[0].on ?? 0;
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
    light.state({
      lightController: keyLightController,
      index,
      state: initialState,
      initialOptions: l.options,
    });
  });

  ipcMain.on("set-light-brightness", (event, params: SetBrigthness) => {
    // get the light index from serialNumber
    const index = lights.findIndex(
      (l) => l.info.serialNumber === params.serialNumber
    );
    const initialOptions = lights[index].options;
    initialOptions.lights[0].on = 1;
    light.brightness({
      lightController: keyLightController,
      index: index,
      brightness: params.brightness,
      initialOptions,
    });
  });

  ipcMain.on("set-light-temperature", (event, params: SetTemperature) => {
    const index = lights.findIndex(
      (l) => l.info.serialNumber === params.serialNumber
    );
    const initialOptions = lights[index].options;
    initialOptions.lights[0].on = 1;
    light.temperature.change({
      lightController: keyLightController,
      index: index,
      temperature: params.temperature,
      initialOptions,
    });
  });

  ipcMain.on("set-light-position", (event, params: LightPosition) => {
    var hex;
    // get the index of the light in the light settings array
    if (appSettings.lights === undefined) {
      const lightSettings: LightSettings = {
        serialNumber: params.serialNumber,
        x: params.x ?? 0,
        y: params.y ?? 0,
      };
      hex = robotjs.getPixelColor(0, 0);
      appSettings.lights = [lightSettings];
    } else {
      const index = appSettings.lights.findIndex(
        (l) => l.serialNumber === params.serialNumber
      );
      if (index === -1) {
        const lightSettings: LightSettings = {
          serialNumber: params.serialNumber,
          x: params.x ?? 0,
          y: params.y ?? 0,
        };
        hex = robotjs.getPixelColor(params.x ?? 0, params.y ?? 0);

        appSettings.lights.push(lightSettings);
      } else {
        if (params.x !== undefined) {
          appSettings.lights[index].x = params.x;
          hex = robotjs.getPixelColor(params.x, appSettings.lights[index].y);
        }
        if (params.y !== undefined) {
          appSettings.lights[index].y = params.y;
          hex = robotjs.getPixelColor(appSettings.lights[index].x, params.y);
        }
      }
    }
    store.set("settings", JSON.stringify(appSettings));
  });

  ipcMain.on("set-app-settings", (event, params: Partial<AppSettings>) => {
    const tempAppSettings = { ...appSettings, ...params };
    store.set("settings", JSON.stringify(tempAppSettings));
    appSettings = tempAppSettings;
    // @ts-ignore
    worker.postMessage({
      refreshRate: params.refreshRate,
      ambilightActivated: params.ambilightOn,
    });
  });
} else {
  let refreshRate = 15;
  let ambilightActivated = false;

  const refresh = () => {
    ambilightActivated ? parentPort.postMessage({ refesh: true }) : null;
    setTimeout(refresh, 1000 / refreshRate);
  };

  refresh();

  parentPort.on("message", (rawMessage: WorkerMessage) => {
    parentPort.postMessage(rawMessage);
    if (rawMessage.refreshRate !== undefined) {
      refreshRate = rawMessage.refreshRate;
    }
    if (rawMessage.ambilightActivated !== undefined) {
      ambilightActivated = rawMessage.ambilightActivated;
    }
  });
}
