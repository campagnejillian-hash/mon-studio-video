import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

/**
 * BRIZÉ — publicité cinématographique dans l'esprit Apple.
 * 20 s · 1920×1080 · 30 fps (600 frames).
 * Fond noir profond, typographie blanche fine, fondus lents, effet Ken Burns.
 */

// Pile de polices sans-serif fines et modernes (Helvetica / Inter).
const FONT =
  "'Helvetica Neue', Helvetica, 'Inter', 'SF Pro Display', Arial, sans-serif";

// Courbes d'easing douces, façon Apple (ease-out expressif / ease-in-out).
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.45, 0, 0.55, 1);

// Fondu d'entrée : reste à 1 une fois terminé (clamp).
const fadeIn = (f: number, start: number, end: number) =>
  interpolate(f, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

// Fondu de sortie : vaut 1 avant de commencer (clamp), puis descend à 0.
const fadeOut = (f: number, start: number, end: number) =>
  interpolate(f, [start, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });

// Effet « Ken Burns » : léger zoom lent et continu pour garder l'image vivante.
const kenBurns = (
  f: number,
  start: number,
  end: number,
  from = 1,
  to = 1.06,
) =>
  interpolate(f, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

const centered: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const textBase: React.CSSProperties = {
  color: "#ffffff",
  fontFamily: FONT,
  fontWeight: 200,
  margin: 0,
  padding: 0,
  lineHeight: 1.1,
  width: "100%",
  textAlign: "center",
  WebkitFontSmoothing: "antialiased",
};

// Halo lumineux central, très doux.
const Halo: React.FC<{ opacity: number; scale: number }> = ({
  opacity,
  scale,
}) => (
  <AbsoluteFill style={centered}>
    <div
      style={{
        width: 1400,
        height: 1400,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 32%, rgba(0,0,0,0) 68%)",
        opacity,
        transform: `scale(${scale})`,
        filter: "blur(30px)",
      }}
    />
  </AbsoluteFill>
);

export const Brize: React.FC = () => {
  const frame = useCurrentFrame();

  // ----- SCÈNE 1 & 2 : le mot BRIZÉ (0 → 8 s / frames 0–240) -----
  // Le halo respire au tout début.
  const haloOpacity =
    fadeIn(frame, 0, 55) * fadeOut(frame, 210, 245);
  const haloScale = kenBurns(frame, 0, 240, 0.9, 1.12);

  // BRIZÉ : apparaît en fondu lent, puis rétrécit et monte en scène 2.
  const brizeOpacity = fadeIn(frame, 30, 95) * fadeOut(frame, 228, 252);
  const brizeSize = interpolate(frame, [120, 165], [240, 132], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  const brizeY = interpolate(frame, [120, 165], [0, -150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  // Micro-zoom Ken Burns pendant l'apparition initiale.
  const brizeKen = kenBurns(frame, 0, 120, 1.05, 1.0);

  // Slogan sous BRIZÉ en scène 2.
  const sloganOpacity = fadeIn(frame, 165, 210) * fadeOut(frame, 228, 252);
  const sloganKen = kenBurns(frame, 150, 252, 1.0, 1.04);

  // ----- SCÈNE 3 : trois mots-clés en fondu enchaîné (8 → 13 s / 240–390) -----
  const kw1 = fadeIn(frame, 246, 272) * fadeOut(frame, 292, 314);
  const kw2 = fadeIn(frame, 300, 324) * fadeOut(frame, 342, 362);
  const kw3 = fadeIn(frame, 348, 372) * fadeOut(frame, 388, 408);
  const kwKen = kenBurns(frame, 240, 400, 1.0, 1.05);

  // ----- SCÈNE 4 : phrase plus grande (13 → 17 s / 390–510) -----
  const phraseOpacity = fadeIn(frame, 402, 448) * fadeOut(frame, 488, 512);
  const phraseKen = kenBurns(frame, 390, 512, 1.02, 1.08);

  // ----- SCÈNE 5 : logo final + « Disponible maintenant » (17 → 20 s / 510–600) -----
  const finalHaloOpacity = fadeIn(frame, 520, 570);
  const finalHaloScale = kenBurns(frame, 510, 600, 0.9, 1.05);
  const finalLogoOpacity = fadeIn(frame, 525, 568);
  const finalTagOpacity = fadeIn(frame, 552, 585);
  const finalKen = kenBurns(frame, 510, 600, 1.0, 1.04);

  // Fondu au noir final, sur toute l'image.
  const blackout = fadeIn(frame, 582, 600);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Halos lumineux (début + fin) */}
      {frame < 250 && <Halo opacity={haloOpacity} scale={haloScale} />}
      {frame >= 505 && (
        <Halo opacity={finalHaloOpacity} scale={finalHaloScale} />
      )}

      {/* BRIZÉ (scènes 1–2) */}
      {frame < 255 && (
        <AbsoluteFill style={centered}>
          <h1
            style={{
              ...textBase,
              fontSize: brizeSize,
              fontWeight: 200,
              letterSpacing: "0.14em",
              opacity: brizeOpacity,
              transform: `translateY(${brizeY}px) scale(${brizeKen})`,
              textIndent: "0.14em",
            }}
          >
            BRIZÉ
          </h1>
        </AbsoluteFill>
      )}

      {/* Slogan scène 2 */}
      {frame >= 150 && frame < 255 && (
        <AbsoluteFill style={centered}>
          <p
            style={{
              ...textBase,
              fontSize: 52,
              fontWeight: 300,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.82)",
              opacity: sloganOpacity,
              transform: `translateY(60px) scale(${sloganKen})`,
            }}
          >
            Repensez la fraîcheur.
          </p>
        </AbsoluteFill>
      )}

      {/* Scène 3 : mots-clés en fondu enchaîné */}
      {frame >= 240 && frame < 410 && (
        <AbsoluteFill style={centered}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 200,
              transform: `scale(${kwKen})`,
            }}
          >
            {[
              { word: "Silencieux.", opacity: kw1 },
              { word: "Élégant.", opacity: kw2 },
              { word: "Puissant.", opacity: kw3 },
            ].map(({ word, opacity }) => (
              <h2
                key={word}
                style={{
                  ...textBase,
                  width: "auto",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  whiteSpace: "nowrap",
                  fontSize: 140,
                  fontWeight: 200,
                  letterSpacing: "0.03em",
                  opacity,
                }}
              >
                {word}
              </h2>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* Scène 4 : phrase */}
      {frame >= 390 && frame < 515 && (
        <AbsoluteFill style={centered}>
          <h2
            style={{
              ...textBase,
              fontSize: 118,
              fontWeight: 300,
              letterSpacing: "0.02em",
              maxWidth: 1500,
              opacity: phraseOpacity,
              transform: `scale(${phraseKen})`,
            }}
          >
            Conçu pour votre confort.
          </h2>
        </AbsoluteFill>
      )}

      {/* Scène 5 : logo final + tagline */}
      {frame >= 505 && (
        <AbsoluteFill style={centered}>
          <div style={{ transform: `scale(${finalKen})` }}>
            <h1
              style={{
                ...textBase,
                fontSize: 150,
                fontWeight: 200,
                letterSpacing: "0.14em",
                opacity: finalLogoOpacity,
                textIndent: "0.14em",
              }}
            >
              BRIZÉ
            </h1>
            <p
              style={{
                ...textBase,
                fontSize: 42,
                fontWeight: 300,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.75)",
                marginTop: 34,
                opacity: finalTagOpacity,
              }}
            >
              Disponible maintenant
            </p>
          </div>
        </AbsoluteFill>
      )}

      {/* Fondu au noir final */}
      <AbsoluteFill
        style={{ backgroundColor: "#000000", opacity: blackout }}
      />
    </AbsoluteFill>
  );
};
