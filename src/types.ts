export type MiningResource = {
  name: string;
  researchCost: number;
  symbol: string;
  color: string;
  amount: number;
}

export type Planet = {
  name: string;
  pos: number;
  goods: number;
  display?: string;
  launchCost: number;
  miningInfo: MiningInfo;
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
  pos: number;
  direction: boolean; // True means going up in pos
}

type MiningInfo = {
  miningUnlocked: boolean;
  miners: Miner[];
  resources: MiningResource;
}

export type UpgradeType = "speed" | "capacity" | "launchShip";
export type Upgrade = {
  type: UpgradeType;
  enabled: boolean;
  upgradeCostsCredits: number;
  upgradeCostBlueSquares: number;
  upgradeCostGreenTriangles: number;
  upgradeCostRedDiamonds: number;
}

export type SpacePort = {
  speedUpgrade?: Upgrade;
  capacityUpgrade?: Upgrade;
  launchShipUpgrade?: Upgrade;
}

export type State = {
  credits: number;
  gameTick: number;
  ships: Ship[];
  startPlanet: Planet;
  planets: Planet[];
  blueSquares: MiningResource
  greenTriangles: MiningResource
  redDiamonds: MiningResource
  debug: {
    isPaused: boolean,
    nextStep: boolean,
  }
}
