import FloorMap from "./FloorMap"

export type tileType = "." | ">" | "v"
export type coords = { x: number, y: number }

/**
 * represents a tile inside the {@link FloorMap}
 */
export default class Tile {
  /**
   * @param type type of the tile
   * @param coords location of the tile within the floorMap
   * @param floorMap the floorMap in which the tile resides
   */
  constructor(private type: tileType, private coords: coords, private floorMap: FloorMap) {
  }

  public getCoords() {
    return this.coords
  }

  public setCoords(coords: coords) {
    this.coords = coords
  }

  public getType() {
    return this.type
  }

  /**
   * @returns tile in front of the cucumber, if its empty tile then itself
   */
  private getTileInFront() {
    if (this.type === ".") return this
    return this.type === ">"
    ? this.floorMap.get({ x: this.coords.x + 1, y: this.coords.y })
    : this.floorMap.get({ x: this.coords.x, y: this.coords.y + 1 })
  }

  /**
   * @returns true if the tile with a cucumber can move, otherwise false
   */
  public canMove() {
    if (this.type === ".") return false
    let newPos = this.getTileInFront()
    if (newPos.getType() !== ".") return false
    return true
  }

  /**
   * moves the tile with cucumber to the direction its facing
   * @returns true if the tile with cucumber moved otherwise false
   */
  public move() {
    if (this.type === ".") return false
    let newPos = this.getTileInFront()
    this.floorMap.switch(this, newPos)
    return true
  }
}