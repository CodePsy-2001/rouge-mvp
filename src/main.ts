import * as PIXI from "pixi.js";
import { draw } from "./game.ts";

const loadAssets = async () => {
  PIXI.Assets.add({ alias: "atlas", src: "assets/atlas.json" });
  await PIXI.Assets.load(["atlas"]);
};

/** The PixiJS app Application instance, shared across the project */
export const app = new PIXI.Application<HTMLCanvasElement>({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x999999,
});

function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const minWidth = 500;
  const minHeight = 500;

  const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
  const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
  const scale = scaleX > scaleY ? scaleX : scaleY;
  const width = windowWidth * scale;
  const height = windowHeight * scale;

  app.renderer.view.style.width = `${windowWidth}px`;
  app.renderer.view.style.height = `${windowHeight}px`;
  window.scrollTo(0, 0);

  app.renderer.resize(width, height);
}

async function init() {
  await loadAssets();

  draw(app as PIXI.Application);

  document.body.appendChild(app.renderer.view);
  window.addEventListener("resize", resize);
  resize();
}

init();
