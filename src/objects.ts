import { type Planet, type MiningResource } from "./types.ts";

// Ascii art from https://www.asciiart.eu/space/planets
export const planetA: Planet = {
  name: "A",
  pos: 0,
  goods: 0,
  launchCost: 0,
  miningInfo: {
    miningUnlocked: false,
    miners: [],
    resources: {
      name: "n/a",
      researchCost: 0,
      symbol: "",
      color: "",
      amount: 0,
    }
  }
};

export const planetB: Planet = {
  name: "B",
  pos: 8,
  goods: 1,
  launchCost: 9,
  miningInfo: {
    miningUnlocked: false,
    miners: [],
    resources: {
      name: "Blue Squares",
      researchCost: 1000,
      symbol: "◼",
      color: "blue",
      amount: 0,
    },
  },
  display: `
         ,MMM8&&&.
    _...MMMMM88&&&&..._
 .::'''MMMMM88&&&&&&'''::.
::     MMMMM88&&&&&&     ::
'::....MMMMM88&&&&&&....::'
   '''''MMMMM88&&&&'''''
   jgs   'MMM8&&&'

`};

export const planetC: Planet = {
  name: "C",
  pos: 15,
  goods: 2,
  launchCost: 15,
  miningInfo: {
    miningUnlocked: false,
    miners: [],
    resources: {
      name: "Green Triangles",
      researchCost: 1000,
      symbol: "▲",
      color: "green",
      amount: 0,
    },
  },
  display: `
 ~+       *       +
    '                  |
()    .-.,="\`\`"=.    - o -
      '=/_       \\     |
   *   |  '=._    |
        \      \`=./\`,        '
     .   '=.__.=' \`='      *
                      +
 O jgs  *        '       .

`};

export const planetD: Planet = {
  name: "D",
  pos: 30,
  goods: 5,
  launchCost: 30,
  miningInfo: {
    miningUnlocked: false,
    miners: [],
    resources: {
      name: "Red Diamonds",
      researchCost: 1000,
      symbol: "◆",
      color: "red",
      amount: 0,
    },
  },
  display: `
     .        ___---___
           .--\\        --.     .   .
         ./.;_.\\     __/~ \\.
    .   /;  / \`-'  __\\    . \\
       / ,--'     / .   .;   \\      |
      | .|       /       __   |    -O-
     |__/    __ |  . ;   \\ | . |    |
     |      /  \\\\_    . ;| \\___|
o    |      \\  .~\\\\___,--'     |
      |     | . ; ~~~~\\_    __|
       \\    \\   .  .  ; \\  /_/
   .    \\   /         . |  ~/    .
 .       ~\\ \\   .      /  /~
           ~--___ ; ___--~
      .          ---         .    -JT

`};

export const blueSquares: MiningResource = {
  name: "Blue Squares",
  researchCost: 1000,
  symbol: "◼",
  color: "blue",
  amount: 0,
};

export const greenTriangles: MiningResource = {
  name: "Green Triangles",
  researchCost: 1000,
  symbol: "▲",
  color: "green",
  amount: 0,
};

export const redDiamonds: MiningResource = {
  name: "Red Diamonds",
  researchCost: 1000,
  symbol: "◆",
  color: "red",
  amount: 0,
};
