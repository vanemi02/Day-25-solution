import type { tileType, coords } from "./Tile.js"
import Tile from "./Tile.js"

export type rawFloorMap = Tile[][]

/**
 * A data structure to help us with simulating the movement of sea cucumbers on the seafloor
 */
export default class FloorMap {
  
  /**
   * @param rawFloorMap 2d array of {@link Tile}
   * @param width the width of the map
   * @param height the height of the map
   * @param eastCucumbers array of all the cucumbers facing east
   * @param southCucumbers array of all the cucumbers facing south
   */
  private constructor(
    private rawFloorMap: rawFloorMap,
    private width: number,
    private height: number,
    private eastCucumbers: Tile[],
    private southCucumbers: Tile[]
    ) {
  }

  /**
   * creates a new instance of {@link FloorMap} from a string of characters representing the map of the sea floor
   * @param input lines of characters representing the map of the sea floor
   * @returns a new instance of {@link FloorMap} loaded from the input
   */
  public static loadFloorMap(input: string) {
    const width = input.indexOf("\n")
    const height = input.match(/\n/g)?.length ?? 0
    const rawFloorMap: rawFloorMap = new Array(height)
    const eastCucumbers: Tile[] = []
    const southCucumbers: Tile[] = []
    const floorMap = new FloorMap(rawFloorMap, width, height, eastCucumbers, southCucumbers)
  
    let x = 0
    let y = 0
    let mapLine: rawFloorMap[number] = new Array(width)
    for (let character of input) {
      if (character === "\n") {
        // when we get to the end of line insert the line to the rawFloorMap
        rawFloorMap[y] = mapLine
        // start a new line
        mapLine = new Array(width)
        y++
        x = 0
        continue
      } else {
        const cucumber = new Tile(character as tileType, {x, y}, floorMap)
        mapLine[x] = cucumber
        // add the cucumbers to arrays depending on their direction as well,
        // so that we can easily move them during the simulation
        if (cucumber.getType() === ">") eastCucumbers.push(cucumber)
        else if (cucumber.getType() === "v") southCucumbers.push(cucumber)
      }
      x++
    }
    return floorMap
  }

  /**
   * gets a wrapped position,
   * meaning, that if its set outside of the borders, it will wrap back inside
   * @param coords position for the tile you want to get
   * @returns tile at set position
   */
  public get(coords: coords) {
    const y = coords.y % this.height
    const x = coords.x % this.width
    return this.rawFloorMap[y][x]
  }

  /**
   * sets the tile to a position, that is also wrapped,
   * meaning if its set outside of the borders, it will wrap back inside
   * @param coords position for the tile to be set
   * @param tile tile to be set
   */
  public set(coords: coords, tile: Tile) {
    const y = coords.y % this.height
    const x = coords.x % this.width
    this.rawFloorMap[y][x] = tile
    tile.setCoords({x, y})
  }

  /**
   * switches places of two tiles inside the FloorMap
   */
  public switch(tileA: Tile, tileB: Tile) {
    const temp = tileA.getCoords()
    this.set(tileB.getCoords(), tileA)
    this.set(temp, tileB)
  }

  /**
   * tries to move all of the cucumbers of the chosen type
   * @param type the type of cucumbers to move
   * @returns true if any of the cucumbers moved, false otherwise
   */
  public moveType(type: Exclude<tileType, ".">) {
    // for tracking in any moved
    let moved = false
    // array of all cucumbers that will be moved
    const movable: Tile[] = []
    // depending on type, which cucumbers to move
    let cucumbersToBeMoved = type === ">" ? this.eastCucumbers : this.southCucumbers
    cucumbersToBeMoved.forEach(cucumber => {
      if (cucumber.canMove()) {
        // we need to add them to the array and move them after all are checked,
        // so that the move doesn't change the check results
        movable.push(cucumber)
        moved = true
      }
    })
    movable.forEach(cucumber => cucumber.move())
    return moved
  }

  /**
   * prints the FloorMap to the console,
   * which is useful for example for debugging
   */
  public printFloorMap() {
    console.log(
      this.rawFloorMap.map(line => 
        line.map(cucumber => cucumber.getType()).join("")
      ).join("\n")
    )
  }
}