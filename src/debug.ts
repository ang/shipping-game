import { getOrCreateButton, getOrCreateElementById } from "./common";
import type { State } from "./types";

const getIsDebugMode = (): boolean => {
  return window.location.hash === "#debug";
}

export const getOrCreateDebugTools = (state: State): HTMLElement => {
  const debugTools = getOrCreateElementById({id: "debug-tools"});
  debugTools.style.display = getIsDebugMode() ? 'block' : 'none';
  const tick = getOrCreateTick(state);
  const pause = getOrCreatePause(state);
  const next = getOrCreateNext(state);

  debugTools.append(tick, pause, next);

  return debugTools;
}

const getOrCreateTick = (state: State): HTMLElement => {
  const tick = getOrCreateElementById({id: "tick"});
  tick.innerText = "Game tick: " + state.gameTick.toString();
  return tick;
}

const getOrCreatePause = (state: State): HTMLElement => {
  const pause = getOrCreateButton({
    id: "debug-pause",
    textContent: "Play / Pause",
    onclick: (): void => {
      state.debug.isPaused = !state.debug.isPaused;
    }
  });

  return pause;
}

const getOrCreateNext = (state: State): HTMLElement => {
  const next = getOrCreateButton({
    id: "debug-next",
    textContent: "Next",
    onclick: (): void => {
      state.debug.nextStep = true;
    }
  });

  return next;
}
