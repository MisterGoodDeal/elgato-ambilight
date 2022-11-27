export interface AppSettings {
  lights: LightSettings[];
  ambilightOn: boolean;
  refreshRate: number;
  maxBrightness: number;
  bounds: Electron.Rectangle;
  screenshot?: string;
}

export interface LightSettings {
  x: number;
  y: number;
  serialNumber: string;
}

export const defaultAppSettings = {
  // @ts-ignore
  lights: [],
  ambilightOn: false,
  maxBrightness: 100,
  bounds: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  refreshRate: 15,
};

export interface LightPosition {
  x?: number;
  y?: number;
  serialNumber: string;
}
