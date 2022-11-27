import { light } from "./lights.helpers";
const conv = require("color-temp");
const convertHexToRGB = (hex: string) => {
  var aRgbHex = hex.match(/.{1,2}/g);
  var aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
  ];
  return aRgb;
};

const calculateLuminance = (rgb: number[]) => {
  return Math.round(0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]);
};

const rgbToHsl = (rgb: number[]) => {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
};

export const colors = {
  hex2rgb: convertHexToRGB,
  rgb2temp: (rgb: number[]) => {
    const conversion = conv.rgb2temp(rgb);
    return conversion <= light.MIN_TEMPERATURE.kelvin
      ? light.MIN_TEMPERATURE.kelvin
      : conversion >= light.MAX_TEMPERATURE.kelvin
      ? light.MAX_TEMPERATURE.kelvin
      : conversion;
  },
  luminance: calculateLuminance,
  rgb2hsl: rgbToHsl,
};
