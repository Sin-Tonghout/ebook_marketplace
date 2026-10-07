"use client";

import { useId, useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function Tabs({ items, defaultValue, className }: TabsProps) {
  const [value, setValue] = useState(defaultValue ?? items[0].value);
  const id = useId();

  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={setValue}
      className={className}
    >
      <TabsPrimitive.List className="flex gap-6 overflow-x-auto border-b border-border">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "relative shrink-0 whitespace-nowrap pb-3 type-label text-muted",
              "transition-colors duration-(--duration-fast)",
              "hover:text-foreground data-[state=active]:text-foreground"
            )}
          >
            {item.label}
            {value === item.value && (
              <motion.span
                layoutId={`tab-underline-${id}`}
                className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="pt-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}