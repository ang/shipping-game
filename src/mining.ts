import { type State, type Planet, type Miner } from "./types.ts";
import { getOrCreateButton, getOrCreateElementById } from "./common.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";

const MINING_DEPTH = 10;
const MINING_WIDTH = 10;

const ADD_MINER_BASE_COST = 200;
const REMOVE_MINER_BASE_COST = 200;

export const updateMining = async (state: State) => {
  state.planets.forEach((planet) => {
    const miners = planet.miningInfo.miners;
    for (let i = 0; i < miners.length; i++) {
      const miner = miners[i];
      if (miner.pos === 0) {
        miner.direction = true;
      } else if (miner.pos === MINING_DEPTH - 1) {
        // TODO fix this constant
        miner.direction = false;
      }
      if (miner.direction) {
        miner.pos += 1;
      } else {
        miner.pos -= 1;
      }

      if (miner.pos === 0) {
        // TODO is this needed?
        // if (!state.miningInfoByPlanetName[planetName]) {
        //   state.miningInfoByPlanetName[planetName] = {
        //     planetName: planetName, miners: [], resources: 0
        //   }
        // }
        planet.miningInfo.resources.amount++;
      }
    }
  });
}

export const getOrCreateMiningResourcesDiv = (planet: Planet): HTMLElement => {
  const miningResource = planet.miningInfo.resources;
  let miningResourcesDiv = getOrCreateElementById({
    id: `${planet.name}-mining-resources`,
    innerText: `${miningResource.name} (${miningResource.symbol}): ${planet.miningInfo.resources.amount}`,
  });
  miningResourcesDiv.style.display = isResearchUnlocked(planet) ? 'block' : 'none';
  miningResourcesDiv.style.color = miningResource.color;

  return miningResourcesDiv;
}

const researchMining = async (planet: Planet, state: State) => {
  if (canAddMiner(state, planet.miningInfo.resources.researchCost, planet.miningInfo.miners)) {
    planet.miningInfo.miningUnlocked = true;
    addMiner(planet, state, planet.miningInfo.resources.researchCost);
  }
}

export const isResearchMiningAvailable = (state: State): boolean => {
  const planetSet: Set<string> = new Set();
  state.ships.forEach((ship) => { planetSet.add(ship.destination2.name) });
  return planetSet.size >= 3;
}

export const getOrCreateResearchMiningButton = (state: State, planet: Planet): HTMLButtonElement => {
  // Only show when you have launched ships on all planets
  const researchMiningButton = getOrCreateButton({
    id: `${planet.name}-researchMining`,
    textContent: `Research mining (${planet.miningInfo.resources.researchCost} credits)`,
    onclick: () => {
      addToUpgradeQueue({fn: researchMining, params: [planet, state]});
    },
    disabled: state.credits < planet.miningInfo.resources.researchCost,
  });

  const planetSet: Set<string> = new Set();
  state.ships.forEach((ship) => { planetSet.add(ship.destination2.name) });
  const displayButton = isResearchMiningAvailable(state) && !isResearchUnlocked(planet);

  researchMiningButton.style.display = displayButton ? 'block' : 'none';

  return researchMiningButton;
}

export const isResearchUnlocked = (planet: Planet): boolean => {
  return planet.miningInfo.miningUnlocked;
}

const isMaxMiners = (miners: Miner[]): boolean => {
  return miners.length >= MINING_WIDTH;
}

const canAddMiner = (state: State, cost: number, miners: Miner[]): boolean => {
  return state.credits >= cost && !isMaxMiners(miners);
}

const addMiner = async (planet: Planet, state: State, cost: number) => {
  if (!isResearchUnlocked(planet)) {
    return;
  }

  const miners = planet.miningInfo.miners;

  if (canAddMiner(state, cost, miners)) {
    miners.push({pos: 0, direction: true});
    state.credits -= cost;
  }
}

