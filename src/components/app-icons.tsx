"use client";

import * as React from "react";
import type { LucideProps } from "lucide-react";
import { ICONS, type IconName } from "@/lib/icons";

export type AppIconProps = Omit<LucideProps, "ref"> & {
  /** Pick from your approved registry */
  name: IconName;
};

/**
 * Centralized icon component:
 * - sets sensible defaults
 * - keeps props consistent across the app
 * - easy theming via className (uses currentColor)
 */
export function AppIcon({
  name,
  size = 17,          // default size for your design system
  strokeWidth = 2,     // Lucide default = 2 (1–3 is typical)
  absoluteStrokeWidth, // keep lines consistent across sizes if you like
  className,
  ...props
}: AppIconProps) {
  const Icon = ICONS[name];
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth={absoluteStrokeWidth}
      className={className}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    />
  );
}
