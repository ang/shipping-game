import { type State, type Planet } from "./types.ts";
import { getOrCreateButton, getOrCreateElementById } from "./common.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";

const MINING_DEPTH = 10;

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
    state.miningPlanets.push(planet);
    state.minersByPlanetName[planet.name] = []
    state.minersByPlanetName[planet.name].push({planet, pos: 0, direction: true});
}

export const getOrCreateResearchMiningButton = (state: State, planet: Planet): HTMLButtonElement => {
    // Only show when you have launched ships on all planets
    const researchMiningButton = getOrCreateButton({
      id: `${planet.name}-researchMining`,
      textContent: `Research mining ${planet.specialResourceName} (${planet.specialResourceCost} credits)`,
      onclick: () => {
        addToUpgradeQueue({fn: researchMining, params: [planet, state]});
      },
      disabled: !planet.specialResourceCost || state.credits < planet.specialResourceCost,
    });

    const planetSet: Set<string> = new Set();
    state.ships.forEach((ship) => { planetSet.add(ship.destination2.name) });
    const researchMiningUnlocked = planetSet.size >= 3;
    const hasResearch = Boolean(state.minersByPlanetName[planet.name]);
    const displayButton = researchMiningUnlocked && !hasResearch;

    researchMiningButton.style.display = displayButton ? 'block' : 'none';

    return researchMiningButton;
}

export const getOrCreateMiningDisplay = (state: State, planet: Planet): HTMLElement => {
  const miningDisplay = getOrCreateElementById({id: `${planet.name}-mining-display`});

  const miners = state.minersByPlanetName[planet.name];
  if (miners) {
    let miningDisplayInnerText = "";
    for (let row = 0; row < MINING_DEPTH; row++) {
      for (let col = 0; col < MINING_DEPTH; col++) {
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
