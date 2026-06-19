import { type Planet, type Ship, type State, type Miner } from "./types.ts";
import { loadState, getDefaultState, saveState, resetState } from "./state.ts";
import { getOrCreateElementById, getOrCreateButton, roundValue } from "./common.ts";
import {
  getOrCreateAddMinerButton,
  getOrCreateMiningDisplay,
  getOrCreateMiningResourcesDiv,
  getOrCreateRemoveMinerButton,
  getOrCreateResearchMiningButton,
  updateMining,
} from "./mining.ts";
import { upgradeUpdates, addToUpgradeQueue } from "./upgradeQueue.ts";
import { getOrCreateShipDisplay } from "./ship.ts";
import {
  getOrCreateBuildSpacePortButton,
  getOrCreateSpacePortDisplay,
} from "./spacePort.ts";
import { SHIP_SPEED_MAX } from "./constants.ts";
import { autoUpgrade } from "./autoUpgrade.ts";
import { addShipToPlanet } from "./launchShip.ts";
import { getOrCreateDebugTools } from "./debug.ts";

const MAX_CAPACITY = 4;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const saveStateTimeMs = 1000;

let state: State = getDefaultState();

const upgradeShipSpeed = async (ship: Ship) => {
  if (state.credits >= ship.upgradeSpeedCost && ship.speed < SHIP_SPEED_MAX) {
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

const main = async () => {
  init();

  let saveStateCurrTime = new Date();

  while (true) {
    if (!state.debug.isPaused || state.debug.nextStep) {
      updates();
      display();
    }

    if (state.debug.nextStep) {
      state.debug.nextStep = false;
    }

    const saveStateEndTime = new Date();
    const saveStateElapsedTimeMs = saveStateEndTime.getTime() - saveStateCurrTime.getTime();
    if (saveStateElapsedTimeMs > saveStateTimeMs) {
      saveState(state);
      saveStateCurrTime = saveStateEndTime;
    }

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
        const miners = destination2.miningInfo.miners;
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

  autoUpgrade(state);

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

  const planetBResourcesDiv = getOrCreateMiningResourcesDiv(state.planets[0]);
  const planetCResourcesDiv = getOrCreateMiningResourcesDiv(state.planets[1]);
  const planetDResourcesDiv = getOrCreateMiningResourcesDiv(state.planets[2]);
  const debugTools = getOrCreateDebugTools(state);

  if (!gameInfoDiv.childElementCount) {
    gameInfoDiv.appendChild(creditsDiv);
    gameInfoDiv.appendChild(planetBResourcesDiv);
    gameInfoDiv.appendChild(planetCResourcesDiv);
    gameInfoDiv.appendChild(planetDResourcesDiv);
    gameInfoDiv.appendChild(debugTools);
  }

  // Ships Info
  const shipsInfoDiv = getOrCreateElementById({id: "shipsInfo"});
  state.ships.forEach((ship) => {
    const shipInfoId = "shipInfo-" + ship.name.split(" ").join("-");
    const shipInfoDiv = getOrCreateElementById({id: shipInfoId});
    shipInfoDiv.className = "shipInfo";

    const shipName = getOrCreateElementById({id: shipInfoId + "-" + ship.name, innerText: ship.name});
    const destination = getOrCreateElementById({id: shipInfoId + "-destination", innerText: "Destination: Planet " + ship.destination2.name});
    const speed = getOrCreateElementById({id: shipInfoId + "-speed", innerText: "Speed: " + ship.speed});
    if (ship.speed === SHIP_SPEED_MAX) {
      speed.textContent += " (MAX)";
    }
    const capacity = getOrCreateElementById({id: shipInfoId + "-capacity", innerText: "Capacity: " + ship.capacity});
    if (ship.capacity === MAX_CAPACITY) {
      capacity.textContent += " (MAX)";
    }

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

    if (!document.getElementById(shipInfoDiv.id)) {
      shipsInfoDiv.appendChild(shipInfoDiv);
    }
  });

  // Add ship to existing planet
  const planetsInfo = getOrCreateElementById({id: "planetsInfo"});
  state.planets.forEach((planet) => {
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
    const miners = planet.miningInfo.miners;
    const goodsText = hasShipsInPlanet ? getEffectiveGoodsMultipler(miners, planet) : "???"
    const goodsMultiplier = getOrCreateElementById({id: planetId + "-goods", innerText: "Goods multiplier: " + goodsText});

    const addShipButton = getOrCreateButton({
      id: planetId + "addShip",
      textContent: "Launch new ship (" + planet.launchCost + " credits)",
      onclick: () => {
        addToUpgradeQueue({ fn: addShipToPlanet, params: [state, planet] });
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
    const pollutionPenalty = getPollutionPenalty(miners, planet);
    const pollutionPenaltyDiv = getOrCreateElementById({id: planetId + "-pollutionPenalty", innerText: "Mining pollution penalty: " + pollutionPenalty});
    planetInfo.appendChild(researchMiningButton);
    if (miners.length !== 0) {
      goodsMultiplier.insertAdjacentElement('afterend', pollutionPenaltyDiv);
    }

    // TODO: Instead of three returns, just have a single function return one item
    const addMinerButton = getOrCreateAddMinerButton(state, planet);
    const removeMinerButton = getOrCreateRemoveMinerButton(state, planet);
    const miningDisplay = getOrCreateMiningDisplay(planet);
    planetInfo.appendChild(miningDisplay);
    planetInfo.appendChild(addMinerButton);
    planetInfo.appendChild(removeMinerButton);

    // Space port
    const buildSpacePortButton = getOrCreateBuildSpacePortButton(state, planet);
    addShipButton.insertAdjacentElement('afterend', buildSpacePortButton);

    const spacePortDisplay = getOrCreateSpacePortDisplay(state, planet);

    miningDisplay.insertAdjacentElement('beforebegin', spacePortDisplay);

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
