import { Coords } from "./Coords"

export class Position {

  timestamp: number
  coords: Coords

  constructor(coords: Coords, timestamp: number) {
    this.coords = coords
    this.timestamp = timestamp
  }
}
