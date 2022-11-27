import keylight from "../assets/img/keylight.png";
import keylightAir from "../assets/img/keylight-air.png";
import keylightIcon from "../assets/img/keylight_icon.png";
import keylightAirIcon from "../assets/img/keylight_air_icon.png";
import {
  ElgatoKeyLightController,
  KeyLightOptions,
} from "@zunderscore/elgato-light-control";
import { LightSettings } from "../interfaces/app";

const MAX_TEMPERATURE = {
  kelvin: 7000,
  hex: "#96cfeb",
  rgba: "rgba(150, 207, 235, 255)",
  value: 344,
};

const MIN_TEMPERATURE = {
  kelvin: 2900,
  hex: "#fdb166",
  rgba: "rgba(253, 177, 102, 255)",
  value: 143,
};

// Temp between 7000k and 2900k
const TEMPERATURE_VALUES = [
  { value: 143, temp: 7000 },
  { value: 146, temp: 6850 },
  { value: 149, temp: 6700 },
  { value: 152, temp: 6600 },
  { value: 155, temp: 6450 },
  { value: 158, temp: 6350 },
  { value: 161, temp: 6200 },
  { value: 164, temp: 6100 },
  { value: 167, temp: 5900 },
  { value: 170, temp: 5800 },
  { value: 173, temp: 5700 },
  { value: 176, temp: 5600 },
  { value: 179, temp: 5500 },
  { value: 182, temp: 5450 },
  { value: 185, temp: 5350 },
  { value: 188, temp: 5250 },
  { value: 191, temp: 5200 },
  { value: 194, temp: 5100 },
  { value: 197, temp: 5050 },
  { value: 200, temp: 4950 },
  { value: 205, temp: 4900 },
  { value: 208, temp: 4800 },
  { value: 211, temp: 4750 },
  { value: 214, temp: 4650 },
  { value: 217, temp: 4600 },
  { value: 220, temp: 4550 },
  { value: 222, temp: 4500 },
  { value: 225, temp: 4450 },
  { value: 228, temp: 4400 },
  { value: 231, temp: 4350 },
  { value: 234, temp: 4250 },
  { value: 237, temp: 4200 },
  { value: 240, temp: 4150 },
  { value: 243, temp: 4100 },
  { value: 247, temp: 4050 },
  { value: 251, temp: 4000 },
  { value: 254, temp: 3950 },
  { value: 257, temp: 3900 },
  { value: 260, temp: 3850 },
  { value: 264, temp: 3800 },
  { value: 267, temp: 3750 },
  { value: 272, temp: 3700 },
  { value: 275, temp: 3650 },
  { value: 279, temp: 3600 },
  { value: 282, temp: 3550 },
  { value: 286, temp: 3500 },
  { value: 290, temp: 3450 },
  { value: 296, temp: 3400 },
  { value: 299, temp: 3350 },
  { value: 305, temp: 3300 },
  { value: 309, temp: 3250 },
  { value: 313, temp: 3200 },
  { value: 317, temp: 3150 },
  { value: 322, temp: 3100 },
  { value: 326, temp: 3050 },
  { value: 322, temp: 3000 },
  { value: 338, temp: 2950 },
  { value: 344, temp: 2900 },
];

const getClosestTemperatureValue = (value: number) => {
  const closest = TEMPERATURE_VALUES.reduce((prev, curr) => {
    return Math.abs(curr.temp - value) < Math.abs(prev.temp - value)
      ? curr
      : prev;
  });
  return closest.value;
};

const getImagePathFromName = (name: string) => {
  switch (name) {
    case "Elgato Key Light Air":
      return { product: keylightAir, icon: keylightAirIcon };
    case "Elgato Key Light":
      return { product: keylight, icon: keylightIcon };
    default:
      return { product: keylight, icon: keylightIcon };
  }
};

interface ChangeState {
  lightController: ElgatoKeyLightController;
  index: number;
  state: number;
  initialOptions: KeyLightOptions;
}

const changeLightState = (params: ChangeState) => {
  params.lightController
    .updateLightOptions(params.lightController.keyLights[params.index], {
      numberOfLights: params.initialOptions.numberOfLights,
      lights: [
        {
          on: params.state,
          brightness: params.initialOptions.lights[0].brightness,
          temperature: params.initialOptions.lights[0].temperature,
        },
      ],
    })
    .then(() => {
      console.log("Key Light state has been updated!");
    })
    .catch((e) => {
      console.error("Error: ", e);
    });
};

