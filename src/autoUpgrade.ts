import { SHIP_SPEED_MAX } from "./constants.ts";
import { type State, type Ship, type Planet } from "./types.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";

type UpgradeType = "speed" | "capacity";

// TODO
type ShipToUpgrade = {
  ship: Ship,
  upgradeType: UpgradeType,
  // todo do I want this one? or should it be calculated?
  upgradeCost: number,
  creditCost: number,
  blueSquaresCost: number,
  // xxx etc cost
}

export const autoUpgrade = (state: State) => {
  const shipToUpgrade = getShipToUpgrade(state);

  // perform the upgrade
  if (shipToUpgrade) {
    if (shipToUpgrade.upgradeType === "speed") {
      const planet = shipToUpgrade.ship.destination2;
      const spacePort = planet.spacePort;

      if (spacePort) {
        const creditCost = spacePort.speedUpgradeCostCredits;
        const miningCost = spacePort.speedUpgradeCostMiningResource;

        addToUpgradeQueue({
          fn: upgradeShipSpeed, params: [
            {
              state,
              ship: shipToUpgrade.ship,
              planet,
              creditCost,
              miningCost,
            }
          ]
        })
        upgradeShipSpeed
      }
    }
  }
}

const getShipToUpgrade = (state: State): ShipToUpgrade | undefined => {
  let shipToUpgrade: ShipToUpgrade | undefined;

  for (const ship of state.ships) {
    const spacePort = ship.destination2.spacePort;

    if (spacePort?.isAutoSpeedUpgradeUnlocked) {
      const creditCost = spacePort.speedUpgradeCostCredits;
      const blueSquaresCost = spacePort.speedUpgradeCostMiningResource;

      if (
        canAffordUpgradeShipSpeed(state, creditCost, blueSquaresCost) &&
        ship.speed < SHIP_SPEED_MAX
      ) {
        const upgradeCost = creditCost + blueSquaresCost;

        if (!shipToUpgrade) {
          shipToUpgrade = {
            ship,
            upgradeType: "speed",
            upgradeCost,
            creditCost,
            blueSquaresCost,
          }
          continue;
        }

        if (ship.speed < shipToUpgrade.ship.speed && (!upgradeCost || shipToUpgrade.upgradeCost <= upgradeCost)) {
          shipToUpgrade = {
            ship,
            upgradeType: "speed",
            upgradeCost,
            creditCost,
            blueSquaresCost,
          }
          continue;
        }
      }
    }
  };

  return shipToUpgrade;
}

const canAffordUpgradeShipSpeed = (state: State, creditCost: number, miningCost: number): boolean => {
  return state.credits >= creditCost && state.blueSquares.amount >= miningCost;
};

const upgradeShipSpeed = async (
  { state, ship, planet, creditCost, miningCost } :
  { state: State, ship: Ship, planet: Planet, creditCost: number, miningCost: number }
) => {
  if (
    planet.spacePort &&
    canAffordUpgradeShipSpeed(state, creditCost, miningCost) &&
    ship.speed < SHIP_SPEED_MAX
  ) {
    ship.speed += 1;

    state.credits -= planet.spacePort.speedUpgradeCostCredits;
    state.blueSquares.amount -= planet.spacePort.speedUpgradeCostMiningResource;

    // Incrase the cost
    planet.spacePort.speedUpgradeCostCredits += 1;
    planet.spacePort.speedUpgradeCostMiningResource += 1;
  }
};
