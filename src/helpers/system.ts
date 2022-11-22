// Delay function
const WINDOW_WIDTH = 1200;
const WINDOW_HEIGHT = 800;

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const system = {
  wait: delay,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
};
