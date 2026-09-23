import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

/** Quick flash + directional streak used as a whip-transition between scenes. */
export const CutFlash: React.FC<{ localFrame: number; totalFrames?: number }> = ({
  localFrame,
  totalFrames = 8,
}) => {
  const opacity = interpolate(
    localFrame,
    [0, totalFrames * 0.35, totalFrames],
    [0, 0.92, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(100deg, rgba(255,255,255,0.85), rgba(255,150,40,0.7) 55%, rgba(255,255,255,0.85))",
        opacity,
      }}
    />
  );
};

/** Slowly rotating light-ray burst, used behind the scene-3 "finished car" hero shot. */
export const LightRays: React.FC<{ opacity?: number }> = ({ opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const rotation = frame * 0.35;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 1900,
          height: 1900,
          opacity,
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,170,60,0.16) 0deg 6deg, transparent 6deg 18deg)",
          transform: `rotate(${rotation}deg)`,
          borderRadius: "50%",
        }}
      />
    </AbsoluteFill>
  );
};
