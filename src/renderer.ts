import "./index.css";
import "./bootstrap/bootstrap.min.css";
import "./bootstrap/bootstrap.bundle.min.js";
import { Bounds } from "./interfaces/screen";
import { KeyLight } from "@zunderscore/elgato-light-control";
import { light as light_helper } from "./helpers/lights.helpers";

console.log("👋 Hello from renderer!");

const btnSend = document.querySelector("#send-btn");
btnSend.addEventListener("click", () => {
  // @ts-ignore
  const width = document.querySelector("#screen-width").value;
  // @ts-ignore
  const height = document.querySelector("#screen-height").value;
  console.log("btnSend click", { width, height });
  // @ts-ignore
  window.Bridge.sendResolution({ width, height });
});

window.Bridge.onResolutionReceived((params: Bounds) => {
  document.querySelector("#screen-width").value = params.bounds.width;
  document.querySelector("#screen-height").value = params.bounds.height;
});

window.Bridge.onNewKeyLight((params: KeyLight[]) => {
  console.log("onNewKeyLight", params);
  generateCards(params);
});

const generateCards = (params: KeyLight[]) => {
  const lights = document.querySelector("#lights");
  lights.innerHTML = "";
  params.forEach((light, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "18rem";

    const image = document.createElement("img");
    image.classList.add("card-img-top");
    image.src = light_helper.image(light.info.productName);
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
      console.log("Identify light at index ", index);
      window.Bridge.identifyLight(index);
    });

    // Brightness controll
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
      window.Bridge.setLightBrightness({
        index,
        brightness: parseInt(brightnessInput.value),
      });
      brightnessLabel.innerText = `Brigthness (${brightnessInput.value}%)`;
    });

    // Temperature controll
    const temperatureLabel = document.createElement("label");
    temperatureLabel.classList.add("form-label");
    temperatureLabel.innerText = `Temperature (${light.options.lights[0].temperature})`;

    const temperatureInput = document.createElement("input");
    temperatureInput.classList.add("form-range");
    temperatureInput.type = "range";
    temperatureInput.min = "144";
    temperatureInput.max = "343";
    temperatureInput.value = light.options.lights[0].temperature.toString();
    temperatureInput.addEventListener("change", () => {
      window.Bridge.setLightTemperature({
        index,
        temperature: parseInt(temperatureInput.value),
      });
      temperatureLabel.innerText = `Temperature (${temperatureInput.value})`;
    });

    const ul = document.createElement("ul");
    ul.classList.add("list-group", "list-group-flush");
    const li1 = document.createElement("li");
    li1.classList.add("list-group-item");
    li1.innerText = `Serial number: ${light.info.serialNumber}`;
    const li2 = document.createElement("li");
    li2.classList.add("list-group-item");
    li2.innerText = `IP: ${light.ip}`;

    ul.appendChild(li1);
    ul.appendChild(li2);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardButton);
    cardBody.appendChild(document.createElement("br"));
    cardBody.appendChild(brightnessLabel);
    cardBody.appendChild(brightnessInput);
    cardBody.appendChild(document.createElement("br"));
    cardBody.appendChild(temperatureLabel);
    cardBody.appendChild(temperatureInput);
    card.appendChild(cardBody);
    card.appendChild(ul);
    lights.appendChild(card);
  });
};
