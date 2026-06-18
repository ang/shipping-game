import { SHIP_CAPACITY_MAX, SHIP_SPEED_MAX } from "./constants.ts";
import { type State, type Ship, type Upgrade } from "./types.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";

type ShipToUpgrade = {
  ship: Ship,
  upgrade: Upgrade,
}

export const autoUpgrade = (state: State) => {
  const shipToUpgrade = getShipToUpgrade(state);

  // perform the upgrade
  if (shipToUpgrade) {
    addToUpgradeQueue({
      fn: upgradeShip, params: [
        {
          state,
          shipToUpgrade,
        }
      ]
    })
  }
}

const getShipToUpgrade = (state: State): ShipToUpgrade | undefined => {
  let shipToUpgrade: ShipToUpgrade | undefined;

  for (const ship of state.ships) {
    const spacePort = ship.destination2.spacePort;

    if (spacePort?.speedUpgrade?.enabled) {
      const nextShipToUpgrade = getShipToUpgradeInner(state, spacePort.speedUpgrade, ship, shipToUpgrade);
      if (nextShipToUpgrade) {
        shipToUpgrade = nextShipToUpgrade;
      }
    }
    if (spacePort?.capacityUpgrade?.enabled) {
      const nextShipToUpgrade = getShipToUpgradeInner(state, spacePort.capacityUpgrade, ship, shipToUpgrade);
      if (nextShipToUpgrade) {
        shipToUpgrade = nextShipToUpgrade;
      }
    }
  }

  return shipToUpgrade;
}

const getShipToUpgradeInner = (
  state: State,
  upgrade: Upgrade,
  ship: Ship,
  currShipToUpgrade: ShipToUpgrade | undefined,
): ShipToUpgrade | undefined => {
  let isUnderMax;
  if (upgrade.type === "speed") {
    isUnderMax = ship.speed < SHIP_SPEED_MAX;
  } else if (upgrade.type === "capacity") {
    isUnderMax = ship.capacity < SHIP_CAPACITY_MAX;
  }

  if (
    canAffordUpgrade(state, upgrade) &&
    isUnderMax
  ) {
    if (!currShipToUpgrade) {
      return {
        ship,
        upgrade,
      }
    }


    let isShipUnderCurrShipValue;
    if (upgrade.type === "speed") {
      isShipUnderCurrShipValue = ship.speed < currShipToUpgrade.ship.speed;
    } else if (upgrade.type === "capacity") {
      isShipUnderCurrShipValue = ship.capacity < currShipToUpgrade.ship.capacity;
    }

    const upgradeCost = getUpgradeCost(upgrade);
    const currUpgradeCost = getUpgradeCost(currShipToUpgrade.upgrade);
    const isUpgradeCostUnderCurrCost = upgradeCost <= currUpgradeCost;
    if (isShipUnderCurrShipValue && isUpgradeCostUnderCurrCost) {
      return {
        ship,
        upgrade,
      }
    }
  }
  return;
}

const getUpgradeCost = (upgrade: Upgrade): number => {
  return upgrade.upgradeCostsCredits + upgrade.upgradeCostBlueSquares + upgrade.upgradeCostGreenTriangles + upgrade.upgradeCostRedDiamonds;
}

const canAffordUpgrade = (state: State, upgrade: Upgrade): boolean => {
  return (
    state.credits >= upgrade.upgradeCostsCredits &&
    state.blueSquares.amount >= upgrade.upgradeCostBlueSquares &&
    state.greenTriangles.amount >= upgrade.upgradeCostGreenTriangles &&
    state.redDiamonds.amount >= upgrade.upgradeCostRedDiamonds
  );
};

const upgradeShip = async (
  { state, shipToUpgrade } :
  { state: State, shipToUpgrade: ShipToUpgrade}
) => {
  const { ship, upgrade } = shipToUpgrade;
  if (
    canAffordUpgrade(state, upgrade)
  ) {
    if (upgrade.type === "speed" && ship.speed < SHIP_SPEED_MAX) {
      ship.speed += 1;
    }
    else if (upgrade.type === "capacity" && ship.capacity < SHIP_CAPACITY_MAX) {
      ship.capacity += 1;
    }

    state.credits -= upgrade.upgradeCostsCredits;
    state.blueSquares.amount -= upgrade.upgradeCostBlueSquares;
    state.greenTriangles.amount -= upgrade.upgradeCostGreenTriangles;
    state.redDiamonds.amount -= upgrade.upgradeCostRedDiamonds;

    // Increase the cost
    // TODO change back
    // Or if I decide to change how this works, don't include this
    // speedUpgrade.upgradeCostsCredits += 1;
    // speedUpgrade.upgradeCostBlueSquares += 1;
  }
};
