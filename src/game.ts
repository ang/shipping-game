import { type Planet, type Ship } from "./types.ts";
import { planetA, planetB, planetC, planetD, ship1 } from "./objects.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const destinationPlanets = [planetB, planetC, planetD];

const upgradeSpeedCost = 5;
let upgradeCapacityCost = 8;

const ships = [ship1];

let credits = 5;
let gameTick = 0;

const upgradeShipSpeed = async (ship: Ship) => {
  if (credits >= ship.upgradeSpeedCost && ship.speed < 4) {
    ship.speed += 1;
    credits -= ship.upgradeSpeedCost;

    switch(ship.speed) {
      case 2:
        ship.upgradeSpeedCost += 2;
        break;
      case 3:
        ship.upgradeSpeedCost += 5;
        break;
    }
  }
}

const upgradeShipCapacity = async (ship: Ship) => {
  if (credits >= ship.upgradeCapacityCost && ship.capacity < 4) {
    ship.capacity += 1;
    credits -= ship.upgradeCapacityCost;
    switch(ship.speed) {
      case 2:
        ship.upgradeCapacityCost += 3;
        break;
      case 3:
        ship.upgradeCapacityCost += 7;
        break;
    }
  }
}

const addShipToPlanet = async (planet: Planet) => {
  if (credits >= planet.launchCost) {
    const ship: Ship = {
      name: "Ship " + (ships.length + 1),
      destination1: planetA,
      destination2: planet,
      speed: 1,
      capacity: 1,
      pos: 0,
      direction: true,
      upgradeSpeedCost,
      upgradeCapacityCost,
    }

    credits -= planet.launchCost;

    planet.launchCost = Math.floor(planet.launchCost * 1.5);

    ships.push(ship);
  }
}

type UpgradeQueueMsg<T> = {
  item: T;
  upgradeFunc: (item: T) => Promise<void>;
}
const shipUpgradeQueue: UpgradeQueueMsg<Ship>[] = [];
const addToShipUpgradeQueue = (item: Ship, upgradeFunc: (item: Ship) => Promise<void>) => {
    shipUpgradeQueue.push({item, upgradeFunc});
}
const planetUpgradeQueue: UpgradeQueueMsg<Planet>[] = [];
const addToPlanetUpgradeQueue = (item: Planet, upgradeFunc: (item: Planet) => Promise<void>) => {
    planetUpgradeQueue.push({item, upgradeFunc});
}

const getOrCreateButton = (
  { id, textContent, onclick, disabled }:
  { id: string, textContent?: string, onclick?: () => void, parentDiv?: HTMLElement, disabled?: boolean}
) => {
  const newButton = getOrCreateElementById({id, elementTypeArg: "button"}) as HTMLButtonElement;
  if (textContent) {
    newButton.textContent = textContent;
  }
  if (onclick) {
    newButton.onclick = onclick;
  }

  newButton.disabled = !!disabled;

  return newButton;
};

const getOrCreateElementById = (
  {id, innerText, elementTypeArg}:
  {id: string, innerText?: string, elementTypeArg?: string}
) => {
    let element = document.getElementById(id);
    if (!element) {
      const elementType = elementTypeArg || "div";
      element = document.createElement(elementType);
      element.id = id
    }
    if (innerText !== undefined) {
      element.innerText = innerText;
    }
    return element;
};

// @ts-ignore declared but its value is never read
const debugPauseUntilClick = () => {
  return new Promise((resolve) => {
    const button = getOrCreateElementById({
      id: 'debugNextButton',
      innerText: "Next",
      elementTypeArg: "button",
    });
    button.addEventListener('click', () => {
      console.log("click");
      resolve(undefined);
    });
  });
};

const main = async () => {
  while (true) {
    updates();
    display();
    // TODO: Only show button etc when in debug mode
    // TODO: even more sophisticated would be start, stop, next
    // await debugPauseUntilClick();
    await sleep(300);
  }
}

