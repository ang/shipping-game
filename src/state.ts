import { type State, type Ship } from "./types.ts";
import {
  planetA as planetAObj,
  planetB as planetBObj,
  planetC as planetCObj,
  planetD as planetDObj,
  blueSquares as blueSquaresObj,
  greenTriangles as greenTrianglesObj,
  redDiamonds as redDiamondsObj,
} from "./objects.ts";
import {
  UPGRADE_CAPACITY_COST_START,
  UPGRADE_SPEED_COST_START
} from "./constants.ts";

const STATE_KEY = "state";

export const getDefaultState = (): State => {
  const planetA = structuredClone(planetAObj);
  const planetB = structuredClone(planetBObj);
  const planetC = structuredClone(planetCObj);
  const planetD = structuredClone(planetDObj);

  const blueSquares = structuredClone(blueSquaresObj);
  const greenTriangles = structuredClone(greenTrianglesObj);
  const redDiamonds = structuredClone(redDiamondsObj);

  planetB.miningInfo.resources = blueSquares;
  planetC.miningInfo.resources = greenTriangles;
  planetD.miningInfo.resources = redDiamonds;

  const ship1: Ship = {
    name: "Ship 1",
    destination1: planetA,
    destination2: planetB,
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
    startPlanet: planetA,
    planets: [planetB, planetC, planetD],
    blueSquares,
    greenTriangles,
    redDiamonds,
    debug: {
      isPaused: false,
      nextStep: false,
    }
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
  loadedState.planets[0].miningInfo.resources = loadedState.blueSquares;
  loadedState.planets[1].miningInfo.resources = loadedState.greenTriangles;
  loadedState.planets[2].miningInfo.resources = loadedState.redDiamonds;

  loadedState.debug = {
    isPaused: false,
    nextStep: false,
  }

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
