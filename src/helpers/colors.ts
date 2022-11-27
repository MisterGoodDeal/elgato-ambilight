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
};
