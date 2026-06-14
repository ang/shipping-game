import { type State, type Planet } from "./types.ts";
import { getOrCreateButton, getOrCreateElementById } from "./common.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";
import { getSymbolHtml } from "./mining.ts";
import { UPGRADE_SPEED_COST_START } from "./constants.ts";

// TODO change back to a real value
const buildSpacePortMiningCost = 1;
// const buildSpacePortMiningCost = 50;
// TODO change back to a real value
// const researchAutoSpeedMiningCost = buildSpacePortMiningCost * 2;
const researchAutoSpeedMiningCost = 5;
const researchAutoCapacityMiningCost = buildSpacePortMiningCost * 2;

const autoUpgradeSpeedCreditCost = UPGRADE_SPEED_COST_START - 2;
const autoUpgradeSpeedMiningCost = autoUpgradeSpeedCreditCost;

export const getOrCreateBuildSpacePortButton = (state: State, planet: Planet): HTMLButtonElement => {
  const miningInfo = planet.miningInfo;
  const creditCost = miningInfo.resources.researchCost * 3;

  const buildSpacePortButton = getOrCreateButton({
    id: `${planet.name}-buildSpacePort`,
    onclick: () => {
      addToUpgradeQueue({fn: buildSpacePort, params: [state, creditCost, buildSpacePortMiningCost, planet]});
    },
    disabled: !canBuildSpacePort(state, planet, creditCost, buildSpacePortMiningCost)
  });
  buildSpacePortButton.innerHTML = `Build space port (${creditCost} credits, ${buildSpacePortMiningCost} ${getSymbolHtml(planet)})`;

  const isButtonVisible = miningInfo.miningUnlocked && !planet.spacePort;

  buildSpacePortButton.style.display = isButtonVisible ? 'block' : 'none';

  return buildSpacePortButton;
}

export const getOrCreateSpacePortDisplay = (state: State, planet: Planet): HTMLElement => {
  // todo remove
  state;

  const spacePort = `
=======SPACE======
=======PORT=======
==================
==================
==================
  `;
  const spacePortDisplay = getOrCreateElementById({id: `${planet.name}-space-port`, innerText: spacePort});
  spacePortDisplay.style.display = planet.spacePort ? 'block' : 'none';
  return spacePortDisplay;
}

const canBuildSpacePort = (state: State, planet: Planet, creditCost: number, miningResourceCost: number): boolean => {
  const canAfford = state.credits >= creditCost && planet.miningInfo.resources.amount >= miningResourceCost;
  return !planet.spacePort && canAfford;
}

const buildSpacePort = async (state: State, creditCost: number, miningResourceCost: number, planet: Planet) => {
  if (!canBuildSpacePort(state, planet, creditCost, miningResourceCost)) {
    return;
  }

  state.credits -= creditCost;
  planet.miningInfo.resources.amount -= miningResourceCost;
  planet.spacePort = {
    speedUpgradeCostCredits: autoUpgradeSpeedCreditCost,
    speedUpgradeCostMiningResource: autoUpgradeSpeedMiningCost,
  };
}

export const getOrCreateResearchAutoUpgradeSpeedButton = (state: State, planet: Planet): HTMLButtonElement => {
  const miningInfo = planet.miningInfo;
  const creditCost = miningInfo.resources.researchCost * 2;
  const miningResourceCost = researchAutoSpeedMiningCost;

  const researchButton = getOrCreateButton({
    id: `${planet.name}-researchAutoUpgradeSpeed`,
    onclick: () => {
      addToUpgradeQueue({fn: researchAutoUpgradeSpeed, params: [state, planet, creditCost, miningResourceCost]});
    },
    disabled: !canResearchAutoUpgradeSpeed(state, planet, creditCost, miningResourceCost)
  });
  researchButton.innerHTML = `Research auto upgrade speed (${creditCost} credits, ${miningResourceCost} ${getSymbolHtml(planet)})`;

  const isButtonVisible = planet.spacePort && !planet.spacePort?.isAutoSpeedUpgradeUnlocked;

  researchButton.style.display = isButtonVisible ? 'block' : 'none';

  return researchButton;
}

const canResearchAutoUpgradeSpeed = (state: State, planet: Planet, creditCost: number, miningResourceCost: number): boolean => {
  const canAfford = state.credits >= creditCost && planet.miningInfo.resources.amount >= miningResourceCost;

  return !planet.spacePort?.isAutoSpeedUpgradeUnlocked && canAfford;
}

const researchAutoUpgradeSpeed = async (state: State, planet: Planet, creditCost: number, miningResourceCost: number) => {
  if (!canResearchAutoUpgradeSpeed(state, planet, creditCost, miningResourceCost) || !planet.spacePort) {
    return;
  }

  state.credits -= creditCost;
  planet.miningInfo.resources.amount -= miningResourceCost;
  planet.spacePort.isAutoSpeedUpgradeUnlocked = true;
}


export const getOrCreateResearchAutoUpgradeCapacityButton = (state: State, planet: Planet): HTMLButtonElement => {
  const miningInfo = planet.miningInfo;
  const creditCost = miningInfo.resources.researchCost * 2;

  // To keep things interesting, the miningResource will be the next planet's resource
  const currPlanetIndex = state.planets.findIndex((currPlanet) => currPlanet === planet);
  const nextPlanetIndex = currPlanetIndex + 1;
  const miningResourcePlanet = state.planets[nextPlanetIndex % state.planets.length];

  const miningResourceCost = researchAutoCapacityMiningCost;

  const researchButton = getOrCreateButton({
    id: `${planet.name}-researchAutoUpgradeCapacity`,
    onclick: () => {
      addToUpgradeQueue({fn: researchAutoUpgradeCapacity, params: [{state, creditCost, miningResourceCost, currentPlanet: planet, miningResourcePlanet}]});
    },
    disabled: !canResearchAutoUpgradeCapacity(state, miningResourcePlanet, creditCost, miningResourceCost)
  });
  researchButton.innerHTML = `Research auto upgrade capacity (${creditCost} credits, ${miningResourceCost} ${getSymbolHtml(miningResourcePlanet)})`;

  const isButtonVisible = planet.spacePort && !planet.spacePort?.isAutoCapacityUpgradeUnlocked;

  researchButton.style.display = isButtonVisible ? 'block' : 'none';

  return researchButton;
}

const canResearchAutoUpgradeCapacity = (state: State, planet: Planet, creditCost: number, miningResourceCost: number): boolean => {
  const canAfford = state.credits >= creditCost && planet.miningInfo.resources.amount >= miningResourceCost;

  return !planet.spacePort?.isAutoCapacityUpgradeUnlocked && canAfford;
}

const researchAutoUpgradeCapacity = async ({
  state, currentPlanet, miningResourcePlanet, creditCost, miningResourceCost
}: {
  state: State,
  currentPlanet: Planet,
  miningResourcePlanet: Planet,
  creditCost: number,
  miningResourceCost: number
}) => {
  if (!canResearchAutoUpgradeCapacity(state, miningResourcePlanet, creditCost, miningResourceCost) || !currentPlanet.spacePort) {
    return;
  }

  state.credits -= creditCost;
  miningResourcePlanet.miningInfo.resources.amount -= miningResourceCost;
  currentPlanet.spacePort.isAutoCapacityUpgradeUnlocked = true;
}
