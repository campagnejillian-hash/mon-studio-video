import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

/**
 * iPhone 19 Fold — publicité futuriste style Apple (2028).
 * 15 s · 1920×1080 · 30 fps (450 frames).
 * Fond spatial profond, explosions de particules, ondes de choc,
 * révélation 3D d'un smartphone pliable, final épique avec logo Apple.
 */

const FONT =
  "'Helvetica Neue', Helvetica, 'Inter', 'SF Pro Display', Arial, sans-serif";
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.45, 0, 0.55, 1);

// Bruit pseudo-aléatoire déterministe (reproductible frame par frame).
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const fadeIn = (f: number, start: number, end: number) =>
  interpolate(f, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

const fadeOut = (f: number, start: number, end: number) =>
  interpolate(f, [start, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });

const kenBurns = (f: number, s: number, e: number, from = 1, to = 1.05) =>
  interpolate(f, [s, e], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

const ACCENTS = ["#7df9ff", "#5e6bff", "#c77dff", "#ffffff", "#8affd1"];

const centered: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// ---------- Champ d'étoiles scintillantes (fond spatial) ----------
const Starfield: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(140).fill(0).map((_, i) => {
        const x = rand(i) * 1920;
        const y = rand(i + 50) * 1080;
        const base = 0.15 + rand(i + 100) * 0.6;
        const tw = 0.5 + 0.5 * Math.sin(frame / 11 + i);
        const size = 1 + rand(i + 200) * 2.2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#ffffff",
              opacity: base * tw,
              boxShadow: "0 0 4px #ffffff",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Explosion de particules ----------
const Burst: React.FC<{
  start: number;
  count?: number;
  maxDist?: number;
  duration?: number;
  size?: number;
}> = ({ start, count = 70, maxDist = 780, duration = 55, size = 9 }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  if (local < 0 || local > duration) return null;
  const p = local / duration;
  const dist = interpolate(p, [0, 1], [0, 1], { easing: EASE_OUT });
  const opacity = interpolate(p, [0, 0.08, 1], [0, 1, 0]);
  return (
    <AbsoluteFill style={centered}>
      <div style={{ position: "relative", width: 0, height: 0 }}>
        {new Array(count).fill(0).map((_, i) => {
          const angle = rand(i + start) * Math.PI * 2;
          const speed = 0.35 + rand(i + start + 7) * 0.65;
          const d = dist * maxDist * speed;
          const x = Math.cos(angle) * d;
          const y = Math.sin(angle) * d;
          const s = size * (0.4 + rand(i + start + 13));
          const c = ACCENTS[i % ACCENTS.length];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: s,
                height: s,
                borderRadius: "50%",
                background: c,
                opacity,
                boxShadow: `0 0 ${s * 2.4}px ${c}`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Onde de choc ----------
const Shockwave: React.FC<{
  start: number;
  duration?: number;
  color?: string;
  maxSize?: number;
}> = ({ start, duration = 42, color = "#7df9ff", maxSize = 1500 }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  if (local < 0 || local > duration) return null;
  const p = local / duration;
  const size = interpolate(p, [0, 1], [0, maxSize], { easing: EASE_OUT });
  const opacity = interpolate(p, [0, 0.12, 1], [0, 0.7, 0]);
  const border = interpolate(p, [0, 1], [10, 1]);
  return (
    <AbsoluteFill style={centered}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${border}px solid ${color}`,
          opacity,
          boxShadow: `0 0 50px ${color}`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- iPhone pliable qui s'ouvre en 3D ----------
const FoldablePhone: React.FC<{ open: number; glow: number; float: number }> = ({
  open,
  glow,
  float,
}) => {
  const leftRot = interpolate(open, [0, 1], [-88, 0]);
  const rightRot = interpolate(open, [0, 1], [88, 0]);
  const screen =
    "linear-gradient(150deg, #7df9ff 0%, #5e6bff 45%, #c77dff 100%)";

  const halfStyle = (side: "left" | "right", rot: number): React.CSSProperties => ({
    width: 232,
    height: 610,
    background: screen,
    transformOrigin: side === "left" ? "right center" : "left center",
    transform: `rotateY(${rot}deg)`,
    borderTopLeftRadius: side === "left" ? 40 : 3,
    borderBottomLeftRadius: side === "left" ? 40 : 3,
    borderTopRightRadius: side === "right" ? 40 : 3,
    borderBottomRightRadius: side === "right" ? 40 : 3,
    boxShadow: `0 0 ${60 * glow}px rgba(125,249,255,${0.7 * glow})`,
    border: "2px solid rgba(255,255,255,0.3)",
    position: "relative",
    overflow: "hidden",
  });

  const glare: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 35%)",
  };

  return (
    <AbsoluteFill style={centered}>
      <div
        style={{
          display: "flex",
          perspective: 1700,
          transform: `translateY(${float}px)`,
        }}
      >
        <div style={halfStyle("left", leftRot)}>
          <div style={glare} />
        </div>
        <div style={halfStyle("right", rightRot)}>
          <div style={glare} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Logo Apple (silhouette officielle, viewBox 24×24).
const AppleLogo: React.FC<{ size: number; opacity: number }> = ({
  size,
  opacity,
}) => (
  <svg
    width={size}
    height={size * 1.23}
    viewBox="0 0 24 29"
    style={{
      opacity,
      filter: "drop-shadow(0 0 22px rgba(255,255,255,0.55))",
    }}
  >
    <path
      fill="#ffffff"
      d="M17.05 22.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 17.25 3.51 9.59 9.05 9.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 9.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
    />
  </svg>
);

// Un mot-clé qui surgit avec un léger pop.
const Feature: React.FC<{ word: string; start: number }> = ({
  word,
  start,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, start, start + 10) * fadeOut(frame, start + 16, start + 28);
  if (frame < start - 2 || frame > start + 30) return null;
  const scale = interpolate(frame, [start, start + 14], [1.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  return (
    <AbsoluteFill style={centered}>
      <h2
        style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: 128,
          color: "#ffffff",
          margin: 0,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          opacity,
          transform: `scale(${scale})`,
          textShadow:
            "0 0 30px rgba(125,249,255,0.7), 0 0 70px rgba(94,107,255,0.4)",
        }}
      >
        {word}
      </h2>
    </AbsoluteFill>
  );
};

export const IPhone19: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- Scène 1 : ignition (0–90) ----
  const coreScale = interpolate(frame, [0, 30], [0, 1.4], {
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const coreOpacity = fadeIn(frame, 0, 18) * fadeOut(frame, 28, 40);

  // ---- Scène 2 : titre iPhone 19 Fold (78–190) ----
  const titleOpacity = fadeIn(frame, 82, 106) * fadeOut(frame, 168, 190);
  const titleScale = interpolate(frame, [82, 112], [1.45, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const titleKen = kenBurns(frame, 82, 190, 1, 1.05);
  const foldWordOpacity = fadeIn(frame, 120, 145) * fadeOut(frame, 168, 190);

  // ---- Scène 3 : révélation pliable (185–305) ----
  const foldOpen = interpolate(frame, [195, 258], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  const foldOpacity = fadeIn(frame, 188, 208) * fadeOut(frame, 288, 306);
  const foldFloat = Math.sin((frame - 195) / 20) * 14;
  const foldGlow = fadeIn(frame, 245, 268);

  // ---- Scène 5 : finale (370–450) ----
  const finaleLogo = fadeIn(frame, 392, 420);
  const finaleTitle = fadeIn(frame, 402, 430);
  const finaleTag = fadeIn(frame, 420, 446);
  const finaleKen = kenBurns(frame, 385, 450, 1, 1.04);
  const blackout = fadeIn(frame, 436, 450);

  // ---- Flashs blancs aux moments d'impact ----
  const flashAt = (c: number, mag = 1) =>
    fadeIn(frame, c - 2, c) * fadeOut(frame, c, c + 12) * mag;
  const flash = Math.max(
    flashAt(30),
    flashAt(108),
    flashAt(252, 0.7),
    flashAt(386),
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #0d1738 0%, #05060f 55%, #000000 100%)",
      }}
    >
      <Starfield />

      {/* SCÈNE 1 — noyau d'énergie + explosion */}
      {frame < 95 && (
        <>
          <AbsoluteFill style={centered}>
            <div
              style={{
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #ffffff 0%, #7df9ff 40%, rgba(94,107,255,0) 72%)",
                opacity: coreOpacity,
                transform: `scale(${coreScale})`,
                filter: "blur(4px)",
              }}
            />
          </AbsoluteFill>
          <Shockwave start={30} maxSize={1700} />
          <Burst start={30} count={90} maxDist={950} size={11} />
        </>
      )}

      {/* SCÈNE 2 — titre iPhone 19 Fold */}
      {frame >= 78 && frame < 195 && (
        <>
          <Shockwave start={108} maxSize={1300} color="#c77dff" />
          <Burst start={108} count={55} maxDist={620} size={8} />
          <AbsoluteFill style={centered}>
            <div
              style={{
                textAlign: "center",
                transform: `scale(${titleScale * titleKen})`,
              }}
            >
              <h1
                style={{
                  fontFamily: FONT,
                  fontWeight: 200,
                  fontSize: 180,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "0.01em",
                  opacity: titleOpacity,
                  textShadow:
                    "0 0 40px rgba(125,249,255,0.6), 0 0 90px rgba(94,107,255,0.4)",
                }}
              >
                iPhone 19
              </h1>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 96,
                  margin: 0,
                  marginTop: 6,
                  letterSpacing: "0.12em",
                  opacity: foldWordOpacity,
                  background:
                    "linear-gradient(100deg, #7df9ff, #c77dff, #5e6bff)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                FOLD
              </div>
            </div>
          </AbsoluteFill>
        </>
      )}

      {/* SCÈNE 3 — l'iPhone pliable s'ouvre */}
      {frame >= 185 && frame < 310 && (
        <>
          <AbsoluteFill style={{ opacity: foldOpacity }}>
            <FoldablePhone open={foldOpen} glow={foldGlow} float={foldFloat} />
          </AbsoluteFill>
          <Shockwave start={252} maxSize={1500} color="#8affd1" />
          <Burst start={252} count={80} maxDist={880} size={10} />
        </>
      )}

      {/* SCÈNE 4 — rafale de mots-clés */}
      {frame >= 296 && frame < 388 && (
        <>
          <Feature word="Titane liquide." start={300} />
          <Feature word="Neural Fold." start={328} />
          <Feature word="Écran infini." start={356} />
          <Burst start={300} count={40} maxDist={520} size={7} />
          <Burst start={328} count={40} maxDist={520} size={7} />
          <Burst start={356} count={40} maxDist={520} size={7} />
        </>
      )}

      {/* SCÈNE 5 — finale : explosion + logo Apple */}
      {frame >= 370 && (
        <>
          <Shockwave start={386} maxSize={1900} color="#7df9ff" />
          <Burst start={386} count={110} maxDist={1050} size={12} />
          <AbsoluteFill style={centered}>
            <div
              style={{
                textAlign: "center",
                transform: `scale(${finaleKen})`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <AppleLogo size={92} opacity={finaleLogo} />
              </div>
              <h1
                style={{
                  fontFamily: FONT,
                  fontWeight: 200,
                  fontSize: 118,
                  color: "#ffffff",
                  margin: 0,
                  marginTop: 30,
                  letterSpacing: "0.02em",
                  opacity: finaleTitle,
                  textShadow: "0 0 40px rgba(125,249,255,0.5)",
                }}
              >
                iPhone 19 Fold
              </h1>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: 46,
                  color: "rgba(255,255,255,0.82)",
                  margin: 0,
                  marginTop: 26,
                  letterSpacing: "0.05em",
                  opacity: finaleTag,
                }}
              >
                Le futur se plie à vous.
              </p>
            </div>
          </AbsoluteFill>
        </>
      )}

      {/* Flash blanc d'impact */}
      <AbsoluteFill
        style={{ backgroundColor: "#ffffff", opacity: flash * 0.85 }}
      />

      {/* Fondu au noir final */}
      <AbsoluteFill
        style={{ backgroundColor: "#000000", opacity: blackout }}
      />
    </AbsoluteFill>
  );
};
