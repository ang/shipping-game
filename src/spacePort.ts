import { type State, type Planet, type Upgrade, type UpgradeType } from "./types.ts";
import { getOrCreateButton, getOrCreateElementById } from "./common.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";
import { getSymbolHtml } from "./mining.ts";
import { UPGRADE_CAPACITY_COST_START, UPGRADE_SPEED_COST_START } from "./constants.ts";

// TODO change back to a real value
const buildSpacePortMiningCost = 1;
// const buildSpacePortMiningCost = 50;
// TODO change back to a real value
// const researchAutoSpeedMiningCost = buildSpacePortMiningCost * 2;
const researchAutoSpeedMiningCost = 5;
const researchAutoCapacityMiningCost = buildSpacePortMiningCost * 2;

// TODO
const researchAutoLaunchShipCreditCost = 10000;
const researchAutoLaunchShipBlueSquaresCost = 1;
const researchAutoLaunchShipGreenTriangles = 1;
const researchAutoLaunchShipRedDiamonds = 2;

const autoUpgradeSpeedCreditCost = UPGRADE_SPEED_COST_START - 2;
const autoUpgradeSpeedBlueSquaresCost = autoUpgradeSpeedCreditCost;
const autoUpgradeCapacityCreditCost = UPGRADE_CAPACITY_COST_START - 2;
const autoUpgradeCapacityGreenTrianglesCost = autoUpgradeCapacityCreditCost;
// todo adjust
const autoUpgradeLaunchShipCreditCost = 10000;
const autoUpgradeLaunchShipBlueSquaresCost = 1;
const autoUpgradeLaunchShipGreenTriangles = 1;
const autoUpgradeLaunchShipRedDiamonds = 2;

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
  const spacePortParent = getOrCreateElementById({id: `${planet.name}-space-port`});

  const spacePortVisual = getOrCreateSpacePortVisual(planet);
  spacePortVisual.style.display = planet.spacePort ? 'block' : 'none';

  const researchAutoUpgradeSpeedButton = getOrCreateResearchAutoUpgradeSpeedButton(state, planet);
  const researchAutoUpgradeCapacityButton = getOrCreateResearchAutoUpgradeCapacityButton(state, planet);
  const researchAutoLaunchShipButton = getOrCreateResearchAutoLaunchShipButton(state, planet);

  const speedUpgradeSection = getOrCreateUpgradeSection(state, planet, "speed");
  const capacityUpgradeSection = getOrCreateUpgradeSection(state, planet, "capacity");
  const launchShipUpgradeSection = getOrCreateUpgradeSection(state, planet, "launchShip");

  spacePortParent.appendChild(spacePortVisual);
  spacePortParent.appendChild(researchAutoUpgradeSpeedButton);
  spacePortParent.appendChild(speedUpgradeSection);
  spacePortParent.appendChild(researchAutoUpgradeCapacityButton);
  spacePortParent.appendChild(capacityUpgradeSection);
  spacePortParent.appendChild(researchAutoLaunchShipButton);
  spacePortParent.appendChild(launchShipUpgradeSection);

  return spacePortParent;
}

const getOrCreateSpacePortVisual = (planet: Planet): HTMLElement => {
  let spacePort = `
=======SPACE PORT=======
========================
========================
========================
========================
========================
  `;
  const spacePortVisual = getOrCreateElementById({id: `${planet.name}-space-port-display`, innerText: spacePort});
  spacePortVisual.style.display = planet.spacePort ? 'block' : 'none';
  spacePortVisual.style.whiteSpace = "pre";
  return spacePortVisual;
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
  planet.spacePort = {};
}

const getOrCreateResearchAutoUpgradeSpeedButton = (state: State, planet: Planet): HTMLButtonElement => {
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

  const isButtonVisible = planet.spacePort && !planet.spacePort?.speedUpgrade;

  researchButton.style.display = isButtonVisible ? 'block' : 'none';

  return researchButton;
}

const canResearchAutoUpgradeSpeed = (state: State, planet: Planet, creditCost: number, miningResourceCost: number): boolean => {
  const canAfford = state.credits >= creditCost && planet.miningInfo.resources.amount >= miningResourceCost;

  return !planet.spacePort?.speedUpgrade && canAfford;
}

