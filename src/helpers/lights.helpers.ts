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

const changeLightState = (
  lightController: ElgatoKeyLightController,
  index: number,
  state: number,
  initialOptions: KeyLightOptions
) => {
  lightController
    .updateLightOptions(lightController.keyLights[index], {
      numberOfLights: initialOptions.numberOfLights,
      lights: [
        {
          on: state,
          brightness: initialOptions.lights[0].brightness,
          temperature: initialOptions.lights[0].temperature,
        },
      ],
    })
    .then(() => {
      console.log("Key Light has been updated!");
    })
    .catch((e) => {
      console.error("Error: ", e);
    });
};

export const light = {
  image: getImagePathFromName,
  state: changeLightState,
};
