export type Planet = {
  name: string;
  pos: number;
  goods: number;
  display?: string;
  launchCost: number;
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
