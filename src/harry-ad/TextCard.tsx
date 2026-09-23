import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from "remotion";

export const HookText: React.FC<{
  lines: string[];
  localFrame: number;
  exitAt: number;
}> = ({ lines, localFrame, exitAt }) => {
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 170 },
  });
  const exitProgress = interpolate(localFrame, [exitAt, exitAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(pop, [0, 1], [0.75, 1]) * (1 - exitProgress * 0.06);
  const opacity = interpolate(pop, [0, 1], [0, 1]) * (1 - exitProgress);
  const translateY = interpolate(pop, [0, 1], [40, 0]) + exitProgress * -30;

  return null;
};

export const BodyText: React.FC<{
  lines: string[];
  localFrame: number;
  exitAt: number;
  anchor?: "center" | "bottom";
}> = ({ lines, localFrame, exitAt, anchor = "bottom" }) => {
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 200 },
  });
  const exitProgress = interpolate(localFrame, [exitAt, exitAt + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(pop, [0, 1], [0, 1]) * (1 - exitProgress);
  const translateX = interpolate(pop, [0, 1], [-50, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: anchor === "bottom" ? "flex-end" : "center",
        alignItems: "center",
        padding: anchor === "bottom" ? "0 56px 150px 56px" : "0 56px",
      }}
    >
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          textAlign: "center",
          background: "rgba(5,5,5,0.66)",
          border: "2px solid rgba(255,122,0,0.55)",
          borderRadius: 16,
          padding: "22px 30px",
          width: "fit-content",
          maxWidth: 940,
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "DejaVu Sans, Liberation Sans, sans-serif",
              fontWeight: 700,
              fontSize: 50,
              lineHeight: 1.22,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              textShadow: "0 4px 14px rgba(0,0,0,0.9)",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
