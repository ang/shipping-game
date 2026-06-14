import { SHIP_SPEED_MAX } from "./constants.ts";
import { type State, type Ship, type Planet } from "./types.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";

type UpgradeType = "speed" | "capacity";

export const autoUpgrade = (state: State) => {
  // Combine this into one structure?
  let shipToUpgrade: Ship | undefined;
  let upgradeType: UpgradeType | undefined;
  // this is just all credit + mining resources added together
  let upgradeCost: number | undefined;

  // Find the ship with the cheapest upgrade, auto upgrade that
  for (const ship of state.ships) {
    const spacePort = ship.destination2.spacePort;

    if (spacePort?.isAutoSpeedUpgradeUnlocked) {
      // TODO hack, I know this planet has this resource
      const planet = state.planets[0];

      const creditCost = spacePort.speedUpgradeCostCredits;
      const miningCost = spacePort.speedUpgradeCostMiningResource;

      // TODO bug: We're not upgrading the slowest speed ship first, we're just upgrading the first ship
      // Print onto actual game a debug log of what the current cost is

      if (
        canAffordUpgradeShipSpeed(state, planet, creditCost, miningCost) &&
        ship.speed < SHIP_SPEED_MAX
      ) {
        const shipUpgradeCost = creditCost + miningCost;

        console.log({ship, shipToUpgrade, shipUpgradeCost});
        if (!shipToUpgrade) {
          shipToUpgrade = ship;
          upgradeCost = shipUpgradeCost;
          upgradeType = "speed";
          console.log({upgradeType, ship, shipToUpgrade, shipUpgradeCost});
          continue;
        }

        if (ship.speed < shipToUpgrade.speed && (!upgradeCost || shipUpgradeCost <= upgradeCost)) {
          shipToUpgrade = ship;
          upgradeCost = shipUpgradeCost;
          upgradeType = "speed";
          continue;
        }
      }
    }
  };

  // perform the upgrade
  if (shipToUpgrade && upgradeType && upgradeCost) {
    if (upgradeType === "speed") {
      const planet = shipToUpgrade.destination2;
      const spacePort = planet.spacePort;

      if (spacePort) {
        const creditCost = spacePort.speedUpgradeCostCredits;
        const miningCost = spacePort.speedUpgradeCostMiningResource;

        // hack, I know which planet this is
        const miningCostPlanet = state.planets[0];

        addToUpgradeQueue({
          fn: upgradeShipSpeed, params: [
            {
              state,
              ship: shipToUpgrade,
              planet,
              creditCost,
              miningCost,
              miningCostPlanet,
            }
          ]
        })
        upgradeShipSpeed
      }
    }
  }
}

const canAffordUpgradeShipSpeed = (state: State, planet: Planet, creditCost: number, miningCost: number): boolean => {
  return state.credits >= creditCost && planet.miningInfo.resources.amount >= miningCost;
};

const upgradeShipSpeed = async (
  { state, ship, planet, creditCost, miningCost, miningCostPlanet } :
  {state: State, ship: Ship, planet: Planet, creditCost: number, miningCost: number, miningCostPlanet: Planet}
) => {
  if (
    planet.spacePort &&
    canAffordUpgradeShipSpeed(state, planet, creditCost, miningCost) &&
    ship.speed < SHIP_SPEED_MAX
  ) {
    ship.speed += 1;

    state.credits -= planet.spacePort.speedUpgradeCostCredits;
    miningCostPlanet.miningInfo.resources.amount -= planet.spacePort.speedUpgradeCostMiningResource;

    // Incrase the cost
    planet.spacePort.speedUpgradeCostCredits += 1;
    planet.spacePort.speedUpgradeCostMiningResource += 1;
  }
};
