import {
  SHIP_BASE_UPGRADE_CAPACITY_COST,
  SHIP_BASE_UPGRADE_SPEED_COST
} from "./constants";
import type { Planet, Ship, State } from "./types";

export const addShipToPlanet = async (state: State, planet: Planet) => {
  if (state.credits >= planet.launchCost) {
    const ship: Ship = {
      name: "Ship " + (state.ships.length + 1),
      destination1: state.startPlanet,
      destination2: planet,
      speed: 1,
      capacity: 1,
      pos: 0,
      direction: true,
      upgradeSpeedCost: SHIP_BASE_UPGRADE_SPEED_COST,
      upgradeCapacityCost: SHIP_BASE_UPGRADE_CAPACITY_COST,
    }

    state.credits -= planet.launchCost;

    planet.launchCost = Math.floor(planet.launchCost * 1.5);

    state.ships.push(ship);
  }
}