const researchAutoUpgradeSpeed = async (state: State, planet: Planet, creditCost: number, miningResourceCost: number) => {
  if (!canResearchAutoUpgradeSpeed(state, planet, creditCost, miningResourceCost) || !planet.spacePort) {
    return;
  }

  state.credits -= creditCost;
  planet.miningInfo.resources.amount -= miningResourceCost;
  planet.spacePort.speedUpgrade = {
    type: "speed",
    enabled: true,
    upgradeCostsCredits: autoUpgradeSpeedCreditCost,
    upgradeCostBlueSquares: autoUpgradeSpeedBlueSquaresCost,
    upgradeCostGreenTriangles: 0,
    upgradeCostRedDiamonds: 0,
  }
}


const getOrCreateResearchAutoUpgradeCapacityButton = (state: State, planet: Planet): HTMLButtonElement => {
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
    disabled: !canResearchAutoUpgradeCapacity(state, planet, miningResourcePlanet, creditCost, miningResourceCost)
  });
  researchButton.innerHTML = `Research auto upgrade capacity (${creditCost} credits, ${miningResourceCost} ${getSymbolHtml(miningResourcePlanet)})`;

  const isButtonVisible = planet.spacePort && !planet.spacePort?.capacityUpgrade;

  researchButton.style.display = isButtonVisible ? 'block' : 'none';

  return researchButton;
}

const canResearchAutoUpgradeCapacity = (state: State, planet: Planet, miningResourcePlanet: Planet, creditCost: number, miningResourceCost: number): boolean => {
  const canAfford = state.credits >= creditCost && miningResourcePlanet.miningInfo.resources.amount >= miningResourceCost;

  return !planet.spacePort?.capacityUpgrade && canAfford;
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
  if (!canResearchAutoUpgradeCapacity(state, currentPlanet, miningResourcePlanet, creditCost, miningResourceCost) || !currentPlanet.spacePort) {
    return;
  }

  state.credits -= creditCost;
  miningResourcePlanet.miningInfo.resources.amount -= miningResourceCost;
  currentPlanet.spacePort.capacityUpgrade = {
    type: "capacity",
    enabled: true,
    upgradeCostsCredits: autoUpgradeCapacityCreditCost,
    upgradeCostGreenTriangles: autoUpgradeCapacityGreenTrianglesCost,
    upgradeCostBlueSquares: 0,
    upgradeCostRedDiamonds: 0,
  }
}

const getOrCreateUpgradeSection = (state: State, planet: Planet, upgradeType: UpgradeType): HTMLElement => {
  const idPrefix = `${planet.name}-${upgradeType}`;
  const upgrade = getUpgrade(upgradeType, planet);

  const upgradeSection = getOrCreateElementById({id: `${idPrefix}-upgradeSection`});

  const heading = getOrCreateUpgradeHeading(planet, upgradeType);

  const cost = getOrCreateElementById({id: `${idPrefix}-cost`});
  if (upgrade) {
    const costArray = [
      upgrade.upgradeCostsCredits ? `${upgrade.upgradeCostsCredits} credits` : undefined,
      upgrade.upgradeCostBlueSquares ? `${upgrade.upgradeCostBlueSquares} ${getSymbolHtml(state.planets[0])}` : undefined,
      upgrade.upgradeCostGreenTriangles ? `${upgrade.upgradeCostGreenTriangles} ${getSymbolHtml(state.planets[1])}` : undefined,
      upgrade.upgradeCostRedDiamonds ? `${upgrade.upgradeCostRedDiamonds} ${getSymbolHtml(state.planets[2])}` : undefined,
    ].filter(Boolean);
    cost.innerHTML = `Cost: ${costArray.join(", ")}`;
  }

  upgradeSection.append(heading, cost);

  upgradeSection.style.display = upgrade ? 'block' : 'none';

  upgradeSection.className = "upgradeSection";

  return upgradeSection;
}

const getOrCreateUpgradeHeading = (planet: Planet, upgradeType: UpgradeType): HTMLElement => {
  const idPrefix = `${planet.name}-${upgradeType}`;

  const headingParent = getOrCreateElementById({id: `${idPrefix}-headingParent}`});
  headingParent.className = "upgradeHeading";

  const heading = getOrCreateElementById({id: `${idPrefix}-heading`});
  heading.innerText = upgradeType === "launchShip" ? "Auto launch ship" : `Auto upgrade ${upgradeType}`;

  const enableUpgradeButton = getOrCreateEnableAutoUpgradeButton(planet, upgradeType);

  headingParent.append(heading, enableUpgradeButton);

  return headingParent;
}

