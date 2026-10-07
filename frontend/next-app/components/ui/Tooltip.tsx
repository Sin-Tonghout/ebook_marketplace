"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export interface TooltipProps {
  content: string;
  children: React.ReactNode; // must be a single element that accepts a ref
  side?: "top" | "right" | "bottom" | "left";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={8}
            className="z-50 animate-pop-in rounded-sm bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-card"
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}