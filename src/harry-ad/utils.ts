// Deterministic pseudo-random helper (Remotion needs pure functions of frame/index,
// never Math.random(), so every render produces the exact same output).
export function seededRandom(seed: number): number {
  let x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
