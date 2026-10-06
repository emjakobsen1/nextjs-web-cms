// Linktree is a directory of all the others, not a link itself — always
// shown first in the row regardless of the order it was added in Studio.
export function linktreeFirst<T extends { platform: string }>(links: T[]): T[] {
  return [...links].sort((a, b) => Number(b.platform === "linktree") - Number(a.platform === "linktree"));
}
