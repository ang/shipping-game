import { type Planet, type Ship, type State, type Miner } from "./types.ts";
import { planetA, planetB, planetC, planetD } from "./objects.ts";
import { loadState, getDefaultState, saveState, resetState } from "./state.ts";
import { getOrCreateElementById, getOrCreateButton, roundValue } from "./common.ts";
import {
  getOrCreateAddMinerButton,
  getOrCreateMiningDisplay,
  getOrCreateMiningResourcesDiv,
  getOrCreateRemoveMinerButton,
  getOrCreateResearchMiningButton,
  isResearchMiningAvailable,
  updateMining,
} from "./mining.ts";
import {
  getOrCreateAddSuperSpeedButton,
  getOrCreateAddSuperCapacityButton,
  MAX_CAPACITY_FROM_MINING_RESOURCES,
  MAX_SPEED_FROM_MINING_RESOURCES,
} from "./miningShipUpgrades.ts";
import { upgradeUpdates, addToUpgradeQueue } from "./upgradeQueue.ts";
import { getOrCreateShipDisplay } from "./ship.ts";

const MAX_SPEED = 4;
const MAX_CAPACITY = 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const destinationPlanets = [planetB, planetC, planetD];

const upgradeSpeedCost = 5;
const upgradeCapacityCost = 8;

const saveStateTimeMs = 1000;

let state: State = getDefaultState();

