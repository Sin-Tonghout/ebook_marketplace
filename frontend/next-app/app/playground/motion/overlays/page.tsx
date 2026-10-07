"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function OverlayPlayground() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState<"right" | "left" | "bottom" | null>(null);
  const { toast } = useToast();
  const [count, setCount] = useState(0);

  return (
    <main className="mx-auto max-w-3xl space-y-10 p-8">
      <h1 className="type-h2">Overlay motion</h1>

      <Link href="/playground/motion" className="underline">
        ← Back to motion playground (tests page transition)
      </Link>

      <section className="space-y-3">
        <h2 className="type-h4">Modal</h2>
        <Button onClick={() => setModal(true)}>Open modal</Button>
      </section>

      <section className="space-y-3">
        <h2 className="type-h4">Drawer</h2>
        <div className="flex gap-3">
          <Button onClick={() => setDrawer("right")}>Right</Button>
          <Button onClick={() => setDrawer("left")}>Left</Button>
          <Button onClick={() => setDrawer("bottom")}>Bottom sheet</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="type-h4">Toast</h2>
        <Button
          onClick={() => {
            setCount((n) => n + 1);
            toast({
              title: `Book added to your library (${count + 1})`,
              description: "You can start reading now.",
              variant: "success",
            });
          }}
        >
          Add toast
        </Button>
      </section>

      <Modal
        open={modal}
        onOpenChange={setModal}
        title="Remove from library?"
        description="Press Esc or click outside to close."
        footer={<Button onClick={() => setModal(false)}>Close</Button>}
      />

      <Drawer
        open={drawer !== null}
        onOpenChange={(o) => !o && setDrawer(null)}
        side={drawer ?? "right"}
        title="Filters"
        description="Drawer content goes here."
        footer={<Button onClick={() => setDrawer(null)}>Done</Button>}
      />
    </main>
  );
}