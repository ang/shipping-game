import { type Planet } from "./types.ts";

// Ascii art from https://www.asciiart.eu/space/planets
export const planetA: Planet = {
  name: "A",
  pos: 0,
  goods: 0,
  launchCost: 0,
  miningResource: {
    name: "n/a",
    researchCost: 0,
    symbol: "",
    color: "",
  }
};

export const planetB: Planet = {
  name: "B",
  pos: 8,
  goods: 1,
  launchCost: 9,
  miningResource: {
    name: "Blue Squares",
    researchCost: 1000,
    symbol: "◼",
    color: "blue",
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
  miningResource: {
    name: "Green Triangles",
    researchCost: 1000,
    symbol: "▲",
    color: "green",
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
  miningResource: {
    name: "Red Diamonds",
    researchCost: 1000,
    symbol: "◆",
    color: "red",
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
