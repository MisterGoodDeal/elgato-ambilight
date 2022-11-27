const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const system = {
  wait: delay,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
};

export interface WorkerMessage {
  refreshRate?: number;
  ambilightActivated?: boolean;
}

export interface WorkerResponse {
  refesh?: boolean;
}
