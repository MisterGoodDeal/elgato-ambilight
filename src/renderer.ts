import "./index.css";
import "./bootstrap/bootstrap.min.css";
import "./bootstrap/bootstrap.bundle.min.js";
import { Bounds } from "./interfaces/screen";
import { KeyLight } from "@zunderscore/elgato-light-control";
import { light as light_helper } from "./helpers/lights.helpers";
import { system } from "./helpers/system";
import {
  AppSettings,
  defaultAppSettings,
  LightSettings,
} from "./interfaces/app";

const bounds = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

const IMAGE_SIZE = 50;

let appSettings: AppSettings = defaultAppSettings;

let keylights: KeyLight[] = [];

const checkbox = document.querySelector("#ambilightActivated");
const ambilightText = document.querySelector("#ambilightText");
const refreshRate = document.querySelector("#refreshRate");
const refreshRateText = document.querySelector("#refreshRateText");
const maxBrightnessInput = document.querySelector("#maxBrightness");
const maxBrightnessText = document.querySelector("#maxBrightnessText");

checkbox.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  ambilightText.innerHTML = target.checked ? "ON" : "OFF";
  appSettings.ambilightOn = target.checked;
  // @ts-ignore
  window.Bridge.setAppSettings({ ambilightOn: target.checked });
});

refreshRate.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  refreshRateText.innerHTML = target.value;
  appSettings.refreshRate = parseInt(target.value);
  // @ts-ignore
  window.Bridge.setAppSettings({ refreshRate: parseInt(target.value) });
});

maxBrightnessInput.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  maxBrightnessText.innerHTML = target.value;
  appSettings.maxBrightness = parseInt(target.value);
  // @ts-ignore
  window.Bridge.setAppSettings({ maxBrightness: parseInt(target.value) });
});

// @ts-ignore
window.Bridge.onSettingsReceived((params: AppSettings) => {
  appSettings = params;
  bounds.width = params.bounds.width;
  bounds.height = params.bounds.height;
  bounds.x = params.bounds.x;
  bounds.y = params.bounds.y;
  // Calculate aspect ratio of the screen
  const aspectRatio = bounds.height / bounds.width;
  const canvas = document.querySelector("#screen-canvas");
  // @ts-ignore
  canvas.width = system.WINDOW_WIDTH * 0.5;
  // @ts-ignore
  canvas.height = system.WINDOW_WIDTH * 0.5 * aspectRatio;
  // @ts-ignore
  const ctx = canvas.getContext("2d");
  // @ts-ignore
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // @ts-ignore
  checkbox.checked = params.ambilightOn;
  ambilightText.innerHTML = params.ambilightOn ? "ON" : "OFF";
  // @ts-ignore
  refreshRate.value = params.refreshRate;
  refreshRateText.innerHTML = params.refreshRate.toString();
});

// @ts-ignore
window.Bridge.onNewKeyLight((params: KeyLight[]) => {
  keylights = params;
  generateCards(params);
});

