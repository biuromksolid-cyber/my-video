import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { seededRandom } from "./utils";

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity,
    }}
  >
    <filter id="grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

export const Vignette: React.FC = () => null;

export const EmberParticles: React.FC<{ count?: number }> = ({ count = 26 }) => {
  const frame = useCurrentFrame();
  const items = new Array(count).fill(0).map((_, i) => {
    const seedX = seededRandom(i * 7.1);
    const seedSpeed = 0.25 + seededRandom(i * 3.3) * 0.55;
    const seedPhase = seededRandom(i * 11.7) * 1000;
    const x = seedX * 1080;
    const y = 1920 - (((frame + seedPhase) * seedSpeed * 3.2) % 2100);
    const size = 2 + seededRandom(i * 5.2) * 4;
    const opacity =
      0.15 + 0.35 * Math.abs(Math.sin((frame + seedPhase) * 0.05 + i));
    return { x, y, size, opacity, i };
  });
  return null;
};