const updates = async () => {
  upgradeUpdates();

  ships.forEach((ship) => {
    if (ship.pos >= ship.destination2.pos) {
      ship.direction = false;
      ship.pos == ship.destination2.pos
    }
    else if (ship.pos <= ship.destination1.pos) {
      ship.direction = true;
      ship.pos == ship.destination1.pos
      if (gameTick !== 0) {
        credits += ship.capacity * ship.destination2.goods;
      }
    }
    if (ship.direction) {
        ship.pos += ship.speed;
    } else {
      ship.pos -= ship.speed;
    }
  });

  gameTick += 1;
}

const upgradeUpdates = async () => {
  // This upgrade queuing system to prevent Nathan from cheating hopefully.
  for (const queueMsg of shipUpgradeQueue) {
    const { item, upgradeFunc } = queueMsg;
    await upgradeFunc(item);
  }
  shipUpgradeQueue.length = 0;
  for (const queueMsg of planetUpgradeQueue) {
    const { item, upgradeFunc } = queueMsg;
    await upgradeFunc(item);
  }
  planetUpgradeQueue.length = 0;
}

const display = () => {
  // Ship Display
  const shipsDiv = getOrCreateElementById({id: "ships"});

  ships.forEach((ship) => {
    const parentId = "shipParent-" + ship.name;
    const parentDiv = getOrCreateElementById({id: parentId});
    const shipName = getOrCreateElementById({id: parentId + "-shipName", innerText: ship.name + ": ", elementTypeArg: "span"});
    const planet1 = getOrCreateElementById({id: parentId + "-planet1", innerText: ship.destination1.name, elementTypeArg: "span"});

    let shipInnerText = ""
    if (ship.pos > 0 && ship.pos < ship.destination2.pos) {
      if (ship.direction) {
        shipInnerText += ">"
      } else {
        shipInnerText += "<"
      }

      if (ship.capacity === 2) {
        shipInnerText += "=";
      } else if (ship.capacity === 3) {
        shipInnerText += "==";
      } else if (ship.capacity > 3) {
        shipInnerText += "===";
      }

      if (ship.speed === 2) {
        shipInnerText += "~"
      } else if (ship.speed > 2) {
        const speedDis = ship.direction ? "}" : "{";

        if (ship.speed === 3) {
          shipInnerText += speedDis;
        } else if (ship.speed > 3) {
          shipInnerText += speedDis + speedDis;
        }
      }

      let shipLengthCut = 0; Math.min(ship.pos, shipInnerText.length);
      if (ship.direction) {
        shipLengthCut = Math.min(ship.pos, shipInnerText.length);
      } else {
        shipLengthCut = Math.min(ship.destination2.pos - ship.pos, shipInnerText.length);
      }
      shipInnerText = shipInnerText.substring(0, shipLengthCut);

      if (ship.direction) {
        shipInnerText = shipInnerText.split("").reverse().join("");
      }
    }
    const shipDisplay = getOrCreateElementById({id: parentId + "-shipDisplay", innerText: shipInnerText, elementTypeArg: "span"});
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

    parentDiv.appendChild(shipName);
    parentDiv.appendChild(planet1);
    parentDiv.appendChild(preShip);
    parentDiv.appendChild(shipDisplay);
    parentDiv.appendChild(postShip);
    parentDiv.appendChild(planet2);
    shipsDiv.appendChild(parentDiv);
  });

  // Game info
  const gameInfoDiv = getOrCreateElementById({id: "gameInfo"});

  let creditsDiv = getOrCreateElementById({
    id: "credits",
    innerText: "Credits: " + credits.toString(),
  });
  gameInfoDiv.appendChild(creditsDiv);

  // const gameTickId = "game";
  // let gameTickDiv = document.getElementById(gameTickId);
  // if (!gameTickDiv) {
  //   gameTickDiv = document.createElement("div");
  //   gameTickDiv.id = gameTickId;
  //   gameInfoDiv?.appendChild(gameTickDiv);
  // }
  // gameTickDiv.innerText = "Game tick: " + gameTick.toString();

  // Ships Info
  const shipsInfoDiv = getOrCreateElementById({id: "shipsInfo"});
  ships.forEach((ship) => {
    const shipInfoDiv = getOrCreateElementById({id: "shipInfo-" + ship.name});
    shipInfoDiv.className = "shipInfo";

    const shipName = getOrCreateElementById({id: "shipInfo-name-" + ship.name, innerText: ship.name});
    const destination = getOrCreateElementById({id: "shipInfo-destination-" + ship.name, innerText: "Destination: Planet " + ship.destination2.name});
    const speed = getOrCreateElementById({id: "shipInfo-speed-" + ship.name, innerText: "Speed: " + ship.speed});
    const capacity = getOrCreateElementById({id: "shipInfo-capacity-" + ship.name, innerText: "Capacity: " + ship.capacity});

    const addSpeedId = "addSpeed" + ship.name;
    const addSpeedButton = getOrCreateButton({
      id: addSpeedId,
      textContent: "Upgrade speed " + "(" + ship.upgradeSpeedCost + " credits)",
      onclick:  () => { addToShipUpgradeQueue(ship, upgradeShipSpeed) },
      disabled: credits < ship.upgradeSpeedCost || ship.speed === 4,
    });
    if (ship.speed === 4) {
      speed.textContent += " (MAX)";
      addSpeedButton.textContent = "Upgrade speed"
      addSpeedButton.disabled = true;
    }

    const addCapacityId = "addCapacity" + ship.name;
    const addCapacityButton = getOrCreateButton({
      id: addCapacityId,
      textContent: "Upgrade capacity " + "(" + ship.upgradeCapacityCost + " credits)",
      onclick: () => { addToShipUpgradeQueue(ship, upgradeShipCapacity) },
      disabled: credits < ship.upgradeCapacityCost,
    });
    if (ship.capacity === 4) {
      capacity.textContent += " (MAX)";
      addCapacityButton.textContent = "Upgrade capacity"
      addCapacityButton.disabled = true;
    }

    shipInfoDiv.appendChild(shipName);
    shipInfoDiv.appendChild(destination);
    shipInfoDiv.appendChild(speed);
    shipInfoDiv.appendChild(capacity);
    shipInfoDiv.appendChild(addSpeedButton);
    shipInfoDiv.appendChild(addCapacityButton);
    shipsInfoDiv.appendChild(shipInfoDiv);
  });

  // Add ship to existing planet
  const planetsInfo = getOrCreateElementById({id: "planetsInfo"});
  destinationPlanets.forEach((planet) => {
    const planetId = "planetInfo-" + planet.name;
    const planetInfo = getOrCreateElementById({id: planetId});
    planetInfo.className = "planetInfo";

    const planetName = getOrCreateElementById({id: planetId + "-name", innerText: "Planet " + planet.name});
    const planetDisplay = getOrCreateElementById({id: planetId + "-display", innerText: planet.display});
    planetDisplay.className = "planetDisplay";
    const hasShipsInPlanet = ships.find((ship) => ship.destination2 === planet);
    if (!hasShipsInPlanet) {
      planetDisplay.innerText = planetDisplay.innerText.replace(/[ \t]/g, '/');
    }

    const distanceText = hasShipsInPlanet ? planet.pos : "???"
    const distance = getOrCreateElementById({id: planetId + "-distance", innerText: "Distance: " + distanceText});
    const goodsText = hasShipsInPlanet ? planet.goods : "???"
    const goodsMultiplier = getOrCreateElementById({id: planetId + "-goods", innerText: "Goods multiplier: " + goodsText});

    const addShipButton = getOrCreateButton({
      id: "addShip" + planet.name,
      textContent: "Launch new ship (" + planet.launchCost + " credits)",
      onclick: () => {
        addToPlanetUpgradeQueue(planet, addShipToPlanet);
      },
      disabled: credits < planet.launchCost,
    });
    planetsInfo.append(planetInfo);
    planetInfo.appendChild(planetName);
    planetInfo.appendChild(planetDisplay);
    planetInfo.appendChild(distance);
    planetInfo.appendChild(goodsMultiplier);
    planetInfo.appendChild(addShipButton);
  });
}

main();
