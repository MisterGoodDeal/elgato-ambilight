// Delay function
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const system = {
  wait: delay,
};
