import { type State, type Planet } from "./types.ts";
import { getOrCreateButton, getOrCreateElementById } from "./common.ts";
import { addToUpgradeQueue } from "./upgradeQueue.ts";

export const getOrCreateBuildSpacePortButton = (state: State, planet: Planet): HTMLButtonElement => {
  const cost = planet.miningResource.researchCost * 3;
  const buildSpacePortButton = getOrCreateButton({
    id: `${planet.name}-buildSpacePort`,
    textContent: `Build space port (${cost} credits)`,
    onclick: () => {
      addToUpgradeQueue({fn: buildSpacePort, params: [state, cost, planet]});
    },
    disabled: state.credits < cost,
  });

  const hasMining = planet.name in state.miningInfoByPlanetName && state.miningInfoByPlanetName[planet.name].miners.length;
  const displayButton = hasMining && !planet.spacePort;

  buildSpacePortButton.style.display = displayButton ? 'block' : 'none';

  return buildSpacePortButton;
}

export const getOrCreateSpacePortDisplay = (state: State, planet: Planet): HTMLElement => {
  // todo remove
  state;

  const spacePort = `
=======SPACE======
=======PORT=======
==================
==================
==================
  `;
  const spacePortDisplay = getOrCreateElementById({id: `${planet.name}-space-port`, innerText: spacePort});
  spacePortDisplay.style.display = planet.spacePort ? 'block' : 'none';
  return spacePortDisplay;
}

const buildSpacePort = async (state: State, cost: number, planet: Planet) => {
  if (state.credits < cost || planet.spacePort) {
    return;
  }

  state.credits -= cost;
  planet.spacePort = { foo: true };
}
