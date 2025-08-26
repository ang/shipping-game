// Upgrades from doing mining
import { type State, type Ship } from "./types.ts";
import { getOrCreateButton } from "./common.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";
import { planetB, planetC, planetD } from "./objects.ts";

export const MAX_SPEED_FROM_MINING_RESOURCES = 10;
export const MAX_CAPACITY_FROM_MINING_RESOURCES = 10;

type UpgradeCosts = {
  creditsCost: number;
  bResourcesCost: number;
  cResourcesCost: number;
  dResourcesCost: number;
}

const getSuperSpeedCosts = (ship: Ship): UpgradeCosts => {
  let baseCostMultiplier = 0.5 * ship.speed - 1;
  if (ship.speed < 4) {
    baseCostMultiplier = 1;
  }
  const creditsCost = 200 * baseCostMultiplier;
  const bResourcesCost = 50 * baseCostMultiplier;
  const cResourcesCost = 20 * baseCostMultiplier;
  const dResourcesCost = 0;

  return { creditsCost, bResourcesCost, cResourcesCost, dResourcesCost }
}

const isEnoughCreditsForUpgrade = (upgradeCosts: UpgradeCosts, state: State): boolean => {
  const bResources = state.miningInfoByPlanetName[planetB.name]?.resources || 0;
  const cResources = state.miningInfoByPlanetName[planetC.name]?.resources || 0;
  const dResources = state.miningInfoByPlanetName[planetD.name]?.resources || 0;

  return state.credits >= upgradeCosts.creditsCost &&
    bResources >= upgradeCosts.bResourcesCost &&
    cResources >= upgradeCosts.cResourcesCost &&
    dResources >= upgradeCosts.dResourcesCost
}

// TODO come up with a cool name for super speed
export const getOrCreateAddSuperSpeedButton = (ship: Ship, state: State) => {
  const shipInfoId = "shipInfo-" + ship.name.split(" ").join("-");

  const upgradeCosts = getSuperSpeedCosts(ship);
  const { creditsCost, bResourcesCost, cResourcesCost } = upgradeCosts;

  const missingResources = !isEnoughCreditsForUpgrade(upgradeCosts, state);

  const button = getOrCreateButton({
      id: shipInfoId + "-addSuperSpeed",
      textContent: ship.speed === MAX_SPEED_FROM_MINING_RESOURCES ? "Upgrade super speed" : `Upgrade super speed (${creditsCost} credits, ${bResourcesCost} ${planetB.specialResourceName}, ${cResourcesCost} ${planetC.specialResourceName})`,
      onclick:  () => { addToUpgradeQueue({ fn: upgradeShipSpeed, params: [ship, state] }) },
      disabled: missingResources || ship.speed === MAX_SPEED_FROM_MINING_RESOURCES || ship.speed < 4,
  });

  button.style.maxWidth = "250px";
  button.style.textAlign = "left";

  return button;
}

const upgradeShipSpeed = async (ship: Ship, state: State) => {

  if (isEnoughCreditsForUpgrade(getSuperSpeedCosts(ship), state) && ship.speed < MAX_SPEED_FROM_MINING_RESOURCES) {
    ship.speed += 2;

    const { creditsCost, bResourcesCost, cResourcesCost } = getSuperSpeedCosts(ship);
    state.credits -= creditsCost;
    state.miningInfoByPlanetName[planetB.name].resources -= bResourcesCost;
    state.miningInfoByPlanetName[planetC.name].resources -= cResourcesCost;
  }
}

const getSuperCapacityCosts = (ship: Ship): UpgradeCosts => {
  let baseCostMultiplier = 0.5 * ship.speed - 1;
  if (ship.speed < 4) {
    baseCostMultiplier = 1;
  }
  const creditsCost = 200 * baseCostMultiplier;
  const bResourcesCost = 20 * baseCostMultiplier;
  const cResourcesCost = 50 * baseCostMultiplier;
  const dResourcesCost = 0;

  return { creditsCost, bResourcesCost, cResourcesCost, dResourcesCost }
}

// TODO come up with a cool name for super capacity
export const getOrCreateAddSuperCapacityButton = (ship: Ship, state: State) => {
  const shipInfoId = "shipInfo-" + ship.name.split(" ").join("-");

  const upgradeCosts = getSuperCapacityCosts(ship);
  const { creditsCost, bResourcesCost, cResourcesCost } = upgradeCosts;

  const missingResources = !isEnoughCreditsForUpgrade(upgradeCosts, state);

  const button = getOrCreateButton({
      id: shipInfoId + "-addSuperCapacity",
      textContent: ship.capacity === MAX_CAPACITY_FROM_MINING_RESOURCES ? "Upgrade super capacity" : `Upgrade super capacity (${creditsCost} credits, ${bResourcesCost} ${planetB.specialResourceName}, ${cResourcesCost} ${planetC.specialResourceName})`,
      onclick:  () => { addToUpgradeQueue({ fn: upgradeShipCapacity, params: [ship, state] }) },
      disabled: missingResources || ship.capacity === MAX_CAPACITY_FROM_MINING_RESOURCES || ship.capacity < 4,
  });

  button.style.maxWidth = "250px";
  button.style.textAlign = "left";

  return button;
}

const upgradeShipCapacity = async (ship: Ship, state: State) => {

  if (isEnoughCreditsForUpgrade(getSuperCapacityCosts(ship), state) && ship.capacity < MAX_CAPACITY_FROM_MINING_RESOURCES) {
    ship.capacity += 2;

    const { creditsCost, bResourcesCost, cResourcesCost } = getSuperCapacityCosts(ship);
    state.credits -= creditsCost;
    state.miningInfoByPlanetName[planetB.name].resources -= bResourcesCost;
    state.miningInfoByPlanetName[planetC.name].resources -= cResourcesCost;
  }
}
