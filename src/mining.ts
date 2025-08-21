import { type State, type Planet, type Miner } from "./types.ts";
import { getOrCreateButton, getOrCreateElementById } from "./common.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";

const MINING_DEPTH = 10;
const MINING_WIDTH = 10;

const ADD_MINER_BASE_COST = 200;
const REMOVE_MINER_BASE_COST = 200;

export const updateMining = async (state: State) => {
  for (const planetName in state.minersByPlanetName) {
    const miners = state.minersByPlanetName[planetName];
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
        if (!state.miningResourcesByPlanetName[planetName]) {
          state.miningResourcesByPlanetName[planetName] = 0;
        }
        state.miningResourcesByPlanetName[planetName]++;
      }
    }
  }
}

export const getOrCreateMiningResourcesDiv = (state: State, planet: Planet): HTMLElement => {
  // TODO generalize to more planets
  let miningResourcesDiv = getOrCreateElementById({
    id: `${planet.name}-mining-resources`,
    innerText: `${planet.specialResourceName}: ${state.miningResourcesByPlanetName[planet.name] || 0}`,
  });
  const hasMining = Boolean(state.minersByPlanetName[planet.name]);
  miningResourcesDiv.style.display = hasMining ? 'block' : 'none';

  return miningResourcesDiv;
}

const researchMining = async (planet: Planet, state: State) => {
  if (canAddMiner(state, planet.specialResourceCost, state.minersByPlanetName[planet.name] || [])) {
    state.miningPlanets.push(planet);
    addMiner(planet, state, planet.specialResourceCost);
  }
}

export const getOrCreateResearchMiningButton = (state: State, planet: Planet): HTMLButtonElement => {
  // Only show when you have launched ships on all planets
  const researchMiningButton = getOrCreateButton({
    id: `${planet.name}-researchMining`,
    textContent: `Research mining ${planet.specialResourceName} (${planet.specialResourceCost} credits)`,
    onclick: () => {
      addToUpgradeQueue({fn: researchMining, params: [planet, state]});
    },
    disabled: state.credits < planet.specialResourceCost,
  });

  const planetSet: Set<string> = new Set();
  state.ships.forEach((ship) => { planetSet.add(ship.destination2.name) });
  const researchMiningUnlocked = planetSet.size >= 3;
  const hasResearch = Boolean(state.minersByPlanetName[planet.name]);
  const displayButton = researchMiningUnlocked && !hasResearch;

  researchMiningButton.style.display = displayButton ? 'block' : 'none';

  return researchMiningButton;
}

const isMaxMiners = (miners: Miner[]): boolean => {
  return miners.length >= MINING_WIDTH;
}

const canAddMiner = (state: State, cost: number, miners: Miner[]): boolean => {
  return state.credits >= cost && !isMaxMiners(miners);
}

const addMiner = async (planet: Planet, state: State, cost: number) => {
  if (!state.minersByPlanetName[planet.name]) {
    state.minersByPlanetName[planet.name] = [];
  }

  const miners = state.minersByPlanetName[planet.name];

  if (canAddMiner(state, cost, miners)) {
    miners.push({planet, pos: 0, direction: true});
    state.credits -= cost;
  }
}

export const getOrCreateAddMinerButton = (state: State, planet: Planet): HTMLButtonElement => {
  const miners = state.minersByPlanetName[planet.name] || [];
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

  const hasMining = Boolean(state.minersByPlanetName[planet.name]);
  addMinerButton.style.display = hasMining ? 'block' : 'none';

  return addMinerButton;
}

const isMinMiners = (miners: Miner[]): boolean => {
  return miners.length <= 1;
}

const canRemoveMiner = (state: State, cost: number, miners: Miner[]): boolean => {
  return state.credits >= cost && !isMinMiners(miners);
}

const removeMiner = async (planet: Planet, state: State, cost: number) => {
  if (!state.minersByPlanetName[planet.name]) {
    state.minersByPlanetName[planet.name] = [];
  }

  const miners = state.minersByPlanetName[planet.name];

  if (canRemoveMiner(state, cost, miners)) {
    miners.pop();
    state.credits -= cost;
  }
}

export const getOrCreateRemoveMinerButton = (state: State, planet: Planet): HTMLButtonElement => {
    const miners = state.minersByPlanetName[planet.name] || [];
    const removeMinerCost = REMOVE_MINER_BASE_COST * (miners).length

    const removeMinerButton = getOrCreateButton({
      id: `${planet.name}-removeMiner`,
      textContent: isMinMiners(miners) ? `Remove miner` : `Remove miner (${removeMinerCost} credits)`,
      onclick: () => {
        addToUpgradeQueue({fn: removeMiner, params: [planet, state, removeMinerCost]});
      },
      disabled: !canRemoveMiner(state, removeMinerCost, miners),
    });

    const hasMining = Boolean(state.minersByPlanetName[planet.name]);
    removeMinerButton.style.display = hasMining ? 'block' : 'none';

    return removeMinerButton;
}

export const getOrCreateMiningDisplay = (state: State, planet: Planet): HTMLElement => {
  const miningDisplay = getOrCreateElementById({id: `${planet.name}-mining-display`});

  const miners = state.minersByPlanetName[planet.name];
  if (miners) {
    let miningDisplayInnerText = "";
    for (let row = 0; row < MINING_DEPTH; row++) {
      for (let col = 0; col < MINING_WIDTH; col++) {
        const currMiner = miners[col];
        if (currMiner && currMiner.pos === row) {
          if (currMiner.direction) {
            miningDisplayInnerText += "v";
          } else {
            miningDisplayInnerText += "^";
          }
        } else if (currMiner && row < currMiner.pos) {
          miningDisplayInnerText += "|";
        } else if (row === MINING_DEPTH - 1) {
          miningDisplayInnerText += "*";
        } else if (currMiner && row === currMiner.pos + 1 && !currMiner.direction) {
          miningDisplayInnerText += "*";
        } else {
          miningDisplayInnerText += "~";
        }
      }

      miningDisplayInnerText += "\n";
    }

    miningDisplay.innerText = miningDisplayInnerText;
  }

  return miningDisplay;
}
