import { type State, type Ship } from "./types.ts";
import { planetA, planetB, planetC, planetD } from "./objects.ts";
import {
  UPGRADE_CAPACITY_COST_START,
  UPGRADE_SPEED_COST_START
} from "./constants.ts";

const STATE_KEY = "state";

export const getDefaultState = (): State => {
  const newPlanetA = structuredClone(planetA);
  const newPlanetB = structuredClone(planetB);
  const newPlanetC = structuredClone(planetC);
  const newPlanetD = structuredClone(planetD);

  const ship1: Ship = {
    name: "Ship 1",
    destination1: newPlanetA,
    destination2: newPlanetB,
    pos: 0,
    direction: true,
    speed: 1,
    capacity: 1,
    upgradeSpeedCost: UPGRADE_SPEED_COST_START,
    upgradeCapacityCost: UPGRADE_CAPACITY_COST_START,
  };

  const defaultState: State = {
    // TODO
    // credits: 5,
    credits: 150000,
    gameTick: 0,
    ships: [ship1],
    startPlanet: structuredClone(planetA),
    planets: [newPlanetB, newPlanetC, newPlanetD],
  }

  return defaultState;
}

export const loadState = (): State => {
  const rawState = localStorage.getItem(STATE_KEY);
  if (!rawState) {
    return getDefaultState();
  }

  const loadedState: State = JSON.parse(rawState);

  // We have to relink the reference here.
  // Planets are referenced in both the global state, as well as a ship -> planet. When loading from localStorage, they lose their reference, so we have to relink it to the "master" object.
  const planetByName = Object.fromEntries(loadedState.planets.map(planet => [planet.name, planet]));
  const startPlanet = loadedState.startPlanet;
  planetByName[startPlanet.name] = startPlanet;

  loadedState.ships.forEach((ship) => {
    const planet1 = planetByName[ship.destination1.name]
    ship.destination1 = planet1;

    const planet2 = planetByName[ship.destination2.name]
    ship.destination2 = planet2;
  });

  return loadedState;
}

export const saveState = (state: State) => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export const resetState = (): State => {
  const newState = getDefaultState();
  saveState(newState);
  return newState;
}
