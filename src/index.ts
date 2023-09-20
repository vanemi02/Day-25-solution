import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import path from "path"
import FloorMap from "./FloorMap.js"

// need these to get relative path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// I am counting on the file having the correct input,
// since accounting for a wrong input didn't seem to be a part of the assignment
let input: Buffer | undefined
try {
  // read the file containing input given to me from the adventofcode site
  input = readFileSync(path.join(__dirname, "../input.txt"))
} catch (error) {
  console.log("The input file couldn't be read");
  console.log(error)
}

// if the input is undefined exit the program (appeasing TS)
if (!input) process.exit(1)

// loading input into my FloorMap structure
const floorMap = FloorMap.loadFloorMap(input.toString())

// step counter
let step = 0
// tracking any movement during step
let moved = false
// loop that runs steps until none of the cucumbers move
while (true) {
  // first we need to move cucumbers going east then those going south
  if (floorMap.moveType(">")) moved = true
  if (floorMap.moveType("v")) moved = true
  step++
  // stop when none of the cucumbers move
  if (!moved) break
  moved = false
}

// print the results
floorMap.printFloorMap()
console.log(`\nIt took ${step} steps for none of the cucumbers to move`);