const upgradeShipSpeed = async (ship: Ship) => {
  if (state.credits >= ship.upgradeSpeedCost && ship.speed < MAX_SPEED) {
    ship.speed += 1;
    state.credits -= ship.upgradeSpeedCost;

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
  if (state.credits >= ship.upgradeCapacityCost && ship.capacity < MAX_CAPACITY) {
    ship.capacity += 1;
    state.credits -= ship.upgradeCapacityCost;
    switch(ship.capacity) {
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
  if (state.credits >= planet.launchCost) {
    const ship: Ship = {
      name: "Ship " + (state.ships.length + 1),
      destination1: planetA,
      destination2: planet,
      speed: 1,
      capacity: 1,
      pos: 0,
      direction: true,
      upgradeSpeedCost,
      upgradeCapacityCost,
    }

    state.credits -= planet.launchCost;

    planet.launchCost = Math.floor(planet.launchCost * 1.5);

    state.ships.push(ship);
  }
}

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
  init();

  let saveStateCurrTime = new Date();

  while (true) {
    updates();
    display();

    const saveStateEndTime = new Date();
    const saveStateElapsedTimeMs = saveStateEndTime.getTime() - saveStateCurrTime.getTime();
    if (saveStateElapsedTimeMs > saveStateTimeMs) {
      saveState(state);
      saveStateCurrTime = saveStateEndTime;
    }

    // TODO: Only show button etc when in debug mode
    // TODO: even more sophisticated would be start, stop, next
    // await debugPauseUntilClick();

    await sleep(300);
  }
}

const init = () => {
  state = loadState();

  // Configure reset button
  getOrCreateButton({
    id: "resetGame",
    textContent: "Reset Game",
    onclick:  () => {
      const userConfirmed = confirm("Are you sure you want to reset the game?");
      if (userConfirmed) {
        resetGame();
      }
    },
  });
}

const resetGame = () => {
  state = resetState();

  // TODO: Pretty hacky display reset. I remove all the elements and then
  // put readd them back with prepend. Using prepend because I have some
  // items like the resetGame button that I don't remove and readd
  // Probably ideally I would remove everything and readd it for a true
  // refresh?
  const elementIdsToRemove = ["ships", "gameInfo", "shipsInfo", "planetsInfo"].reverse();
  for (let i in elementIdsToRemove) {
    const elementId = elementIdsToRemove[i];
    const elementToRemove = document.getElementById(elementId);
    if (elementToRemove) {
      elementToRemove.remove();
      const newElement = document.createElement('div')
      newElement.id = elementId;
      document.body.prepend(newElement);
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const updates = async () => {
  upgradeUpdates();

  state.ships.forEach((ship) => {
    if (ship.pos >= ship.destination2.pos) {
      ship.direction = false;
      ship.pos == ship.destination2.pos
    }
    else if (ship.pos <= ship.destination1.pos) {
      ship.direction = true;
      ship.pos == ship.destination1.pos
      if (state.gameTick !== 0) {
        const destination2 = ship.destination2;
        const miners = state.miningInfoByPlanetName[destination2.name]?.miners || [];
        const addingCredit = ship.capacity * getEffectiveGoodsMultipler(miners, destination2);
        state.credits = roundValue(state.credits + addingCredit);
      }
    }
    if (ship.direction) {
        ship.pos += ship.speed;
    } else {
      ship.pos -= ship.speed;
    }
  });

  updateMining(state);

  state.gameTick += 1;
}

const display = () => {
  // Ship Display
  const shipsDiv = getOrCreateElementById({id: "ships"});

  state.ships.forEach((ship) => {
    const shipDiv = getOrCreateShipDisplay(ship, state);
    if (!document.getElementById(shipDiv.id)) {
      shipsDiv.appendChild(shipDiv);
    }
  });

  // Game info
  const gameInfoDiv = getOrCreateElementById({id: "gameInfo"});

  const creditsDiv = getOrCreateElementById({
    id: "credits",
    innerText: "Credits: " + state.credits.toString(),
  });

  const planetBResourcesDiv = getOrCreateMiningResourcesDiv(state, planetB);
  const planetCResourcesDiv = getOrCreateMiningResourcesDiv(state, planetC);
  const planetDResourcesDiv = getOrCreateMiningResourcesDiv(state, planetD);

  if (!gameInfoDiv.childElementCount) {
    gameInfoDiv.appendChild(creditsDiv);
    gameInfoDiv.appendChild(planetBResourcesDiv);
    gameInfoDiv.appendChild(planetCResourcesDiv);
    gameInfoDiv.appendChild(planetDResourcesDiv);
  }

  // const gameTickId = "game";
  // let gameTickDiv = document.getElementById(gameTickId);
  // if (!gameTickDiv) {
  //   gameTickDiv = document.createElement("div");
  //   gameTickDiv.id = gameTickId;
  //   gameInfoDiv?.appendChild(gameTickDiv);
  // }
  // gameTickDiv.innerText = "Game tick: " + state.gameTick.toString();

  // Ships Info
  const shipsInfoDiv = getOrCreateElementById({id: "shipsInfo"});
  state.ships.forEach((ship) => {
    const shipInfoId = "shipInfo-" + ship.name.split(" ").join("-");
    const shipInfoDiv = getOrCreateElementById({id: shipInfoId});
    shipInfoDiv.className = "shipInfo";

    const shipName = getOrCreateElementById({id: shipInfoId + "-" + ship.name, innerText: ship.name});
    const destination = getOrCreateElementById({id: shipInfoId + "-destination", innerText: "Destination: Planet " + ship.destination2.name});
    const speed = getOrCreateElementById({id: shipInfoId + "-speed", innerText: "Speed: " + ship.speed});
    if (ship.speed === MAX_SPEED) {
      speed.textContent += " (MAX)";
    } else if (ship.speed === MAX_SPEED_FROM_MINING_RESOURCES) {
      speed.textContent += " (MAX+)";
    }
    const capacity = getOrCreateElementById({id: shipInfoId + "-capacity", innerText: "Capacity: " + ship.capacity});
    if (ship.capacity === MAX_CAPACITY) {
      capacity.textContent += " (MAX)";
    } else if (ship.capacity === MAX_CAPACITY_FROM_MINING_RESOURCES) {
      capacity.textContent += " (MAX+)";
    }

    // Improved speed: Mostly planet one, some planet two resources. Maybe some credits.
    // Improved capacity: Mostly planet two, some planet one resources. Maybe some credits.
    // This appears when:
    // 1. Unlocked mining in general
    // Speed upgrades: +2, +2, +2. Change the colors of the ship. First change the head, then change the back.
    // Capacity upgrades: +2, +2, +2. Change the colors of the ship on the inside
    const addSpeedButton = getOrCreateButton({
      id: shipInfoId + "-addSpeed",
      textContent: ship.speed >= 4 ? "Upgrade speed" : `Upgrade speed (${ship.upgradeSpeedCost} credits)`,
      onclick:  () => { addToUpgradeQueue({ fn: upgradeShipSpeed, params: [ship] }) },
      disabled: state.credits < ship.upgradeSpeedCost || ship.speed >= 4,
    });

    const addCapacityButton = getOrCreateButton({
      id: shipInfoId + "-addCapacity",
      textContent: ship.capacity >= 4 ? "Upgrade capacity" : `Upgrade capacity (${ship.upgradeCapacityCost} credits)`,
      onclick: () => { addToUpgradeQueue({ fn: upgradeShipCapacity, params: [ship] }) },
      disabled: state.credits < ship.upgradeCapacityCost || ship.capacity >= 4,
    });

    if (!shipInfoDiv.childElementCount) {
      shipInfoDiv.appendChild(shipName);
      shipInfoDiv.appendChild(destination);
      shipInfoDiv.appendChild(speed);
      shipInfoDiv.appendChild(capacity);
      shipInfoDiv.appendChild(addSpeedButton);
      shipInfoDiv.appendChild(addCapacityButton);
    }

    const addSuperSpeedButton = getOrCreateAddSuperSpeedButton(ship, state);
    const addSuperCapacityButton = getOrCreateAddSuperCapacityButton(ship, state);

    if (isResearchMiningAvailable(state)) {
      shipInfoDiv.appendChild(addSuperSpeedButton);
      shipInfoDiv.appendChild(addSuperCapacityButton);
    }

    if (!document.getElementById(shipInfoDiv.id)) {
      shipsInfoDiv.appendChild(shipInfoDiv);
    }
  });

  // Add ship to existing planet
  const planetsInfo = getOrCreateElementById({id: "planetsInfo"});
  destinationPlanets.forEach((planet) => {
    const planetId = "planetInfo-" + planet.name.split(" ").join("-");
    const planetInfo = getOrCreateElementById({id: planetId});
    planetInfo.className = "planetInfo";

    const planetName = getOrCreateElementById({id: planetId + "-name", innerText: "Planet " + planet.name});
    const planetDisplay = getOrCreateElementById({id: planetId + "-display", innerText: planet.display});
    planetDisplay.className = "planetDisplay";
    const hasShipsInPlanet = state.ships.find((ship) => ship.destination2.name === planet.name);
    if (!hasShipsInPlanet) {
      planetDisplay.innerText = planetDisplay.innerText.replace(/[ \t]/g, '/');
    }

    const distanceText = hasShipsInPlanet ? planet.pos : "???"
    const distance = getOrCreateElementById({id: planetId + "-distance", innerText: "Distance: " + distanceText});
    const miners = state.miningInfoByPlanetName[planet.name]?.miners || [];
    const goodsText = hasShipsInPlanet ? getEffectiveGoodsMultipler(miners, planet) : "???"
    const goodsMultiplier = getOrCreateElementById({id: planetId + "-goods", innerText: "Goods multiplier: " + goodsText});

    const addShipButton = getOrCreateButton({
      id: planetId + "addShip",
      textContent: "Launch new ship (" + planet.launchCost + " credits)",
      onclick: () => {
        addToUpgradeQueue({ fn: addShipToPlanet, params: [planet] });
      },
      disabled: state.credits < planet.launchCost,
    });

    if (!planetInfo.childElementCount) {
      planetInfo.appendChild(planetName);
      planetInfo.appendChild(planetDisplay);
      planetInfo.appendChild(distance);
      planetInfo.appendChild(goodsMultiplier);
      planetInfo.appendChild(addShipButton);
    }

    // Mining
    const researchMiningButton = getOrCreateResearchMiningButton(state, planet);
    const addMinerButton = getOrCreateAddMinerButton(state, planet);
    const removeMinerButton = getOrCreateRemoveMinerButton(state, planet);
    let pollutionPenalty = getPollutionPenalty(miners, planet);
    const pollutionPenaltyDiv = getOrCreateElementById({id: planetId + "-pollutionPenalty", innerText: "Pollution penalty: " + pollutionPenalty});
    planetInfo.appendChild(researchMiningButton);
    planetInfo.appendChild(addMinerButton);
    planetInfo.appendChild(removeMinerButton);
    if (miners.length !== 0) {
      const miningDisplay = getOrCreateMiningDisplay(state, planet);
      planetDisplay.insertAdjacentElement('afterend', miningDisplay);
      goodsMultiplier.insertAdjacentElement('afterend', pollutionPenaltyDiv);
    }

    if (!document.getElementById(planetInfo.id)) {
      planetsInfo.append(planetInfo);
    }
  });
}

const getEffectiveGoodsMultipler = (miners: Miner[], planet: Planet): number => {
  return roundValue(planet.goods - getPollutionPenalty(miners, planet));
}

const getPollutionPenalty = (miners: Miner[], planet: Planet): number => {
  let pollutionPenalty = (miners.length - 1) * 0.1 * planet.goods;
  if (miners.length <= 1) {
    pollutionPenalty = 0;
  }
  return roundValue(pollutionPenalty);
}

main();