const getOrCreateEnableAutoUpgradeButton = (planet: Planet, upgradeType: UpgradeType): HTMLButtonElement => {
  const upgrade = getUpgrade(upgradeType, planet);

  const enableAutoUpgradeButton = getOrCreateButton({
    id: `${planet.name}-enableAutoUpgrade-${upgradeType}`,
    onclick: () => {
      if (upgrade) {
        upgrade.enabled = !upgrade.enabled;
      }
    },
  });

  enableAutoUpgradeButton.textContent = upgrade?.enabled ? "Disable" : "Enable";
  enableAutoUpgradeButton.style.display = upgrade ? 'block' : 'none';

  return enableAutoUpgradeButton;
}

const getOrCreateResearchAutoLaunchShipButton = (state: State, planet: Planet): HTMLButtonElement => {
  const researchButton = getOrCreateButton({
    id: `${planet.name}-researchAutoLaunchShip`,
    onclick: () => {
      addToUpgradeQueue({fn: researchAutoLaunchShip, params: [state, planet]});
    },
    disabled: !canResearchAutoLaunchShip(state, planet)
  });
  researchButton.innerHTML = `Research auto launch ships (${researchAutoLaunchShipCreditCost} credits, `
  researchButton.innerHTML += `${researchAutoLaunchShipBlueSquaresCost} ${getSymbolHtml(state.planets[0])}, `;
  researchButton.innerHTML += `${researchAutoLaunchShipGreenTriangles} ${getSymbolHtml(state.planets[1])}, `;
  researchButton.innerHTML += `${researchAutoLaunchShipRedDiamonds} ${getSymbolHtml(state.planets[2])})`;

  const isButtonVisible = planet.spacePort && !planet.spacePort?.launchShipUpgrade;

  researchButton.style.display = isButtonVisible ? 'block' : 'none';

  return researchButton;
}

const canResearchAutoLaunchShip = (state: State, planet: Planet): boolean => {
  const canAfford =
    state.credits >= researchAutoLaunchShipCreditCost &&
    state.blueSquares.amount >= researchAutoLaunchShipBlueSquaresCost &&
    state.greenTriangles.amount >= researchAutoLaunchShipGreenTriangles &&
    state.redDiamonds.amount >= researchAutoLaunchShipRedDiamonds;

  return !planet.spacePort?.launchShipUpgrade && canAfford;
}

const researchAutoLaunchShip = async (state: State, planet: Planet) => {
  if (!canResearchAutoLaunchShip(state, planet) || !planet.spacePort) {
    return;
  }

  state.credits -= researchAutoLaunchShipCreditCost;
  state.blueSquares.amount -= researchAutoLaunchShipBlueSquaresCost;
  state.greenTriangles.amount -= researchAutoLaunchShipGreenTriangles;
  state.redDiamonds.amount -= researchAutoLaunchShipRedDiamonds;

  planet.spacePort.launchShipUpgrade = {
    type: "launchShip",
    enabled: true,
    upgradeCostsCredits: autoUpgradeLaunchShipCreditCost,
    upgradeCostBlueSquares: autoUpgradeLaunchShipBlueSquaresCost,
    upgradeCostGreenTriangles: autoUpgradeLaunchShipGreenTriangles,
    upgradeCostRedDiamonds: autoUpgradeLaunchShipRedDiamonds,
  }
}

const getUpgrade = (upgradeType: UpgradeType, planet: Planet): Upgrade | undefined => {
  let upgrade: Upgrade | undefined;

  if (planet.spacePort) {
    if (upgradeType === "speed" && planet.spacePort.speedUpgrade) {
      upgrade = planet.spacePort.speedUpgrade;
    }
    else if (upgradeType === "capacity" && planet.spacePort.capacityUpgrade) {
      upgrade = planet.spacePort.capacityUpgrade;
    }
    else if (upgradeType === "launchShip" && planet.spacePort.launchShipUpgrade) {
      upgrade = planet.spacePort.launchShipUpgrade;
    }
  }

  return upgrade;
}
