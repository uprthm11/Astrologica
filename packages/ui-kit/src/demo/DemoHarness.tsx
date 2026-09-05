import React, { useState } from 'react';
import {
  CinematicHeading,
  CinematicBody,
  CinematicButton,
  CinematicCard,
  GlowIcon,
  CinematicScrollArea,
  colors,
} from '../index';

export const DemoHarness: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <section className="space-y-3">
        <CinematicHeading level={1} tracking="widest">
          UI Kit Storybook Harness
        </CinematicHeading>
        <CinematicBody variant="lead">
          Interstellar design system primitives: borderless, deep obsidian glass, hairline rims.
        </CinematicBody>
      </section>

      {/* Primitives Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CinematicCard + GlowIcon + Button */}
        <CinematicCard glowColor={colors.glows.purple}>
          <div className="flex items-center gap-4 mb-4">
            <GlowIcon color={colors.celestial.pluto} size="md">
              ✦
            </GlowIcon>
            <div>
              <CinematicHeading level={3} tracking="wide">
                Transformation Core
              </CinematicHeading>
              <CinematicBody variant="caption" dimmed>
                Archetypal Plutonian Shift
              </CinematicBody>
            </div>
          </div>
          <CinematicBody className="mb-6">
            Demonstrating obsidian glass card with dynamic radial hover glow and hairline rim.
          </CinematicBody>
          <div className="flex items-center gap-3">
            <CinematicButton
              variant="glow"
              glowColor={colors.glows.purple}
              onClick={() => setClickCount((c) => c + 1)}
            >
              Trigger Flare ({clickCount})
            </CinematicButton>
            <CinematicButton variant="ghost">Secondary</CinematicButton>
          </div>
        </CinematicCard>

        {/* Scroll Area Demo */}
        <CinematicCard glowColor={colors.glows.emerald}>
          <CinematicHeading level={3} tracking="wide" className="mb-2">
            Cinematic Scroll Area
          </CinematicHeading>
          <CinematicBody variant="caption" dimmed className="mb-4">
            Invisible scrollbars with momentum dampening
          </CinematicBody>
          <CinematicScrollArea maxHeight="160px" className="space-y-3 pr-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs font-mono text-zinc-400"
              >
                Telemetry Stream Node #{i + 1} &bull; Coordinates: {12.5 + i * 4.2}°, -45.2°
              </div>
            ))}
          </CinematicScrollArea>
        </CinematicCard>
      </section>
    </div>
  );
};

export default DemoHarness;