const generateCards = (params: KeyLight[]) => {
  const lights = document.querySelector("#lights");
  const canvasContainer = document.querySelector("#canvas-container");
  const canvasScreen = document.querySelector("#screen-canvas");
  lights.innerHTML = "";
  params.forEach((light, index) => {
    const imageHelper = light_helper.image(light.info.productName);
    const lightSettings = light_helper.settings({
      lightSettings: appSettings.lights ?? [],
      serialNumber: light.info.serialNumber,
    });

    const img = new Image();
    img.src = imageHelper.icon;
    img.onload = () => {
      // @ts-ignore
      const widthMultiplier = canvasScreen.width / bounds.width;
      // @ts-ignore
      const heightMultiplier = canvasScreen.height / bounds.height;
      // @ts-ignore
      const ctx = canvasScreen.getContext("2d");
      ctx.drawImage(
        img,
        lightSettings.x * widthMultiplier - IMAGE_SIZE / 2,
        lightSettings.y * heightMultiplier - IMAGE_SIZE / 2,
        IMAGE_SIZE,
        IMAGE_SIZE
      );
    };

    const col6 = document.createElement("div");
    col6.classList.add("col-6");
    // Create card
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("fluid");

    const image = document.createElement("img");
    image.classList.add("card-img-top");
    image.src = imageHelper.product;
    image.alt = light.info.serialNumber;
    card.appendChild(image);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = light.name;

    const cardButton = document.createElement("a");
    cardButton.classList.add("btn", "btn-primary");
    cardButton.innerText = "Identify light";
    cardButton.addEventListener("click", () => {
      // @ts-ignore
      window.Bridge.identifyLight(light.info.serialNumber);
    });

    // Brightness control
    const brightnessLabel = document.createElement("label");
    brightnessLabel.classList.add("form-label");
    brightnessLabel.innerText = `Brigthness (${light.options.lights[0].brightness}%)`;

    const brightnessInput = document.createElement("input");
    brightnessInput.classList.add("form-range");
    brightnessInput.type = "range";
    brightnessInput.min = "0";
    brightnessInput.max = "100";
    brightnessInput.value = light.options.lights[0].brightness.toString();
    brightnessInput.addEventListener("change", () => {
      // @ts-ignore
      window.Bridge.setLightBrightness({
        serialNumber: light.info.serialNumber,
        brightness: parseInt(brightnessInput.value),
      });
      brightnessLabel.innerText = `Brigthness (${brightnessInput.value}%)`;
    });

    // Temperature control
    const temperatureLabel = document.createElement("label");
    temperatureLabel.classList.add("form-label");
    temperatureLabel.innerText = `Temperature (${
      light_helper.temperature.calculateKelvin(
        light_helper.temperatureValueIndex(light.options.lights[0].temperature)
      ).text
    })`;
    temperatureLabel.style.paddingLeft = "10px";
    temperatureLabel.style.paddingRight = "10px";
    temperatureLabel.style.paddingTop = "3px";
    temperatureLabel.style.paddingBottom = "3px";
    temperatureLabel.style.borderRadius = "3px";
    temperatureLabel.style.backgroundColor =
      light_helper.temperature.calculateColor(
        light_helper.temperatureValueIndex(light.options.lights[0].temperature)
      );

    const temperatureInput = document.createElement("input");
    temperatureInput.classList.add("form-range");
    temperatureInput.type = "range";
    temperatureInput.min = "0";
    temperatureInput.max = `${light_helper.TEMPERATURE_VALUES.length - 1}`;
    temperatureInput.value = light_helper
      .temperatureValueIndex(light.options.lights[0].temperature)
      .toString();
    temperatureInput.addEventListener("change", () => {
      // @ts-ignore
      window.Bridge.setLightTemperature({
        serialNumber: light.info.serialNumber,
        temperature: parseInt(temperatureInput.value),
      });
      temperatureLabel.innerText = `Temperature (${
        light_helper.temperature.calculateKelvin(Number(temperatureInput.value))
          .text
      })`;
      temperatureLabel.style.backgroundColor =
        light_helper.temperature.calculateColor(Number(temperatureInput.value));
    });

    // Position x control
    const positionXLabel = document.createElement("label");
    positionXLabel.classList.add("form-label");
    positionXLabel.innerText = `Position X on screen: (${lightSettings.x})`;

    const positionXInput = document.createElement("input");
    positionXInput.classList.add("form-range");
    positionXInput.type = "range";
    positionXInput.min = "0";
    positionXInput.max = `${bounds.width - 1}`;
    positionXInput.value = lightSettings.x.toString();
    positionXInput.addEventListener("change", () => {
      // @ts-ignore
      window.Bridge.setLightPosition({
        serialNumber: light.info.serialNumber,
        x: parseInt(positionXInput.value),
      });
      positionXLabel.innerText = `Position X on screen: (${positionXInput.value})`;
      // Change the setting of the current light
      const index = appSettings.lights.findIndex(
        (lightSetting) => lightSetting.serialNumber === light.info.serialNumber
      );
      appSettings.lights[index].x = parseInt(positionXInput.value);
      redrawImages(canvasScreen, canvasContainer);
    });

    // Position y control
    const positionYLabel = document.createElement("label");
    positionYLabel.classList.add("form-label");
    positionYLabel.innerText = `Position Y on screen: (${lightSettings.y})`;

    const positionYInput = document.createElement("input");
    positionYInput.classList.add("form-range");
    positionYInput.type = "range";
    positionYInput.min = "0";
    positionYInput.max = `${bounds.height - 1}`;
    positionYInput.value = lightSettings.y.toString();
    positionYInput.addEventListener("change", () => {
      // @ts-ignore
      window.Bridge.setLightPosition({
        serialNumber: light.info.serialNumber,
        y: parseInt(positionYInput.value),
      });
      positionYLabel.innerText = `Position Y on screen: (${positionYInput.value})`;
      // Change the setting of the current light
      const index = appSettings.lights.findIndex(
        (lightSetting) => lightSetting.serialNumber === light.info.serialNumber
      );
      appSettings.lights[index].y = parseInt(positionYInput.value);
      redrawImages(canvasScreen, canvasContainer);
    });

    const ul = document.createElement("ul");
    ul.classList.add("list-group", "list-group-flush");
    const li1 = document.createElement("li");
    li1.classList.add("list-group-item");
    li1.appendChild(brightnessLabel);
    li1.appendChild(brightnessInput);
    const li2 = document.createElement("li");
    li2.classList.add("list-group-item");
    li2.appendChild(temperatureLabel);
    li2.appendChild(temperatureInput);
    const li3 = document.createElement("li");
    li3.classList.add("list-group-item");
    li3.appendChild(positionXLabel);
    li3.appendChild(positionXInput);
    li3.appendChild(positionYLabel);
    li3.appendChild(positionYInput);

    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardButton);
    card.appendChild(cardBody);
    card.appendChild(ul);
    col6.appendChild(card);
    lights.appendChild(col6);
  });
};

const redrawImages = (lightsCanvas: Element, mainCanvas: Element) => {
  // @ts-ignore
  const ctx = lightsCanvas.getContext("2d");
  // @ts-ignore
  ctx.clearRect(0, 0, lightsCanvas.width, lightsCanvas.height);
  keylights.forEach((kl) => {
    const imageHelper = light_helper.image(kl.info.productName);
    const lightSettings = light_helper.settings({
      lightSettings: appSettings.lights ?? [],
      serialNumber: kl.info.serialNumber,
    });

    const canvasRect = mainCanvas.getBoundingClientRect();
    const img = new Image();
    img.src = imageHelper.icon;
    img.onload = () => {
      // @ts-ignore
      const widthMultiplier = canvasRect.width / bounds.width;
      // @ts-ignore
      const heightMultiplier = canvasRect.height / bounds.height;
      // @ts-ignore
      const ctx = lightsCanvas.getContext("2d");
      ctx.drawImage(
        img,
        lightSettings.x * widthMultiplier - IMAGE_SIZE / 2,
        lightSettings.y * heightMultiplier - IMAGE_SIZE / 2,
        IMAGE_SIZE,
        IMAGE_SIZE
      );
    };
  });
};
