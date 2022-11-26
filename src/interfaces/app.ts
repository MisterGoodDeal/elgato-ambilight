export interface AppSettings {
  lights: LightSettings[];
  ambilightOn: boolean;
  refreshRate: number;
  bounds: Electron.Rectangle;
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
