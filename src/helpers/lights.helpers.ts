import keylight from "../assets/img/keylight.png";
import keylightAir from "../assets/img/keylight-air.png";
import {
  ElgatoKeyLightController,
  KeyLightOptions,
} from "@zunderscore/elgato-light-control";

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

export const light = {
  image: getImagePathFromName,
  state: changeLightState,
  temperature: changeLightTemperature,
  brightness: changeLightBrightness,
  MAX_TEMPERATURE,
  MIN_TEMPERATURE,
};