export const getOrCreateAddMinerButton = (state: State, planet: Planet): HTMLButtonElement => {
  const miners = planet.miningInfo.miners;
  const addMinerCost = ADD_MINER_BASE_COST * (miners).length
  const isCanAddMiner = canAddMiner(state, addMinerCost, miners);

  const addMinerButton = getOrCreateButton({
    id: `${planet.name}-addMiner`,
    textContent: isMaxMiners(miners) ? `Add miner` : `Add miner (${addMinerCost} credits)`,
    onclick: () => {
      addToUpgradeQueue({fn: addMiner, params: [planet, state, addMinerCost]});
    },
    disabled: !isCanAddMiner,
  });

  addMinerButton.style.display = isResearchUnlocked(planet) ? 'block' : 'none';

  return addMinerButton;
}

const isMinMiners = (miners: Miner[]): boolean => {
  return miners.length <= 1;
}

const canRemoveMiner = (state: State, cost: number, miners: Miner[]): boolean => {
  return state.credits >= cost && !isMinMiners(miners);
}

const removeMiner = async (planet: Planet, state: State, cost: number) => {
  if (!isResearchUnlocked(planet)) {
    return;
  }

  const miners = planet.miningInfo.miners;

  if (canRemoveMiner(state, cost, miners)) {
    miners.pop();
    state.credits -= cost;
  }
}

export const getOrCreateRemoveMinerButton = (state: State, planet: Planet): HTMLButtonElement => {
    const miners = planet.miningInfo.miners;
    const removeMinerCost = REMOVE_MINER_BASE_COST * (miners).length

    const removeMinerButton = getOrCreateButton({
      id: `${planet.name}-removeMiner`,
      textContent: isMinMiners(miners) ? `Remove miner` : `Remove miner (${removeMinerCost} credits)`,
      onclick: () => {
        addToUpgradeQueue({fn: removeMiner, params: [planet, state, removeMinerCost]});
      },
      disabled: !canRemoveMiner(state, removeMinerCost, miners),
    });

    removeMinerButton.style.display = isResearchUnlocked(planet) ? 'block' : 'none';

    return removeMinerButton;
}

export const getOrCreateMiningDisplay = (planet: Planet): HTMLElement => {
  const miningDisplay = getOrCreateElementById({id: `${planet.name}-mining-display`});
  const displayRows: HTMLElement[] = [];

  const miners = planet.miningInfo.miners;
  if (miners) {
    const symbolHtml = getSymbolHtml(planet);
    for (let row = 0; row < MINING_DEPTH; row++) {
      const miningDisplayRow = getOrCreateElementById({id: `${planet.name}-mining-display-${row}`});
      let miningDisplayInnerHTML = "<div>";
      for (let col = 0; col < MINING_WIDTH; col++) {
        const currMiner = miners[col];
        if (currMiner && currMiner.pos === row) {
          if (currMiner.direction) {
            miningDisplayInnerHTML += "v";
          } else {
            miningDisplayInnerHTML += "^";
          }
        } else if (currMiner && row < currMiner.pos) {
          miningDisplayInnerHTML += "|";
        } else if (row === MINING_DEPTH - 1) {
          miningDisplayInnerHTML += symbolHtml;
        } else if (currMiner && row === currMiner.pos + 1 && !currMiner.direction) {
          miningDisplayInnerHTML += symbolHtml;
        } else {
          miningDisplayInnerHTML += "~";
        }
      }
      miningDisplayInnerHTML += "</div>";
      miningDisplayRow.innerHTML = miningDisplayInnerHTML;
      displayRows.push(miningDisplayRow);
    }

    if (!miningDisplay.childElementCount) {
      displayRows.forEach((row) => miningDisplay.appendChild(row));
    }
  }

  return miningDisplay;
}

export const getSymbolHtml = (planet: Planet, showColor: boolean = true): string => {
  const color = showColor ? planet.miningInfo.resources.color : "";
  return `<span style="color: ${color}">${planet.miningInfo.resources.symbol}</span>`;
}
