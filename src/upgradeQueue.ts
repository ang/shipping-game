/*
 * Nathan found a bug where he can click multiple times and buy something even though he doesn't
 * have the money for it. To fix this we use a queuing system for upgrades.
*/

type FunctionWithParams<T extends any[]> = {
    fn: (...args: T) => Promise<void>;
    params: T;
};

const upgradeQueue: FunctionWithParams<any[]>[] = [];

export const addToUpgradeQueue = <T extends any[]>(
  functionWithParams: FunctionWithParams<T>
) => {
  upgradeQueue.push(functionWithParams);
}

export const upgradeUpdates = async () => {
  upgradeQueue.forEach(item => item.fn(...item.params));
  upgradeQueue.length = 0;
}
