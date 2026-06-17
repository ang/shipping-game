import { type Ship, type State } from "./types.ts";
import { getOrCreateElementById } from "./common.ts";
import { SHIP_CAPACITY_MAX, SHIP_SPEED_MAX } from "./constants.ts";

export const getOrCreateShipDisplay = (ship: Ship, state: State): HTMLElement => {
    const parentId = "shipParent-" + ship.name.split(" ").join("-");
    const parentDiv = getOrCreateElementById({id: parentId});
    const shipName = getOrCreateElementById({id: parentId + "-shipName", innerText: ship.name + ": ", elementTypeArg: "span"});
    const planet1 = getOrCreateElementById({id: parentId + "-planet1", innerText: ship.destination1.name, elementTypeArg: "span"});

    let shipInnerText = ""
    let shipHead = getOrCreateElementById({id: parentId + "-shipHead", elementTypeArg: "span"});
    let shipMiddle = getOrCreateElementById({id: parentId + "-shipMiddle", elementTypeArg: "span"});
    let shipTail = getOrCreateElementById({id: parentId + "-shipTail", elementTypeArg: "span"});
    const shipComponentsOrdered: HTMLElement[] = []
    if (ship.pos > 0 && ship.pos < ship.destination2.pos) {
      if (ship.direction) {
        shipInnerText += ">";
        shipHead.innerText = ">";
      } else {
        shipInnerText += "<";
        shipHead.innerText = "<";
      }

      if (ship.capacity === 2) {
        shipInnerText += "=";
        shipMiddle.innerText = "=";
      } else if (ship.capacity === 3) {
        shipInnerText += "==";
        shipMiddle.innerText = "==";
      } else if (ship.capacity === SHIP_CAPACITY_MAX) {
        shipInnerText += "===";
        shipMiddle.innerText = "===";
      }

      if (ship.speed === 2) {
        shipInnerText += "~"
        shipTail.innerText = "~"
      } else if (ship.speed > 2) {
        const speedDis = ship.direction ? "}" : "{";

        if (ship.speed === 3) {
          shipInnerText += speedDis;
          shipTail.innerText = speedDis
        } else if (ship.speed === SHIP_SPEED_MAX) {
          shipInnerText += speedDis + speedDis;
          shipTail.innerText = speedDis + speedDis;
        }
      }

      // When it reaches the destination, if it goes past the destination, it will "disappear"
      // When it is leaving somewhere, we'll show only part of the body if necessary
      // So this cutting of the ship only ever happens to the back of a ship
      let shipLengthCut = 0;
      if (ship.direction) {
        shipLengthCut = Math.min(ship.pos, shipInnerText.length);
      } else {
        shipLengthCut = Math.min(ship.destination2.pos - ship.pos, shipInnerText.length);
      }
      shipInnerText = shipInnerText.substring(0, shipLengthCut);

      shipHead.innerText = shipHead.innerText.substring(0, shipLengthCut)
      shipMiddle.innerText = shipMiddle.innerText.substring(0, shipLengthCut - shipHead.innerText.length)
      shipTail.innerText = shipTail.innerText.substring(0, shipLengthCut - shipHead.innerText.length - shipMiddle.innerText.length)

      // TODO remove this, I don't have super speed anymore
      if (ship.speed >= 6) {
        shipHead.style.color = "blue";
      }
      if (ship.speed === 8) {
        shipTail.style.color = "blue";
      }
      if (ship.speed >= 10) {
        const color1 = "#191970";
        const color2 = "#1E90FF";
        const modValue = 2;
        if (!shipTail.style.color || shipTail.style.color === "blue") {
          shipTail.style.color = color1;
        } else if (shipTail.style.color === color1 && state.gameTick % modValue === 0) {
          shipTail.style.color = color2;
        } else if (shipTail.style.color === color2 && state.gameTick % modValue === 0) {
          shipTail.style.color = color1;
        }
      }

      if (ship.direction) {
        shipComponentsOrdered.push(shipTail, shipMiddle, shipHead);
      } else {
        shipComponentsOrdered.push(shipHead, shipMiddle, shipTail);
      }

      if (ship.direction) {
        shipInnerText = shipInnerText.split("").reverse().join("");
      }
    }
    const shipDisplay = getOrCreateElementById({id: parentId + "-shipDisplay", elementTypeArg: "span"});

    // Three parts Head Middle Tail
    // Order will depend on the direction
    shipDisplay.innerHTML = "";
    if (shipComponentsOrdered.length !== 0) {
      shipDisplay.appendChild(shipComponentsOrdered[0]);
      shipDisplay.appendChild(shipComponentsOrdered[1]);
      shipDisplay.appendChild(shipComponentsOrdered[2]);
    }

    // shipDisplay.innerHTML = `<span>${shipInnerText}</span>`


    const shipLength = shipInnerText.length;

    let preDotsCount = 0;
    let postDotsCount = 0;
    if (ship.pos <= 0) {
      preDotsCount = 0;
      postDotsCount = ship.destination2.pos - 1 - Math.max(ship.pos, 0);
    } else if (ship.pos < ship.destination2.pos && ship.direction) {
      preDotsCount = Math.max(ship.pos - 1 - (shipLength - 1), 0);
      postDotsCount = ship.destination2.pos - 1 - ship.pos;
    } else if (ship.pos < ship.destination2.pos && !ship.direction) {
      preDotsCount = ship.pos - 1;
      postDotsCount = Math.max(ship.destination2.pos - 1 - ship.pos - (shipLength - 1), 0);
    } else if (ship.pos >= ship.destination2.pos) {
      preDotsCount = ship.destination2.pos - 1;
      postDotsCount = 0;
    }
    const preShip = getOrCreateElementById({id: parentId + "-preShip", innerText: ".".repeat(preDotsCount), elementTypeArg: "span"});
    const postShip = getOrCreateElementById({id: parentId + "-postShip", innerText: ".".repeat(postDotsCount), elementTypeArg: "span"});

    const planet2 = getOrCreateElementById({id: parentId + "-planet2", innerText: ship.destination2.name, elementTypeArg: "span"});

    if (!parentDiv.childElementCount) {
      parentDiv.appendChild(shipName);
      parentDiv.appendChild(planet1);
      parentDiv.appendChild(preShip);
      parentDiv.appendChild(shipDisplay);
      parentDiv.appendChild(postShip);
      parentDiv.appendChild(planet2);
    }

  return parentDiv;
}
