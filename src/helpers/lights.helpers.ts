import keylight from "../assets/img/keylight.png";
import keylightAir from "../assets/img/keylight-air.png";
import {
  ElgatoKeyLightController,
  KeyLightOptions,
} from "@zunderscore/elgato-light-control";

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

const getImagePathFromName = (name: string) => {
  switch (name) {
    case "Elgato Key Light Air":
      return keylightAir;
    case "Elgato Key Light":
      return keylight;
    default:
      return keylight;
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
          temperature: params.temperature,
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

// Calculate the kelvin value from the slider value
const calculateTemperatureFromValueToKelvin = (value: number) => {
  const coldTemp = MAX_TEMPERATURE.kelvin;
  const hotTemp = MIN_TEMPERATURE.kelvin;
  const coldValue = MAX_TEMPERATURE.value;
  const hotValue = MIN_TEMPERATURE.value;
  const range = coldTemp - hotTemp;
  const rangeValue = coldValue - hotValue;
  const valuePercentage = Math.round(((value - hotValue) / rangeValue) * 100);
  const kelvin = Math.round(coldTemp - range * (valuePercentage / 100));
  // console.log(
  //   "rangeValue",
  //   rangeValue,
  //   "range",
  //   `${range}K`,
  //   "valuePercentage",
  //   valuePercentage,
  //   "kelvin",
  //   `${kelvin}K`
  // );
  return { text: `${kelvin}K`, value: kelvin };
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
  MAX_TEMPERATURE,
  MIN_TEMPERATURE,
};
