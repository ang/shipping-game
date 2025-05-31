import { type Planet, type Ship } from "./types.ts";

// Ascii art from https://www.asciiart.eu/space/planets
export const planetA: Planet = {name: "A", pos: 0, goods: 1, launchCost: 0};
export const planetB: Planet = {
  name: "B",
  pos: 8,
  goods: 1,
  launchCost: 9,
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

export const ship1: Ship = {
  name: "Ship 1",
  destination1: planetA,
  destination2: planetB,
  pos: 0,
  direction: true,
  speed: 1,
  capacity: 1,
  upgradeSpeedCost: 5,
  upgradeCapacityCost: 8
};
