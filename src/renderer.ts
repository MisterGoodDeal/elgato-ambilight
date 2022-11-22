import "./index.css";
import "./bootstrap/bootstrap.min.css";
import "./bootstrap/bootstrap.bundle.min.js";
import { Bounds } from "./interfaces/screen";
import { KeyLight } from "@zunderscore/elgato-light-control";
import { light as light_helper } from "./helpers/lights.helpers";
import { system } from "./helpers/system";

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

// @ts-ignore
window.Bridge.onResolutionReceived((params: Bounds) => {
  // @ts-ignore
  document.querySelector("#screen-width").value = params.bounds.width;
  // @ts-ignore
  document.querySelector("#screen-height").value = params.bounds.height;
  // Calculate aspect ratio of the screen
  const aspectRatio = params.bounds.height / params.bounds.width;
  console.log({ aspectRatio, params });

  // Draw rectangle in canvas
  const canvas = document.querySelector("#screen-canvas");
  canvas.width = system.WINDOW_WIDTH * 0.5;
  canvas.height = system.WINDOW_WIDTH * 0.5 * aspectRatio;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(
    0,
    0,
    system.WINDOW_WIDTH * 0.5,
    system.WINDOW_WIDTH * 0.5 * aspectRatio
  );
});

// @ts-ignore
window.Bridge.onNewKeyLight((params: KeyLight[]) => {
  console.log("onNewKeyLight", params);
  generateCards(params);
});

const generateCards = (params: KeyLight[]) => {
  const lights = document.querySelector("#lights");
  lights.innerHTML = "";
  params.forEach((light, index) => {
    // Create card
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
      // @ts-ignore
      window.Bridge.identifyLight(index);
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
        index,
        brightness: parseInt(brightnessInput.value),
      });
      brightnessLabel.innerText = `Brigthness (${brightnessInput.value}%)`;
    });

    // Temperature control
    const temperatureLabel = document.createElement("label");
    temperatureLabel.classList.add("form-label");
    temperatureLabel.innerText = `Temperature (${
      light_helper.temperature.calculateKelvin(
        Number(light.options.lights[0].temperature)
      ).text
    })`;
    temperatureLabel.style.backgroundColor =
      light_helper.temperature.calculateColor(
        Number(light.options.lights[0].temperature)
      );

    const temperatureInput = document.createElement("input");
    temperatureInput.classList.add("form-range");
    temperatureInput.type = "range";
    temperatureInput.min = "144";
    temperatureInput.max = "343";
    temperatureInput.value = light.options.lights[0].temperature.toString();
    temperatureInput.addEventListener("change", () => {
      // @ts-ignore
      window.Bridge.setLightTemperature({
        index,
        temperature: parseInt(temperatureInput.value),
      });
      temperatureLabel.innerText = `Temperature (${
        light_helper.temperature.calculateKelvin(Number(temperatureInput.value))
          .text
      })`;
      temperatureLabel.style.backgroundColor =
        light_helper.temperature.calculateColor(Number(temperatureInput.value));
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

    ul.appendChild(li1);
    ul.appendChild(li2);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardButton);
    card.appendChild(cardBody);
    card.appendChild(ul);
    lights.appendChild(card);

    // Dragable square in the canvas
    const canvas = document.querySelector("#screen-canvas");
    const ctx = canvas.getContext("2d");
    const square = new Square(ctx, {
      x: index * 100,
      y: 0,
      width: 30,
      height: 30,
      color: "rgba(0, 0, 255, 0.5)",
    });
    square.draw();
    canvas.addEventListener("mousedown", (e) => {
      square.isDragging = true;
      square.offsetX = e.offsetX;
      square.offsetY = e.offsetY;
    });
    canvas.addEventListener("mouseup", (e) => {
      square.isDragging = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (square.isDragging) {
        square.x = e.offsetX - square.offsetX;
        square.y = e.offsetY - square.offsetY;
        square.draw();
      }
    });
  });
};

class Square {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isDragging: boolean;
  offsetX: number;
  offsetY: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    { x, y, width, height, color }: SquareProps
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

interface SquareProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
