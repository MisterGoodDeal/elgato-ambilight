export interface SetBrigthness {
  brightness: number;
  serialNumber: string;
}
export interface SetTemperature {
  temperature: number;
  serialNumber: string;
}

export interface CalculateKelvinReturn {
  value: number;
  text: string;
}