interface ChangeTemperature {
  lightController: ElgatoKeyLightController;
  temperature: number;
  index: number;
  initialOptions: KeyLightOptions;
}

const changeLightTemperature = (params: ChangeTemperature) => {
  params.lightController
    .updateLightOptions(params.lightController.keyLights[params.index], {
      numberOfLights: params.initialOptions.numberOfLights,
      lights: [
        {
          on: params.initialOptions.lights[0].on,
          brightness: params.initialOptions.lights[0].brightness,
          temperature: TEMPERATURE_VALUES[params.temperature].value,
        },
      ],
    })
    .then(() => {
      console.log("Key Light T° has been updated!");
    })
    .catch((e) => {
      console.error("Error: ", e);
    });
};

interface ChangeBrightness {
  lightController: ElgatoKeyLightController;
  brightness: number;
  index: number;
  initialOptions: KeyLightOptions;
}

const changeLightBrightness = (params: ChangeBrightness) => {
  params.lightController
    .updateLightOptions(params.lightController.keyLights[params.index], {
      numberOfLights: params.initialOptions.numberOfLights,
      lights: [
        {
          on: params.initialOptions.lights[0].on,
          brightness: params.brightness,
          temperature: params.initialOptions.lights[0].temperature,
        },
      ],
    })
    .then(() => {
      console.log("Key Light brightness has been updated!");
    })
    .catch((e) => {
      console.error("Error: ", e);
    });
};

interface UpdateTempAndBrightness {
  lightController: ElgatoKeyLightController;
  index: number;
  initialOptions: KeyLightOptions;
  brightness: number;
  temperature: number;
}
const updateTempAndBrightness = (params: UpdateTempAndBrightness) => {
  params.lightController
    .updateLightOptions(params.lightController.keyLights[params.index], {
      numberOfLights: params.initialOptions.numberOfLights,
      lights: [
        {
          on: 1,
          brightness: params.brightness,
          temperature: params.temperature,
        },
      ],
    })
    .then(() => {
      console.log("Key Light state has been updated w/ ambilight settings!");
    })
    .catch((e) => {
      console.error("Error: ", e);
    });
};

const calculateTemperatureFromValueToKelvin = (value: number) => {
  return {
    text: `${TEMPERATURE_VALUES[value]?.temp ?? 0}K`,
    value: TEMPERATURE_VALUES[value]?.temp ?? 0,
  };
};

// Get the index of the temperature value from the nearest value
const getTemperatureValueIndex = (value: number) => {
  const index = TEMPERATURE_VALUES.findIndex((item) => item.value === value);
  return index;
};

// Convert kelvin to RGB
const calculateTemperatureFromKelvinToRGB = (kelvin: number) => {
  const temp = kelvin / 100;

  // Calculate red
  let red;
  if (temp <= 66) {
    red = 255;
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    if (red < 0) red = 0;
    if (red > 255) red = 255;
  }

  // Calculate green
  let green;
  if (temp <= 66) {
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  } else {
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  }

  // Calculate blue
  let blue;
  if (temp >= 66) {
    blue = 255;
  } else {
    if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      if (blue < 0) blue = 0;
      if (blue > 255) blue = 255;
    }
  }
  const rgb = `rgb(${red}, ${green}, ${blue})`;
  return rgb;
};

const returnLightSettings = (params: {
  lightSettings: LightSettings[];
  serialNumber: string;
}): LightSettings => {
  const lightSettings = params.lightSettings.find(
    (item) => item.serialNumber === params.serialNumber
  );
  return lightSettings === undefined
    ? { x: 0, y: 0, serialNumber: params.serialNumber }
    : lightSettings;
};

export const light = {
  image: getImagePathFromName,
  state: changeLightState,
  temperature: {
    change: changeLightTemperature,
    calculateKelvin: calculateTemperatureFromValueToKelvin,
    calculateColor: (value: number) =>
      calculateTemperatureFromKelvinToRGB(
        calculateTemperatureFromValueToKelvin(value).value
      ),
  },
  brightness: changeLightBrightness,
  temperatureValueIndex: getTemperatureValueIndex,
  settings: returnLightSettings,
  update: updateTempAndBrightness,
  closest: getClosestTemperatureValue,
  MAX_TEMPERATURE,
  MIN_TEMPERATURE,
  TEMPERATURE_VALUES,
};
