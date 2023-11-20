import * as ROT from "rot-js";
import * as PIXI from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";

const MAP_WIDTH = 50;
const MAP_HEIGHT = 50;

const TILE_SIZE = 16;

type Tile = {
  movable: boolean; // can be walked on
};

class Grid<E> {
  public width: number;
  public height: number;
  cells: E[][];

  constructor<E>(width: number, height: number, cells: E[][]) {
    this.cells = cells;
    this.width = width;
    this.height = height;
  }

  static fill<E>(width: number, height: number, value: E): Grid<E> {
    const cells: E[][] = Array.from({ length: height }, () => Array(width).fill(value));
    return new Grid<E>(width, height, cells);
  }

  at(x: number, y: number): E {
    return this.cells[x][y];
  }
}

const rotMap = new ROT.Map.Cellular(MAP_HEIGHT, MAP_WIDTH); // 뒤집어서 넣어야 함
rotMap.randomize(0.5);
for (let i = 3; i >= 0; i--) {
  rotMap.create();
}
const rotMapToTile = (rotMap: number[][]): Tile[][] => {
  return rotMap.map((row) => row.map((cell) => ({ movable: cell === 0 })));
};

const tileGrid = new Grid<Tile>(MAP_WIDTH, MAP_HEIGHT, rotMapToTile(rotMap._map));

// draw tiles
export const draw = (app: PIXI.Application) => {
  const tilemap = new CompositeTilemap();
  for (const [i, row] of tileGrid.cells.entries()) {
    for (const [j, cell] of row.entries()) {
      const tile = cell.movable ? PIXI.Assets.get("tile") : PIXI.Assets.get("wall");
      tilemap.tile(tile, j * TILE_SIZE, i * TILE_SIZE);
    }
  }

  app.stage.addChild(tilemap);
};
