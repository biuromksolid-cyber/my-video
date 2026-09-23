import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type CropBox = { x0: number; y0: number; x1: number; y1: number };

function getCropStyle(
  box: CropBox,
  naturalW: number,
  naturalH: number,
  containerW: number,
  containerH: number,
) {
  const sx0 = box.x0 * naturalW;
  const sy0 = box.y0 * naturalH;
  const sw = (box.x1 - box.x0) * naturalW;
  const sh = (box.y1 - box.y0) * naturalH;
  const baseScale = Math.max(containerW / sw, containerH / sh);
  const imgW = naturalW * baseScale;
  const imgH = naturalH * baseScale;
  const cropCenterX = (sx0 + sw / 2) * baseScale;
  const cropCenterY = (sy0 + sh / 2) * baseScale;
  return {
    left: containerW / 2 - cropCenterX,
    top: containerH / 2 - cropCenterY,
    width: imgW,
    height: imgH,
  };
}

function lerpBox(a: CropBox, b: CropBox, t: number): CropBox {
  return {
    x0: a.x0 + (b.x0 - a.x0) * t,
    y0: a.y0 + (b.y0 - a.y0) * t,
    x1: a.x1 + (b.x1 - a.x1) * t,
    y1: a.y1 + (b.y1 - a.y1) * t,
  };
}

// car.jpg — 1080×1080, side view of Mercedes GLE
export const CAR_CROPS: Record<string, CropBox> = {
  hood: { x0: 0.18, y0: 0.0, x1: 0.84, y1: 0.4 },
  headlight: { x0: 0.02, y0: 0.22, x1: 0.52, y1: 0.64 },
  wheel: { x0: 0.08, y0: 0.52, x1: 0.58, y1: 1.0 },
  frontBumper: { x0: 0.0, y0: 0.38, x1: 0.5, y1: 0.84 },
  sidePanel: { x0: 0.42, y0: 0.18, x1: 1.0, y1: 0.8 },
  fullCar: { x0: 0.0, y0: 0.0, x1: 1.0, y1: 1.0 },
};

// detailer.png — 2048×2048, detailer with polishing machine + hexagonal LED lights
export const DETAILER_CROPS: Record<string, CropBox> = {
  hexHood: { x0: 0.0, y0: 0.2, x1: 0.62, y1: 0.72 },
  machineClose: { x0: 0.12, y0: 0.28, x1: 0.72, y1: 0.82 },
  fullScene: { x0: 0.0, y0: 0.0, x1: 1.0, y1: 1.0 },
};

// car2.jpg — 1200×1500, Mercedes GLE front view
export const CAR2_CROPS: Record<string, CropBox> = {
  hood: { x0: 0.05, y0: 0.0, x1: 0.95, y1: 0.45 },
  star: { x0: 0.22, y0: 0.35, x1: 0.88, y1: 0.8 },
  fullFront: { x0: 0.0, y0: 0.0, x1: 1.0, y1: 1.0 },
};

interface PhotoShotProps {
  src: string;
  naturalW: number;
  naturalH: number;
  startBox: CropBox;
  endBox: CropBox;
  durationInFrames: number;
  fadeInFrames?: number;
}

export const PhotoShot: React.FC<PhotoShotProps> = ({
  src,
  naturalW,
  naturalH,
  startBox,
  endBox,
  durationInFrames,
  fadeInFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const box = lerpBox(startBox, endBox, t);
  const style = getCropStyle(box, naturalW, naturalH, width, height);
  const fadeIn =
    fadeInFrames > 0
      ? interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: fadeIn }} from={55}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: style.left,
          top: style.top,
          width: style.width,
          height: style.height,
          translate: "866px -6px",
        }}
        durationInFrames={144}
        from={-53}
      />
    </AbsoluteFill>
  );
};

export const CarShot: React.FC<
  Omit<PhotoShotProps, "src" | "naturalW" | "naturalH">
> = (p) => <PhotoShot src="car.jpg" naturalW={1080} naturalH={1080} {...p} />;

export const DetailerShot: React.FC<
  Omit<PhotoShotProps, "src" | "naturalW" | "naturalH">
> = (p) => (
  <PhotoShot src="detailer.png" naturalW={2048} naturalH={2048} {...p} />
);

export const Car2Shot: React.FC<
  Omit<PhotoShotProps, "src" | "naturalW" | "naturalH">
> = (p) => <PhotoShot src="car2.jpg" naturalW={1200} naturalH={1500} {...p} />;
