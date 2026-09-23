import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

import { Grain, Vignette, EmberParticles } from "./Background";
import { HookText, BodyText } from "./TextCard";
import { CutFlash, LightRays } from "./Extras";
import { EndCard } from "./EndCard";
import {
  CarShot, DetailerShot, Car2Shot,
  CAR_CROPS, DETAILER_CROPS, CAR2_CROPS,
} from "./CarShot";

// ── Timing map (30 fps) ────────────────────────────────────────────────────
//  0-90    0-3 s    Scene 1 — Detailer + hexagonal hood reflections
//  84-93   overlap  Transition flash 1
//  90-210  3-7 s    Scene 2 — 5 × 24-frame real-photo detail cuts
//  204-213 overlap  Transition flash 2
//  210-330 7-11 s   Scene 3 — Mercedes front reveal (car2.jpg)
//  324-333 overlap  Transition flash 3
//  330-450 11-15 s  Scene 4 — End card / CTA
// ──────────────────────────────────────────────────────────────────────────

/** Small brand watermark — top-right, away from Meta UI overlay zone. */
const LogoMark: React.FC<{ opacity?: number }> = ({ opacity = 0.55 }) => (
  <div
    style={{
      position: "absolute",
      top: 72,
      right: 44,
      width: 152,
      opacity,
    }}
  >
    <Img src={staticFile("logo.png")} style={{ width: "100%" }} />
  </div>
);

// ── Scene 1 — Detailer at work / hexagonal LED reflections ────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoPop = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 160 },
  });
  const logoOp = interpolate(logoPop, [0, 1], [0, 0.6]);

  return (
    <AbsoluteFill durationInFrames={157}>
      <DetailerShot
        startBox={DETAILER_CROPS.hexHood}
        endBox={{ x0: 0.06, y0: 0.26, x1: 0.56, y1: 0.68 }}
        durationInFrames={90}
        fadeInFrames={14}
      />

      {/* Very subtle warm amber wash */}

      {/* Floating ember particles — workshop energy */}
      <EmberParticles count={12} />
      <Grain opacity={0.05} />
      <Vignette />

      <HookText
        lines={["Nie wydawaj pieniędzy", "na detailing w ciemno."]}
        localFrame={frame}
        exitAt={78}
      />

      <div style={{ opacity: logoOp }}>
        <LogoMark opacity={1} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2 — Five real-photo fast cuts ────────────────────────────────────
const CUT_LEN = 24;

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  return f < 5 ? <CutFlash localFrame={f} totalFrames={5} /> : null;
};

/** Generic cut: any PhotoShot + flash at start. */
const Cut: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <Flash />
  </>
);

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {/* Cut 1 — Detailer hands + polishing machine on glossy hood */}
      <Sequence from={0} durationInFrames={CUT_LEN}>
        <Cut>
          <DetailerShot
            startBox={DETAILER_CROPS.machineClose}
            endBox={{ x0: 0.16, y0: 0.30, x1: 0.70, y1: 0.80 }}
            durationInFrames={CUT_LEN}
          />
        </Cut>
      </Sequence>

      {/* Cut 2 — LED headlight detail (car.jpg) */}
      <Sequence from={CUT_LEN} durationInFrames={CUT_LEN}>
        <Cut>
          <CarShot
            startBox={CAR_CROPS.headlight}
            endBox={{ x0: 0.06, y0: 0.26, x1: 0.48, y1: 0.60 }}
            durationInFrames={CUT_LEN}
          />
        </Cut>
      </Sequence>

      {/* Cut 3 — Mercedes star / diamond-mesh grille (car2.jpg) */}
      <Sequence from={CUT_LEN * 2} durationInFrames={CUT_LEN}>
        <Cut>
          <Car2Shot
            startBox={CAR2_CROPS.star}
            endBox={{ x0: 0.26, y0: 0.38, x1: 0.84, y1: 0.76 }}
            durationInFrames={CUT_LEN}
          />
        </Cut>
      </Sequence>

      {/* Cut 4 — AMG wheel arch (car.jpg) */}
      <Sequence from={CUT_LEN * 3} durationInFrames={CUT_LEN}>
        <Cut>
          <CarShot
            startBox={CAR_CROPS.wheel}
            endBox={{ x0: 0.10, y0: 0.54, x1: 0.56, y1: 1.00 }}
            durationInFrames={CUT_LEN}
          />
        </Cut>
      </Sequence>

      {/* Cut 5 — Full studio scene: detailer, hexagonal lights, whole car */}
      <Sequence from={CUT_LEN * 4} durationInFrames={CUT_LEN}>
        <Cut>
          <DetailerShot
            startBox={DETAILER_CROPS.fullScene}
            endBox={{ x0: 0.02, y0: 0.02, x1: 0.96, y1: 0.96 }}
            durationInFrames={CUT_LEN}
          />
        </Cut>
      </Sequence>

      {/* Overlays shared across all cuts */}
      <Grain opacity={0.05} />
      <Vignette />

      <BodyText
        lines={["Najpierw sprawdź,", "czego potrzebuje Twoje auto."]}
        localFrame={frame - 14}
        exitAt={104}
      />

      <LogoMark opacity={0.5} />
    </AbsoluteFill>
  );
};

// ── Scene 3 — Mercedes front reveal (car2.jpg) ────────────────────────────
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const revealGlow = interpolate(frame, [0, 80], [0.08, 0.26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Car2Shot
        startBox={CAR2_CROPS.star}
        endBox={CAR2_CROPS.fullFront}
        durationInFrames={120}
        fadeInFrames={8}
      />

      {/* Brand orange ambient rising from below (studio floor reflection) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 92%, rgba(255,100,0,${revealGlow}) 0%, transparent 50%)`,
        }}
      />

      <LightRays opacity={0.18} />
      <Grain opacity={0.04} />
      <Vignette />

      <BodyText
        lines={["Dobierzemy właściwe", "rozwiązanie."]}
        localFrame={frame - 10}
        exitAt={104}
        anchor="bottom"
      />

      <LogoMark opacity={0.62} />
    </AbsoluteFill>
  );
};

// ── Transition & end-card helpers ─────────────────────────────────────────
const TransitionFlash: React.FC = () => {
  const localFrame = useCurrentFrame();
  return <CutFlash localFrame={localFrame} totalFrames={10} />;
};

const EndCardWrapper: React.FC = () => {
  const frame = useCurrentFrame();
  return <EndCard localFrame={frame} />;
};

// ── Root composition ──────────────────────────────────────────────────────
export const HarryAd: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#000000",
      scale: 0.961,
    }}
  >
    <Audio src={staticFile("audio.wav")} />

    <Sequence from={42} durationInFrames={197} name="Scene 1 – Hook">
      <Scene1 />
    </Sequence>

    <Sequence from={84} durationInFrames={14} name="Flash 1">
      <TransitionFlash />
    </Sequence>

    <Sequence from={90} durationInFrames={120} name="Scene 2 – Detail cuts">
      <Scene2 />
    </Sequence>

    <Sequence from={204} durationInFrames={10} name="Flash 2">
      <TransitionFlash />
    </Sequence>

    <Sequence from={210} durationInFrames={120} name="Scene 3 – Reveal">
      <Scene3 />
    </Sequence>

    <Sequence from={324} durationInFrames={10} name="Flash 3">
      <TransitionFlash />
    </Sequence>

    <Sequence from={330} durationInFrames={120} name="Scene 4 – End card">
      <EndCardWrapper />
    </Sequence>
  </AbsoluteFill>
);
