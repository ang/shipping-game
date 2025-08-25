import { type State, type Ship } from "./types.ts";
import { planetA, planetB } from "./objects.ts";

const STATE_KEY = "state";

export const getDefaultState = (): State => {
  const ship1: Ship = {
    name: "Ship 1",
    destination1: planetA,
    destination2: planetB,
    pos: 0,
    direction: true,
    speed: 1,
    capacity: 1,
    upgradeSpeedCost: 5,
    upgradeCapacityCost: 8
  };

  const defaultState: State = {
    // credits: 5,
    credits: 5000,
    gameTick: 0,
    ships: [ship1],
    miningInfoByPlanetName: {},
  }

  return defaultState;
}

export const loadState = (): State => {
  const rawState = localStorage.getItem(STATE_KEY);
  if (!rawState) {
    return getDefaultState();
  }

  return JSON.parse(rawState);
}

export const saveState = (state: State) => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export const resetState = (): State => {
  const newState = getDefaultState();
  saveState(newState);
  return newState;
}
