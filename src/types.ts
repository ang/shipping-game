type MiningResource = {
  name: string;
  researchCost: number;
  symbol: string;
  color: string;
}

export type Planet = {
  name: string;
  pos: number;
  goods: number;
  display?: string;
  launchCost: number;
  miningResource: MiningResource;
  spacePort?: SpacePort;
}


export type Ship = {
   destination1: Planet;
   destination2: Planet;
   name: string;
   pos: number;
   direction: boolean; // True means going to destination 2
   speed: number;
   capacity: number;
   upgradeSpeedCost: number;
   upgradeCapacityCost: number;
}

export type Miner = {
  planet: Planet;
  pos: number;
  direction: boolean; // True means going up in pos
}

type MiningInfo = {
  planetName: string;
  miners: Miner[]
  resources: number;
}

type MiningInfoByPlanetName = {
  [key: string]: MiningInfo;
}

type SpacePort = {
  foo: boolean;
}

export type State = {
  credits: number;
  gameTick: number;
  ships: Ship[];
  miningInfoByPlanetName: MiningInfoByPlanetName;
  // TODO need to do a refactor here
  startPlanet: Planet;
  planets: Planet[];
}
