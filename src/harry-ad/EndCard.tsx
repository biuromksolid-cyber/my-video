import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export const EndCard: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();

  const logoPop = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 150 },
  });
  const logoScale = interpolate(logoPop, [0, 1], [0.7, 1]);
  const logoOpacity = interpolate(logoPop, [0, 1], [0, 1]);

  const ctaPop = spring({
    frame: localFrame - 18,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });
  const ctaOpacity = interpolate(ctaPop, [0, 1], [0, 1]);
  const ctaY = interpolate(ctaPop, [0, 1], [30, 0]);
  const pulse = 1 + Math.sin(localFrame * 0.22) * 0.035;

  const stripeShift = (localFrame * 4) % 220;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      {/* Diagonal brand stripes */}
      <AbsoluteFill style={{ overflow: "hidden", opacity: 0.5 }}>
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -220 + stripeShift,
            width: "160%",
            height: "160%",
            background:
              "repeating-linear-gradient(115deg, rgba(255,122,0,0.16) 0px, rgba(255,122,0,0.16) 26px, transparent 26px, transparent 90px)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,110,20,0.28), transparent 60%)",
        }}
      />

      <AbsoluteFill
        style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 260 }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            width: 780,
          }}
        >
          <Img src={staticFile("logo.png")} style={{ width: "100%" }} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 210 }}
      >
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${pulse})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #FF9A2E, #FF6A00)",
              borderRadius: 999,
              padding: "26px 46px",
              boxShadow:
                "0 0 0 3px rgba(255,255,255,0.9), 0 18px 40px rgba(255,110,10,0.55)",
            }}
          >
            <span
              style={{
                fontFamily: "DejaVu Sans, Liberation Sans, sans-serif",
                fontWeight: 700,
                fontSize: 42,
                color: "#0a0a0a",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Umów bezpłatną konsultację
            </span>
          </div>
          <div
            style={{
              fontFamily: "DejaVu Sans, Liberation Sans, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: "#dddddd",
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Car Detailing Studio
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
