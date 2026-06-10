"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { MissionPattern } from "@/lib/content/mission";
import type { ComponentType } from "react";

export type MissionIllustrationProps = {
  active: boolean;
  className?: string;
};

function illustrationLoader(
  importer: () => Promise<{
    default: ComponentType<MissionIllustrationProps>;
  }>,
) {
  return dynamic(importer, { ssr: false });
}

const ILLUSTRATIONS = {
  "pulse-field": illustrationLoader(() =>
    import("@/components/illustrations/pulse-field").then((m) => ({
      default: m.PulseField,
    })),
  ),
  "dot-orbits": illustrationLoader(() =>
    import("@/components/illustrations/dot-orbits").then((m) => ({
      default: m.DotOrbits,
    })),
  ),
  "stepped-lattice": illustrationLoader(() =>
    import("@/components/illustrations/stepped-lattice").then((m) => ({
      default: m.SteppedLattice,
    })),
  ),
  "radiating-segments": illustrationLoader(() =>
    import("@/components/illustrations/radiating-segments").then((m) => ({
      default: m.RadiatingSegments,
    })),
  ),
  "node-mesh": illustrationLoader(() =>
    import("@/components/illustrations/node-mesh").then((m) => ({
      default: m.NodeMesh,
    })),
  ),
} satisfies Record<MissionPattern, ComponentType<MissionIllustrationProps>>;

export function MissionIllustrationFallback({
  className,
}: {
  className?: string;
}) {
  return <div aria-hidden className={className} />;
}

type MissionIllustrationComponentProps = MissionIllustrationProps & {
  pattern: MissionPattern;
};

export function MissionIllustration({
  pattern,
  active,
  className,
}: MissionIllustrationComponentProps) {
  const Illustration = ILLUSTRATIONS[pattern];

  return (
    <Suspense fallback={<MissionIllustrationFallback className={className} />}>
      <Illustration active={active} className={className} />
    </Suspense>
  );
}
